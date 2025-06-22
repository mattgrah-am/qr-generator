import { defineNuxtRouteMiddleware, useRequestEvent } from 'nuxt/app'
import { getUserFromAccess } from '@/utils/getUserFromAccess'

/**
 * Global middleware to enforce Cloudflare Access authentication.
 * - Checks for the presence of the Cloudflare Access authenticated user email header.
 * - If not present, returns a 401 Unauthorized error.
 * - Allows public access to explicitly whitelisted routes (e.g., landing page).
 *
 * To customize which routes are public, edit the `publicRoutes` array below.
 */

const publicRoutes = [
  '/', // Landing page
  // Add other public routes here if needed
]

export default defineNuxtRouteMiddleware((to) => {
  // Allow public routes without authentication
  if (publicRoutes.includes(to.path)) {
    return
  }

  // Access the current request event (server-side only)
  const event = useRequestEvent()
  if (!event) {
    // On client navigation, skip (Cloudflare Access only protects server-side)
    return
  }

  const userEmail = getUserFromAccess(event)
  if (!userEmail) {
    // Not authenticated via Cloudflare Access
    return event.node.res.end(
      JSON.stringify({
        statusCode: 401,
        statusMessage: 'Unauthorized: Cloudflare Access authentication required.',
      })
    )
  }

  // User is authenticated; proceed
})
