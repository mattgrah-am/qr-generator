import type { H3Event } from 'h3'
import { getUserFromAccess } from '@/utils/getUserFromAccess'

/**
 * GET /api/links
 * Returns a list of short links for the authenticated user.
 * (Currently returns mock data; replace with D1 integration.)
 */
export default defineEventHandler((event: H3Event) => {
  const userEmail = getUserFromAccess(event)
  if (!userEmail) {
    setResponseStatus(event, 401)
    return {
      success: false,
      message: 'Unauthorized: Cloudflare Access authentication required.',
      links: [],
    }
  }

  // Mock data for demonstration
  const mockLinks = [
    {
      id: '1',
      slug: 'abc123',
      target_url: 'https://example.com',
      qr_url: '/mock/qr1.png',
      created_at: '2024-06-09T12:00:00Z',
    },
    {
      id: '2',
      slug: 'xyz789',
      target_url: 'https://nuxt.com',
      qr_url: '/mock/qr2.png',
      created_at: '2024-06-09T13:00:00Z',
    },
  ]

  return {
    success: true,
    links: mockLinks,
  }
})
