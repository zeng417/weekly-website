import { defineConfig } from 'vitepress'
import { writeFileSync, readdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const siteHost = 'https://zeng417.github.io/weekly-website/'

function rssPlugin() {
  return {
    name: 'rss-feed',
    closeBundle() {
      const weeklyDir = join(__dirname, '..', 'weekly')
      const distDir = join(__dirname, 'dist')
      const files = readdirSync(weeklyDir).filter(f => f.endsWith('.md')).sort().reverse()

      const items = files.map(f => {
        const content = readFileSync(join(weeklyDir, f), 'utf-8')
        const titleMatch = content.match(/^title:\s*(.+)$/m)
        const dateMatch = content.match(/^date:\s*(.+)$/m)
        const title = titleMatch ? titleMatch[1].trim() : f
        const date = dateMatch ? new Date(dateMatch[1].trim()) : new Date()
        const slug = f.replace('.md', '')
        return `    <item>
      <title><![CDATA[${title}]]></title>
      <link>${siteHost}weekly/${slug}.html</link>
      <guid>${siteHost}weekly/${slug}.html</guid>
      <pubDate>${date.toUTCString()}</pubDate>
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

      writeFileSync(join(distDir, 'rss.xml'), rss)
    }
  }
}

export default defineConfig({
  base: '/weekly-website/',
  title: "具身智能周刊",
  description: "每周精选行业动态",
  sitemap: {
    hostname: siteHost
  },
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
      { text: '首页', link: '/' },
      { text: '往期周刊', link: '/weekly/2026-39' }
    ],
    sidebar: [
      {
        text: '2026年',
        items: [
          { text: '第39周', link: '/weekly/2026-39' },
          { text: '第38周', link: '/weekly/2026-38' },
          { text: '第37周', link: '/weekly/2026-37' }
        ]
      }
    ],
    search: {
      provider: 'local'
    },
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
