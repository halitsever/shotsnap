import { defineConfig } from 'vitepress'

const siteUrl = 'https://projects.halit.org/shotsnap/'
const title = 'Shotsnap'
const description = 'Shotsnap is a website screenshot API for Node.js: it captures a URL through a hosted cloud browser and returns the image as a Buffer.'

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

const person = { '@type': 'Person', name: 'Halit Sever', url: 'https://halit.org' }

/** BlogPosting and breadcrumbs for posts, FAQPage wherever the page shows an FAQ. */
function pageJsonLd(fm: Record<string, any>, url: string, title: string, pageDescription: string) {
  const graph: object[] = []
  if (fm.date) {
    graph.push(
      {
        '@type': 'BlogPosting',
        headline: fm.headline ?? title,
        description: pageDescription,
        url,
        mainEntityOfPage: url,
        datePublished: fm.date,
        dateModified: fm.date,
        inLanguage: 'en',
        image: `${siteUrl}og.png`,
        keywords: fm.keyword,
        author: person,
        publisher: person,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Shotsnap', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}blog/` },
          { '@type': 'ListItem', position: 3, name: fm.headline ?? title, item: url },
        ],
      },
    )
  }
  if (fm.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: fm.faq.map((f: { q: string; a: string }) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>|`|\*\*/g, '') },
      })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  /** keeps the page hash map out of every page's HTML, which Semrush reads as a low text-to-HTML ratio */
  metaChunk: true,
  lang: 'en-US',
  title,
  description,
  head: [
    /** Cloudflare Web Analytics, one token for every page on projects.halit.org. */
    ['script', { defer: '', src: 'https://static.cloudflareinsights.com/beacon.min.js', 'data-cf-beacon': '{"token": "dd7e54d3f48841c187d72d9dbb92a6b6"}' }],
    ['link', { rel: 'icon', href: '/shotsnap/favicon.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
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
    const fm = pageData.frontmatter
    const pageTitle = fm.title ?? pageData.title
    const pageDescription = fm.description ?? description
    // Pages with titleTemplate: false already carry their full title.
    const fullTitle = fm.titleTemplate === false ? pageTitle : `${pageTitle} | ${title}`
    fm.head ??= []
    fm.head.push(
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: fullTitle }],
      ['meta', { property: 'og:description', content: pageDescription }],
    )
    if (fm.date) fm.head.push(['meta', { property: 'article:published_time', content: fm.date }])
    if (fm.date || fm.faq) fm.head.push(['script', { type: 'application/ld+json' }, JSON.stringify(pageJsonLd(fm, url, pageTitle, pageDescription))])
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
          { text: 'Screenshot a URL in Node.js', link: '/taking-screenshot' },
          { text: 'Props', link: '/props' },
          { text: 'Puppeteer Screenshot vs Shotsnap', link: '/puppeteer-screenshot' },
          { text: 'Free Screenshot API', link: '/free-screenshot-api/' },
        ]
      },
      {
        text: 'Blog',
        items: [
          { text: 'All posts', link: '/blog/' },
          { text: 'thum.io alternative', link: '/blog/thum-io-alternative' },
          { text: 'WordPress mShots API', link: '/blog/wordpress-mshots-api' },
          { text: 'HTML to image in Node.js', link: '/blog/html-to-image-nodejs' },
          { text: 'What is headless Chrome', link: '/blog/what-is-headless-chrome' },
          { text: 'Selenium headless screenshots', link: '/blog/selenium-headless-chrome-screenshot' },
          { text: 'Playwright vs Puppeteer', link: '/blog/playwright-vs-puppeteer-screenshots' },
          { text: 'chrome-headless-shell', link: '/blog/chrome-headless-shell' },
          { text: 'Screenshots on AWS Lambda', link: '/blog/screenshots-aws-lambda' },
        ]
      }
    ],
    logo: { src: '/favicon.svg', alt: 'Shotsnap logo' },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Free API', link: '/free-screenshot-api/' },
      { text: 'Blog', link: '/blog/', activeMatch: '/blog/' },
    ],



    socialLinks: [
      { icon: 'github', link: 'https://github.com/halitsever/shotsnap' }
    ]
  }
})
