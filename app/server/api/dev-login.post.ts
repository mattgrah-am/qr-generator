import type { H3Event } from 'h3'
import { getHeader, setCookie, setResponseStatus, readBody } from 'h3'

/**
 * POST /api/dev-login
 * Local development bypass for authentication
 */
export default defineEventHandler(async (event: H3Event) => {
  // Only allow in development - strict security check
  const host = getHeader(event, 'host')
  const isLocalHost = host?.includes('localhost') || host?.includes('127.0.0.1')
  const isDevEnvironment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
  
  // SECURITY: Only allow in actual local development
  if (!isLocalHost || !isDevEnvironment) {
    setResponseStatus(event, 404)
    return {
      error: 'Not found'
    }
  }

  const body = await readBody(event)
  const { email } = body

  if (!email || typeof email !== 'string') {
    setResponseStatus(event, 400)
    return {
      error: 'Email is required'
    }
  }

  // Set a cookie for the local dev user
  setCookie(event, 'local-dev-user', email, {
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  return {
    success: true,
    email
  }
})