import QRCode from 'qrcode'

/**
 * Generate QR code as PNG buffer
 */
export async function generateQRCode(text: string, options?: QRCode.QRCodeToBufferOptions): Promise<Buffer> {
  const defaultOptions: QRCode.QRCodeToBufferOptions = {
    type: 'png',
    width: 256,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    ...options
  }
  
  return await QRCode.toBuffer(text, defaultOptions)
}

/**
 * Generate QR code as data URL (base64)
 */
export async function generateQRCodeDataURL(text: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
  const defaultOptions: QRCode.QRCodeToDataURLOptions = {
    type: 'image/png',
    width: 256,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    ...options
  }
  
  return await QRCode.toDataURL(text, defaultOptions)
}

/**
 * Build the full short link URL from slug
 */
export function buildShortUrl(slug: string, baseUrl?: string): string {
  // In production, this would be your domain
  // For now, use a placeholder that can be configured via environment
  const base = baseUrl || 'https://your-domain.com'
  return `${base}/s/${slug}`
}