import type { H3Event } from 'h3'

/**
 * Get D1 database binding from the Cloudflare runtime
 * Works in both development (with wrangler) and production
 */
export function getD1Database(event: H3Event) {
  // In Cloudflare Workers runtime, D1 binding is available via event.context.cloudflare.env
  return event.context.cloudflare?.env?.DB || event.context?.DB
}

/**
 * Generate a random slug for short links
 */
export function generateSlug(length: number = 6): string {
  return Math.random().toString(36).substring(2, 2 + length)
}

/**
 * Generate a unique UUID-like ID
 */
export function generateId(): string {
  return crypto.randomUUID()
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}