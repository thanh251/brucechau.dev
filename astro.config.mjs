import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import expressiveCode from 'astro-expressive-code'

export default defineConfig({
  site: 'https://brucechau.pages.dev',
  trailingSlash: 'never',
  integrations: [
    expressiveCode({
      themes: ['github-light-default', 'github-dark-default'],
      useDarkModeMediaQuery: false,
      frames: { showCopyToClipboardButton: true },
      styleOverrides: {
        borderRadius: '10px',
        codeFontFamily: '"SFMono-Regular", "SF Mono", Menlo, Consolas, monospace',
        codeFontSize: '13px',
      },
    }),
    mdx(),
    react(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
