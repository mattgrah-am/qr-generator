import type { H3Event } from 'h3'

/**
 * Get R2 bucket binding from the Cloudflare runtime
 */
export function getR2Bucket(event: H3Event) {
  // In Cloudflare Workers runtime, R2 binding is available via event.context.cloudflare.env
  return event.context.cloudflare?.env?.QR_IMAGES || event.context?.QR_IMAGES
}

/**
 * Upload QR code image to R2 storage
 */
export async function uploadQRImage(
  event: H3Event, 
  imageBuffer: Buffer, 
  fileName: string
): Promise<string | null> {
  const bucket = getR2Bucket(event)
  if (!bucket) {
    console.error('R2 bucket not available')
    return null
  }

  try {
    const key = `qr-codes/${fileName}`
    
    await bucket.put(key, imageBuffer, {
      httpMetadata: {
        contentType: 'image/png',
        cacheControl: 'public, max-age=31536000', // Cache for 1 year
      }
    })

    // Return the public URL (this would be your R2 custom domain or public URL)
    // For now, return a placeholder that indicates the file path
    return `/qr/${fileName}`
  } catch (error) {
    console.error('Failed to upload QR code to R2:', error)
    return null
  }
}

/**
 * Delete QR code image from R2 storage
 */
export async function deleteQRImage(event: H3Event, fileName: string): Promise<boolean> {
  const bucket = getR2Bucket(event)
  if (!bucket) {
    console.error('R2 bucket not available')
    return false
  }

  try {
    const key = `qr-codes/${fileName}`
    await bucket.delete(key)
    return true
  } catch (error) {
    console.error('Failed to delete QR code from R2:', error)
    return false
  }
}

/**
 * Generate QR image filename from link slug
 */
export function generateQRFileName(slug: string): string {
  return `${slug}.png`
}