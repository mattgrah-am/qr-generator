import type { H3Event } from 'h3'
import { getRouterParam, setHeader, sendError, createError } from 'h3'
import { getR2Bucket } from '@/utils/r2'

/**
 * GET /api/qr/:filename
 * Serve QR code images from R2 storage
 */
export default defineEventHandler(async (event: H3Event) => {
  const filename = getRouterParam(event, 'filename')
  
  if (!filename) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'Missing filename',
      })
    )
  }

  const bucket = getR2Bucket(event)
  if (!bucket) {
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: 'R2 storage not available',
      })
    )
  }

  try {
    const key = `qr-codes/${filename}`
    const object = await bucket.get(key)

    if (!object) {
      return sendError(
        event,
        createError({
          statusCode: 404,
          statusMessage: 'QR code not found',
        })
      )
    }

    // Set appropriate headers
    setHeader(event, 'Content-Type', 'image/svg+xml')
    setHeader(event, 'Cache-Control', 'public, max-age=31536000') // Cache for 1 year
    
    // Return the file content as buffer
    const buffer = await object.arrayBuffer()
    return Buffer.from(buffer)
  } catch (error) {
    console.error('Failed to get QR code from R2:', error)
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve QR code',
      })
    )
  }
})