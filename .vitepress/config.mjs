import { defineConfig } from 'vitepress'
import { writeFileSync, readdirSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const siteHost = 'https://zeng417.github.io/weekly-website/'
const weeklyDir = join(__dirname, '..', 'weekly')

// --- 从 weekly/ 目录自动解析期刊数据 ---
function parseWeeklyFiles() {
  if (!existsSync(weeklyDir)) return []

  return readdirSync(weeklyDir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const content = readFileSync(join(weeklyDir, f), 'utf-8')
      const title = (content.match(/^title:\s*(.+)$/m) || [])[1]?.trim() || f
      const date = (content.match(/^date:\s*(.+)$/m) || [])[1]?.trim() || ''
      const slug = f.replace('.md', '')
      const weekMatch = slug.match(/(\d{4})-(\d+)/)
      const year = weekMatch ? weekMatch[1] : '2026'
      const weekNum = weekMatch ? parseInt(weekMatch[2]) : 0

      // 解析各板块是否有内容
      const sections = [
        ['💡 行业洞察', '💡 行业洞察'],
        ['📚 精选教程 & 学习资源', '📚 精选教程'],
        ['🛠️ 开源项目 & 行业案例', '🛠️ 开源项目'],
        ['⚙️ 工程实战 & 踩坑记录', '⚙️ 工程实战'],
        ['📑 顶会前沿 & 论文速递', '📑 论文速递']
      ].filter(([header]) => {
        const escaped = header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const m = content.match(new RegExp(`## ${escaped}([\\s\\S]*?)(?=## |$)`))
        return m && !m[1].includes('*(本周暂无内容)*')
      }).map(([, short]) => short)

      return { title, date, slug, weekNum, year, desc: sections.join(' · '), link: `/weekly/${slug}` }
    })
    .sort((a, b) => b.slug.localeCompare(a.slug))
}

const weeklyList = parseWeeklyFiles()

// --- 自动生成侧边栏（按年份分组，新期在上） ---
function buildSidebar() {
  const byYear = {}
  for (const item of weeklyList) {
    if (!byYear[item.year]) byYear[item.year] = []
    byYear[item.year].push({ text: `第${item.weekNum}周`, link: item.link })
  }
  return Object.keys(byYear)
    .sort((a, b) => b.localeCompare(a))
    .map(year => ({ text: `${year}年`, items: byYear[year] }))
}

// --- RSS 生成插件 ---
function rssPlugin() {
  return {
    name: 'rss-feed',
    closeBundle() {
      const items = weeklyList.map(item => {
        const url = `${siteHost}weekly/${item.slug}.html`
        return `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
    </item>`
      }).join('\n')

      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>具身智能周刊</title>
    <link>${siteHost}</link>
    <description>每周精选行业动态</description>
    <language>zh-CN</language>
${items}
  </channel>
</rss>`

      writeFileSync(join(__dirname, 'dist', 'rss.xml'), rss)
    }
  }
}

export default defineConfig({
  base: '/weekly-website/',
  title: "具身智能周刊",
  description: "每周精选行业动态",
  sitemap: { hostname: siteHost },
  head: [
    ['meta', { property: 'og:title', content: '具身智能周刊' }],
    ['meta', { property: 'og:description', content: '每周精选行业洞察、开源项目与论文速递' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['link', { rel: 'icon', href: '/weekly-website/favicon.ico' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: '具身智能周刊', href: '/weekly-website/rss.xml' }]
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' }
    ],
    sidebar: buildSidebar(),
    weeklyList: weeklyList.map((item, i) => ({
      ...item,
      isLatest: i === 0
    })),
    footer: {
      message: '聚焦具身智能，追踪前沿动态',
      copyright: 'Copyright © 2026 具身智能团队'
    },
    docFooter: {
      prev: '上一期',
      next: '下一期'
    }
  },
  vite: {
    plugins: [rssPlugin()]
  }
})
