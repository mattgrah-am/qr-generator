/**
 * Utility to extract the authenticated user's email from Cloudflare Access headers.
 * Returns the email if present, otherwise null.
 *
 * Usage (in Nuxt server route or middleware):
 *   import { getUserFromAccess } from '@/utils/getUserFromAccess'
 *   const userEmail = getUserFromAccess(event)
 */

import type { H3Event } from 'h3'

/**
 * Extracts the authenticated user's email from Cloudflare Access headers.
 * @param event H3Event (Nuxt server route event)
 * @returns string | null - The user's email if authenticated, otherwise null.
 */
export function getUserFromAccess(event: H3Event): string | null {
  // Cloudflare injects this header after successful Access login
  // Header names are lowercased in Node.js
  const email =
    event.node.req.headers['cf-access-authenticated-user-email'] ||
    event.node.req.headers['Cf-Access-Authenticated-User-Email'];
  if (typeof email === 'string' && email.length > 0) {
    return email;
  }
  return null;
}
