import type { H3Event } from 'h3'
import { sendError, createError } from 'h3'

/**
 * POST /api/links
 * Create a new short link for the authenticated user.
 * Enforces a maximum of 10 links per user.
 * (Mock data version — replace with D1 integration later)
 */
export default defineEventHandler(async (event: H3Event) => {
  // Simulate getting the authenticated user's email from Cloudflare Access
  const userEmail =
    event.node.req.headers['cf-access-authenticated-user-email'] ||
    event.node.req.headers['Cf-Access-Authenticated-User-Email']

  if (!userEmail) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Cloudflare Access authentication required.',
      })
    )
  }

  // Parse request body
  const body = await readBody<{ target_url: string }>(event)
  if (!body?.target_url || typeof body.target_url !== 'string') {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'Missing or invalid target_url.',
      })
    )
  }

  // Mock: Simulate fetching user's links (replace with D1 query)
  // For demonstration, pretend the user already has 9 links
  const mockLinks = [
    { id: '1', slug: 'abc123', target_url: 'https://example.com' },
    { id: '2', slug: 'xyz789', target_url: 'https://nuxt.com' },
    { id: '3', slug: 'foo', target_url: 'https://foo.com' },
    { id: '4', slug: 'bar', target_url: 'https://bar.com' },
    { id: '5', slug: 'baz', target_url: 'https://baz.com' },
    { id: '6', slug: 'qux', target_url: 'https://qux.com' },
    { id: '7', slug: 'quux', target_url: 'https://quux.com' },
    { id: '8', slug: 'corge', target_url: 'https://corge.com' },
    { id: '9', slug: 'grault', target_url: 'https://grault.com' }
  ]

  // Enforce 10-link limit
  if (mockLinks.length >= 10) {
    return sendError(
      event,
      createError({
        statusCode: 403,
        statusMessage: 'Link limit reached. You can only have up to 10 short links.',
      })
    )
  }

  // Mock: Simulate creating a new link
  const newLink = {
    id: String(mockLinks.length + 1),
    slug: Math.random().toString(36).substring(2, 8), // Random 6-char slug
    target_url: body.target_url,
  }

  // Mock: Return the new link (in real implementation, insert into D1)
  return {
    success: true,
    link: newLink,
    message: 'Short link created (mock data, not persisted).',
  }
})
