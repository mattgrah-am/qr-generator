import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  app: {
    head: {
      title: 'QR Short Link Generator',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Generate short links and QR codes with secure user authentication.' }
      ],
      htmlAttrs: {
        class: 'dark'
      }
    }
  },
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss'],
  runtimeConfig: {
    // Private runtime config, not exposed to client
    cloudflare: {
      d1DatabaseId: '',
      r2Bucket: '',
      apiToken: ''
    }
  },
  build: {
    transpile: []
  },
  nitro: {
    // For Cloudflare Workers with D1/R2 bindings (requires ES module format)
    preset: 'cloudflare-module',
    experimental: {
      wasm: true
    }
  },
  compatibilityDate: '2025-06-21',
})