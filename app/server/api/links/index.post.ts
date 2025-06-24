import type { H3Event } from 'h3'
import { sendError, createError, readBody } from 'h3'
import { getUserFromAccess } from '@/utils/getUserFromAccess'
import { getD1Database, generateSlug, generateId, isValidUrl } from '@/utils/d1'
import { generateQRCode, buildShortUrl } from '@/utils/qr'
import { uploadQRImage, generateQRFileName } from '@/utils/r2'

/**
 * POST /api/links
 * Create a new short link for the authenticated user.
 * Enforces a maximum of 10 links per user.
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

  // Validate URL
  if (!isValidUrl(body.target_url)) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'Invalid URL format.',
      })
    )
  }

  try {
    // First, ensure user exists in database
    let user = await db.prepare('SELECT id FROM users WHERE email = ?').bind(userEmail).first()
    
    if (!user) {
      // Create user if they don't exist
      const userId = generateId()
      await db.prepare('INSERT INTO users (id, email) VALUES (?, ?)').bind(userId, userEmail).run()
      user = { id: userId }
    }

    // Check current link count for 10-link limit
    const linkCount = await db.prepare('SELECT COUNT(*) as count FROM links WHERE user_id = ?').bind(user.id).first()
    
    if (linkCount && linkCount.count >= 10) {
      return sendError(
        event,
        createError({
          statusCode: 403,
          statusMessage: 'Link limit reached. You can only have up to 10 short links.',
        })
      )
    }

    // Generate unique slug
    let slug = generateSlug()
    let slugExists = true
    let attempts = 0
    
    while (slugExists && attempts < 10) {
      const existing = await db.prepare('SELECT id FROM links WHERE slug = ?').bind(slug).first()
      if (!existing) {
        slugExists = false
      } else {
        slug = generateSlug()
        attempts++
      }
    }

    if (slugExists) {
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'Failed to generate unique slug. Please try again.',
        })
      )
    }

    // Create new link
    const linkId = generateId()
    const now = new Date().toISOString()
    
    // Generate QR code
    const shortUrl = buildShortUrl(slug)
    const qrBuffer = await generateQRCode(shortUrl)
    const qrFileName = generateQRFileName(slug)
    const qrImageUrl = await uploadQRImage(event, qrBuffer, qrFileName)
    
    // Insert link with QR image URL
    await db.prepare(`
      INSERT INTO links (id, user_id, slug, target_url, qr_image_url, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(linkId, user.id, slug, body.target_url, qrImageUrl, now, now).run()

    const newLink = {
      id: linkId,
      slug,
      target_url: body.target_url,
      qr_url: qrImageUrl,
      created_at: now,
      updated_at: now,
    }

    return {
      success: true,
      link: newLink,
      message: 'Short link and QR code created successfully.',
    }
  } catch (error) {
    console.error('D1 query error:', error)
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: 'Failed to create link',
      })
    )
  }
})
