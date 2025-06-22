# Cloudflare R2 Configuration

This file documents the configuration and setup for Cloudflare R2 object storage, used to store QR code images for the QR Short Link Generator webapp.

---

## Purpose

- **Store QR code images** generated for each short link.
- Ensure images are accessible only to authenticated users (their owners).
- Integrate with Nuxt 3 backend/server routes or Cloudflare Workers for upload/download.

---

## Configuration Steps

1. **Create R2 Bucket**
   - Name: `qr-generator-qrs` (suggested)
   - Region: auto (choose closest to your user base)

2. **Set Bucket Permissions**
   - Restrict public access.
   - Allow only server-side access via API tokens.

3. **API Token**
   - Create a Cloudflare API token with R2 read/write permissions for this bucket.
   - Store the token securely in environment variables (never commit to source).

4. **Environment Variables Example**
   ```
   CF_R2_ACCOUNT_ID=your_account_id
   CF_R2_ACCESS_KEY_ID=your_access_key
   CF_R2_SECRET_ACCESS_KEY=your_secret_key
   CF_R2_BUCKET=qr-generator-qrs
   ```

5. **Integration**
   - Use the official Cloudflare R2 SDK or S3-compatible libraries in your Nuxt 3 server routes or Workers.
   - Ensure all uploads are authenticated and linked to the correct user.

6. **Security**
   - Validate file types and sizes before upload.
   - Only allow access to QR images owned by the authenticated user.
   - Never expose R2 credentials to the client.

---

## References

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Cloudflare R2 API Reference](https://developers.cloudflare.com/api/operations/r2-bucket-create-bucket)

---

*Update this file with any changes to R2 configuration or integration details as the project evolves.*
