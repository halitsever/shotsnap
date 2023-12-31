import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Shotsnap Documentation",
  description: "Documentation of Shotsnap which is a screenshot package on npm",
  head: [['link', { rel: 'icon', href: '/favicon.svg' }]],
  base: '/shotsnap/',
  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Halit Sever'
    },
    sidebar: [
      {
        text: 'Docs',
        items: [
          { text: 'Getting Started', link: '/get-started' },
          { text: 'Taking Screenshot From A Website', link: '/taking-screenshot' },
          { text: 'Props', link: '/props' },
        ]
      }
    ],
    logo: '/favicon.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],



    socialLinks: [
      { icon: 'github', link: 'https://github.com/halitsever/shotsnap' }
    ]
  }
})
