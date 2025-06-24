import qrcode from 'qrcode-generator'

/**
 * Generate QR code as PNG buffer using qrcode-generator
 * This works in Cloudflare Workers environment
 */
export async function generateQRCode(text: string, options?: any): Promise<Buffer> {
  try {
    // Create QR code
    const qr = qrcode(0, 'M') // error correction level M
    qr.addData(text)
    qr.make()

    // Convert to SVG first, then to PNG-like format
    const svgString = qr.createSvgTag({
      cellSize: 8,
      margin: 4,
      scalable: false
    })

    // Create a simple representation for now
    // In a real implementation, you'd convert SVG to PNG
    const buffer = Buffer.from(svgString, 'utf8')
    return buffer
  } catch (error) {
    console.error('QR generation error:', error)
    // Fallback to placeholder
    return Buffer.from('QR-PLACEHOLDER', 'utf8')
  }
}

/**
 * Generate QR code as data URL (SVG)
 */
export async function generateQRCodeDataURL(text: string, options?: any): Promise<string> {
  try {
    const qr = qrcode(0, 'M')
    qr.addData(text)
    qr.make()

    const svgString = qr.createSvgTag({
      cellSize: 8,
      margin: 4,
      scalable: false
    })

    return `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`
  } catch (error) {
    console.error('QR generation error:', error)
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PHRleHQ+UVI8L3RleHQ+PC9zdmc+'
  }
}

/**
 * Build the full short link URL from slug
 */
export function buildShortUrl(slug: string, baseUrl?: string): string {
  // Use provided baseUrl, environment variable, or fallback to production domain
  const base = baseUrl || process.env.BASE_URL || 'https://qr.matg.dev'
  return `${base}/s/${slug}`
}