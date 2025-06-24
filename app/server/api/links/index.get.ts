import type { H3Event } from 'h3'
import { getUserFromAccess } from '@/utils/getUserFromAccess'
import { getD1Database } from '@/utils/d1'

/**
 * GET /api/links
 * Returns a list of short links for the authenticated user.
 */
export default defineEventHandler(async (event: H3Event) => {
  const userEmail = getUserFromAccess(event)
  if (!userEmail) {
    setResponseStatus(event, 401)
    return {
      success: false,
      message: 'Unauthorized: Cloudflare Access authentication required.',
      links: [],
    }
  }

  const db = getD1Database(event)
  if (!db) {
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Database unavailable',
      links: [],
    }
  }

  try {
    // First, ensure user exists in database
    let user = await db.prepare('SELECT id FROM users WHERE email = ?').bind(userEmail).first()
    
    if (!user) {
      // Create user if they don't exist
      const userId = crypto.randomUUID()
      await db.prepare('INSERT INTO users (id, email) VALUES (?, ?)').bind(userId, userEmail).run()
      user = { id: userId }
    }

    // Get user's links
    const result = await db.prepare(`
      SELECT id, slug, target_url, qr_image_url, created_at, updated_at 
      FROM links 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).bind(user.id).all()

    const links = result.results.map((link: Record<string, unknown>) => ({
      id: link.id,
      slug: link.slug,
      target_url: link.target_url,
      qr_url: link.qr_image_url,
      created_at: link.created_at,
      updated_at: link.updated_at,
    }))

    return {
      success: true,
      links,
    }
  } catch (error) {
    console.error('D1 query error:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Failed to fetch links',
      links: [],
    }
  }
})
