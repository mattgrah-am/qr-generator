# Cloudflare Pages & Workers Configuration (Placeholder)

This document outlines the configuration and deployment considerations for Cloudflare Pages and Workers in the QR Short Link Generator project.

---

## 1. Cloudflare Pages

- **Purpose:** Hosts the Nuxt 3 frontend (static or SSR).
- **Setup:**
  - Connect repository to Cloudflare Pages.
  - Set build command: `npm run build`
  - Set output directory: `.output/public` (for static) or configure for SSR as per Nuxt 3 docs.
  - Configure environment variables for API endpoints, Cloudflare credentials, etc.

---

## 2. Cloudflare Workers

- **Purpose:** Handles serverless API endpoints, short link redirection, and secure backend logic.
- **Setup:**
  - Use `/app/server/api` for Nuxt server routes, or deploy custom Workers as needed.
  - Bindings for Cloudflare D1 (database) and R2 (object storage) must be set in `wrangler.toml`.
  - Example bindings:
    ```toml
    [[d1_databases]]
    binding = "DB"
    database_name = "qr-links"
    database_id = "<your-d1-database-id>"

    [[r2_buckets]]
    binding = "QR_IMAGES"
    bucket_name = "qr-images"
    ```
  - Set environment variables for secrets and credentials.

---

## 3. Security & Best Practices

- Restrict API endpoints to authenticated users where required.
- Use least-privilege permissions for D1 and R2.
- Never expose secrets in client-side code.
- Use HTTPS for all endpoints.

---

## 4. References

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)

---

*Update this file as the project’s deployment and configuration details evolve.*
