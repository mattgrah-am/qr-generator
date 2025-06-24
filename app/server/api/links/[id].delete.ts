import type { H3Event } from 'h3'
import { sendError, createError, getRouterParam } from 'h3'
import { getUserFromAccess } from '@/utils/getUserFromAccess'
import { getD1Database } from '@/utils/d1'
import { deleteQRImage, generateQRFileName } from '@/utils/r2'

/**
 * DELETE /api/links/:id
 * Delete a short link owned by the authenticated user.
 */
export default defineEventHandler(async (event: H3Event) => {
  const userEmail = getUserFromAccess(event)
  if (!userEmail) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Cloudflare Access authentication required.',
      })
    )
  }

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

  const linkId = getRouterParam(event, 'id')
  if (!linkId) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'Missing link ID',
      })
    )
  }

  try {
    // Get user from database
    const user = await db.prepare('SELECT id FROM users WHERE email = ?').bind(userEmail).first()
    
    if (!user) {
      return sendError(
        event,
        createError({
          statusCode: 404,
          statusMessage: 'User not found',
        })
      )
    }

    // Check if link exists and belongs to user, get slug for QR cleanup
    const link = await db.prepare(`
      SELECT id, slug FROM links 
      WHERE id = ? AND user_id = ?
    `).bind(linkId, user.id).first()

    if (!link) {
      return sendError(
        event,
        createError({
          statusCode: 404,
          statusMessage: 'Link not found or not owned by user',
        })
      )
    }

    // Delete QR image from R2 (don't fail if this fails)
    try {
      const qrFileName = generateQRFileName(link.slug)
      await deleteQRImage(event, qrFileName)
    } catch (error) {
      console.warn('Failed to delete QR image from R2:', error)
      // Continue with link deletion even if QR deletion fails
    }

    // Delete the link from database
    await db.prepare('DELETE FROM links WHERE id = ? AND user_id = ?').bind(linkId, user.id).run()

    return {
      success: true,
      message: 'Link deleted successfully',
    }
  } catch (error) {
    console.error('D1 query error:', error)
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: 'Failed to delete link',
      })
    )
  }
})