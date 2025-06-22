<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-neutral-100 transition-colors">
    <div class="w-full max-w-xl px-6 py-12 rounded-lg shadow-lg bg-neutral-800/80 backdrop-blur-md border border-neutral-800">
      <div class="flex flex-col items-center gap-4">
        <svg
          class="w-16 h-16 text-neutral-400 mb-2"
          fill="none"
          viewBox="0 0 64 64"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="8" y="8" width="48" height="48" rx="8" stroke="currentColor" stroke-width="4" fill="none"/>
          <path d="M20 20h8v8h-8zM36 20h8v8h-8zM20 36h8v8h-8zM36 36h8v8h-8z" fill="currentColor" />
        </svg>
        <h1 class="text-3xl font-bold text-neutral-100 mb-2 text-center">
          QR Short Link Generator
        </h1>
        <p class="text-neutral-400 text-center mb-4">
          Create, manage, and share short links with QR codes.<br>
          Secure, fast, and privacy-focused.
        </p>
        <template v-if="userEmail">
          <div class="mt-4 text-center">
            <span class="text-neutral-400">Signed in as:</span>
            <span class="font-semibold text-neutral-100 ml-1">{{ userEmail }}</span>
            <a href="/cdn-cgi/access/logout" class="ml-4 underline text-red-400">Sign out</a>
          </div>
        </template>
        <template v-else>
          <a
            href="/"
            class="inline-block px-6 py-2 rounded bg-neutral-400 text-neutral-900 font-semibold shadow hover:bg-neutral-300 transition"
          >
            Sign in with SSO
          </a>
        </template>
      </div>
      <div class="mt-4 text-neutral-400 text-center text-sm">
        <span>
          You will be redirected to your organization's login via Cloudflare Access.
        </span>
      </div>
      <div class="mt-8 text-xs text-neutral-400 text-center">
        Built with <span class="font-semibold">Nuxt 3</span>, <span class="font-semibold">Tailwind CSS</span>, and <span class="font-semibold">Cloudflare</span>.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/me')
const userEmail = data.value?.email || null
</script>

<!-- No custom styles needed; using Tailwind built-in dark mode classes -->
