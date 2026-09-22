import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "具身智能周刊",
  description: "每周精选行业动态",
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '往期周刊', link: '/weekly/2026-37' }
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
    // 底部页脚
    footer: {
      message: '聚焦具身智能，追踪前沿动态',
      copyright: 'Copyright © 2026 具身智能团队'
    },
    // 底部上一篇/下一篇导航
    docFooter: {
      prev: '上一期',
      next: '下一期'
    }
  }
})