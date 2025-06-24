import { getUserFromAccess } from '@/utils/getUserFromAccess'
import type { H3Event } from 'h3'
import { setResponseStatus } from 'h3'

/**
 * GET /api/me
 * Returns the authenticated user's email address as provided by Cloudflare Access.
 * If not authenticated, returns 401 Unauthorized.
 */
export default defineEventHandler((event: H3Event) => {
  const userEmail = getUserFromAccess(event)
  if (!userEmail) {
    setResponseStatus(event, 401)
    return {
      authenticated: false,
      message: 'Unauthorized: Cloudflare Access authentication required.',
    }
  }
  return {
    authenticated: true,
    email: userEmail,
  }
})
