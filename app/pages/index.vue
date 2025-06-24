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
          </div>
          <div class="mt-4 flex gap-4 justify-center">
            <NuxtLink
              to="/dashboard"
              class="inline-block px-6 py-2 rounded bg-neutral-400 text-neutral-900 font-semibold shadow hover:bg-neutral-300 transition"
            >
              Go to Dashboard
            </NuxtLink>
            <a 
              href="/cdn-cgi/access/logout" 
              class="inline-block px-6 py-2 rounded border border-red-600 text-red-400 font-semibold hover:bg-red-600 hover:text-white transition"
            >
              Sign out
            </a>
          </div>
        </template>
        <template v-else>
          <!-- Production SSO -->
          <a
            href="/"
            class="inline-block px-6 py-2 rounded bg-neutral-400 text-neutral-900 font-semibold shadow hover:bg-neutral-300 transition"
          >
            Sign in with SSO
          </a>
          
          <!-- Local Development Bypass -->
          <div v-if="isDev" class="mt-4 p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
            <p class="text-yellow-400 text-sm mb-2">🧑‍💻 Local Development Mode</p>
            <div class="flex gap-2">
              <input
                v-model="devEmail"
                type="email"
                placeholder="Enter any email for testing"
                class="flex-1 px-3 py-2 bg-neutral-700 text-neutral-100 border border-neutral-600 rounded focus:border-neutral-400 focus:outline-none"
              />
              <button
                @click="devLogin"
                :disabled="!devEmail || devLoading"
                class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="devLoading">...</span>
                <span v-else>Login</span>
              </button>
            </div>
          </div>
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

// Redirect authenticated users to dashboard
if (userEmail) {
  await navigateTo('/dashboard')
}

// Development mode detection and state - simplified to always show on localhost
const isDev = ref(true) // Always show for now since we're in local development
const devEmail = ref('test@example.com')
const devLoading = ref(false)

const devLogin = async () => {
  if (!devEmail.value) return
  
  devLoading.value = true
  try {
    await $fetch('/api/dev-login', {
      method: 'POST',
      body: { email: devEmail.value }
    })
    
    // Refresh the page to trigger authentication check
    await navigateTo('/dashboard')
  } catch (error) {
    console.error('Dev login failed:', error)
  } finally {
    devLoading.value = false
  }
}
</script>

<!-- No custom styles needed; using Tailwind built-in dark mode classes -->
