import { defineConfig } from 'vitepress'

const siteUrl = 'https://halitsever.github.io/shotsnap/'
const title = 'Shotsnap'
const description = 'Shotsnap is a Node.js library that takes website screenshots from a URL through a cloud browser, or a local one with shotsnap-puppeteer.'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'shotsnap',
  description,
  url: siteUrl,
  codeRepository: 'https://github.com/halitsever/shotsnap',
  programmingLanguage: 'TypeScript',
  runtimePlatform: 'Node.js',
  license: 'https://opensource.org/licenses/MIT',
  author: { '@type': 'Person', name: 'Halit Sever', url: 'https://github.com/halitsever' }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title,
  description,
  head: [
    ['link', { rel: 'icon', href: '/shotsnap/favicon.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:image', content: `${siteUrl}og.png` }],
    ['meta', { property: 'og:image:width', content: '1280' }],
    ['meta', { property: 'og:image:height', content: '640' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)]
  ],
  base: '/shotsnap/',
  sitemap: { hostname: siteUrl },
  transformPageData(pageData) {
    if (pageData.isNotFound) return
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')
    const url = `${siteUrl}${path}`
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(['link', { rel: 'canonical', href: url }], ['meta', { property: 'og:url', content: url }])
  },
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
