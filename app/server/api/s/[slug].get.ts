import type { H3Event } from 'h3'
import { sendError, createError, getRouterParam, getHeader, sendRedirect } from 'h3'
import { getD1Database } from '@/utils/d1'

/**
 * GET /api/s/:slug
 * Redirect to the target URL for a short link
 */
export default defineEventHandler(async (event: H3Event) => {
  const db = getD1Database(event)
  if (!db) {
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: 'Database unavailable',
      })
    )
  }

  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'Missing slug parameter',
      })
    )
  }

  try {
    // Find the link by slug
    const link = await db.prepare(`
      SELECT target_url FROM links 
      WHERE slug = ?
    `).bind(slug).first()

    if (!link) {
      return sendError(
        event,
        createError({
          statusCode: 404,
          statusMessage: 'Short link not found',
        })
      )
    }

    // Return the target URL for client-side redirect
    // or use sendRedirect for server-side redirect
    if (getHeader(event, 'accept')?.includes('application/json')) {
      // API request - return JSON
      return {
        success: true,
        target_url: link.target_url
      }
    } else {
      // Browser request - redirect
      await sendRedirect(event, link.target_url, 302)
    }
  } catch (error) {
    console.error('D1 query error:', error)
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: 'Failed to process redirect',
      })
    )
  }
})