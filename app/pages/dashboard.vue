qr-generator/app/pages/dashboard.vue
<template>
  <div class="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center py-12 px-4">
    <div class="w-full max-w-2xl">
      <h1 class="text-3xl font-bold mb-4 text-center">Your Short Links Dashboard</h1>
      <p class="text-neutral-400 mb-8 text-center">
        Manage your short links and QR codes. Create new links, copy, download, or delete them.
      </p>

      <div class="flex justify-between items-center mb-6">
        <span class="text-lg font-semibold">Your Links</span>
        <form class="flex gap-2 items-center" @submit.prevent="createLink">
          <input
            v-model="newLinkUrl"
            type="url"
            placeholder="https://your-link.com"
            class="px-2 py-1 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400 w-48"
            :disabled="atLimit || creating"
            required
          >
          <button
            type="submit"
            class="px-4 py-2 rounded bg-neutral-400 text-neutral-900 font-semibold shadow hover:bg-neutral-300 transition disabled:opacity-50"
            :disabled="atLimit || creating"
          >
            <span v-if="creating">Creating...</span>
            <span v-else>+ New Link</span>
          </button>
        </form>
      </div>
      <div v-if="createError" class="text-red-400 text-sm mb-2 text-center">{{ createError }}</div>
      <div v-if="createSuccess" class="text-green-400 text-sm mb-2 text-center">{{ createSuccess }}</div>

      <div v-if="error" class="text-red-400 text-center py-4">{{ error }}</div>
      <div v-else-if="loading" class="flex justify-center py-12">
        <span class="text-neutral-400 animate-pulse">Loading your links...</span>
      </div>

      <div v-else>
        <div v-if="links.length === 0" class="text-center text-neutral-500 py-12">
          <svg class="mx-auto mb-4 w-12 h-12 text-neutral-700" fill="none" viewBox="0 0 48 48" stroke="currentColor">
            <rect x="8" y="8" width="32" height="32" rx="8" stroke="currentColor" stroke-width="3" fill="none"/>
            <path d="M18 18h12v12H18z" fill="currentColor" opacity="0.2"/>
          </svg>
          <p class="mb-2">You haven't created any short links yet.</p>
          <p class="text-sm text-neutral-600">Click <span class="font-semibold">+ New Link</span> to get started.</p>
        </div>

        <div v-else class="space-y-4">
          <!-- Placeholder for links list -->
          <div
            v-for="link in links"
            :key="link.id"
            class="flex items-center justify-between bg-neutral-800 rounded px-4 py-3 shadow"
          >
            <div>
              <div class="font-mono text-neutral-100">{{ link.slug }}</div>
              <div class="text-neutral-400 text-sm truncate max-w-xs">{{ link.target_url }}</div>
            </div>
            <div class="flex gap-2">
              <button 
                class="px-2 py-1 rounded bg-neutral-700 text-neutral-200 text-xs hover:bg-neutral-600 transition"
                title="Copy short link"
                @click="copyLink(link.slug)"
              >
                Copy
              </button>
              <button 
                class="px-2 py-1 rounded bg-neutral-700 text-neutral-200 text-xs hover:bg-neutral-600 transition"
                :disabled="!link.qr_url"
                title="Download QR code"
                @click="downloadQR(link)"
              >
                QR
              </button>
              <button 
                class="px-2 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-500 transition disabled:opacity-50"
                :disabled="deleting === link.id"
                title="Delete link"
                @click="deleteLink(link.id)"
              >
                <span v-if="deleting === link.id">...</span>
                <span v-else>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="atLimit" class="mt-6 text-center text-red-400 text-sm">
        You have reached the maximum of 10 links. Delete an existing link to create a new one.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const loading = ref(true)
const atLimit = ref(false)
const links = ref<Array<{ 
  id: string; 
  slug: string; 
  target_url: string; 
  qr_url?: string; 
  created_at: string;
  updated_at?: string;
}>>([])
const error = ref('')
const newLinkUrl = ref('')
const creating = ref(false)
const createError = ref('')
const createSuccess = ref('')
const deleting = ref<string | null>(null)

// Fetch links from API
const fetchLinks = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data, error: fetchError } = await useFetch('/api/links')
    if (fetchError.value) {
      error.value = fetchError.value.statusMessage || 'Failed to load links.'
      links.value = []
    } else if (data.value?.success) {
      links.value = data.value.links || []
      atLimit.value = links.value.length >= 10
    } else {
      error.value = data.value?.message || 'Failed to load links.'
      links.value = []
    }
  } catch (err) {
    error.value = (err as Error).message || 'Failed to load links.'
    links.value = []
  } finally {
    loading.value = false
  }
}

// Create a new link
const createLink = async () => {
  createError.value = ''
  createSuccess.value = ''
  if (!newLinkUrl.value) {
    createError.value = 'Please enter a URL.'
    return
  }
  creating.value = true
  try {
    const { data, error: postError } = await useFetch('/api/links', {
      method: 'POST',
      body: { target_url: newLinkUrl.value },
    })
    if (postError.value) {
      createError.value = postError.value.statusMessage || 'Failed to create link.'
    } else if (data.value?.success) {
      createSuccess.value = 'Short link and QR code created!'
      newLinkUrl.value = ''
      await fetchLinks()
      clearMessages()
    } else {
      createError.value = data.value?.message || 'Failed to create link.'
    }
  } catch (err) {
    createError.value = (err as Error).message || 'Failed to create link.'
  } finally {
    creating.value = false
  }
}

// Delete a link
const deleteLink = async (linkId: string) => {
  if (!confirm('Are you sure you want to delete this link? This action cannot be undone.')) {
    return
  }
  deleting.value = linkId
  try {
    const response = await $fetch(`/api/links/${linkId}`, {
      method: 'DELETE',
    })
    if (response.success) {
      createSuccess.value = 'Link deleted successfully!'
      await fetchLinks()
      clearMessages()
    } else {
      createError.value = response.message || 'Failed to delete link.'
    }
  } catch {
    createError.value = 'Failed to delete link.'
  } finally {
    deleting.value = null
  }
}

// Copy short link to clipboard
const copyLink = async (slug: string) => {
  const shortUrl = `${window.location.origin}/api/s/${slug}`
  try {
    await navigator.clipboard.writeText(shortUrl)
    createSuccess.value = 'Link copied to clipboard!'
    setTimeout(() => { createSuccess.value = '' }, 2000)
  } catch {
    createError.value = 'Failed to copy link.'
    setTimeout(() => { createError.value = '' }, 2000)
  }
}

// Download QR code
const downloadQR = async (link: typeof links.value[0]) => {
  if (!link.qr_url) {
    createError.value = 'QR code not available.'
    return
  }
  
  try {
    const response = await fetch(link.qr_url)
    if (!response.ok) throw new Error('Failed to fetch QR code')
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qr-${link.slug}.png`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    createSuccess.value = 'QR code downloaded!'
    setTimeout(() => { createSuccess.value = '' }, 2000)
  } catch {
    createError.value = 'Failed to download QR code.'
    setTimeout(() => { createError.value = '' }, 2000)
  }
}

// Clear messages after 3 seconds
const clearMessages = () => {
  setTimeout(() => {
    createError.value = ''
    createSuccess.value = ''
  }, 3000)
}

// Initial fetch
onMounted(fetchLinks)
</script>
