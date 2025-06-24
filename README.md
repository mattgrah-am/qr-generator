# QR Short Link & QR Generator Webapp

A secure, user-friendly webapp for generating short links and QR codes, with user authentication, link management, and Cloudflare-based storage.

---

## Features

- Short link creation and redirection
- QR code generation for each link
- Easy copy link, download QR, copy QR image
- User authentication (login, register, session management)
- User dashboard: view, edit, delete, and manage links
- Data storage in Cloudflare D1 (database)
- QR image storage in Cloudflare R2 (object storage)
- Responsive, accessible dark UI (Tailwind neutral colors)
- Security best practices throughout

---

## Tech Stack

- [Nuxt 3](https://nuxt.com/) (Vue 3 framework)
- [Tailwind CSS](https://tailwindcss.com/) (utility-first CSS, dark mode)
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) (code quality & formatting)
- [Cloudflare D1](https://developers.cloudflare.com/d1/) (database)
- [Cloudflare R2](https://developers.cloudflare.com/r2/) (object storage)
- [Cloudflare Pages/Workers](https://developers.cloudflare.com/pages/) (hosting/serverless API)
- [Auth.js](https://authjs.dev/) or Cloudflare Access (authentication)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/qr-generator.git
cd qr-generator
```

### 2. Initialize Nuxt 3 App

If not already initialized, run:

```bash
npx nuxi init app
cd app
npm install
```

### 3. Install Dependencies

Install Nuxt 3, Tailwind CSS, ESLint, Prettier, and related dependencies:

```bash
npm install
npm install -D tailwindcss postcss autoprefixer @nuxtjs/tailwindcss eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-vue eslint-plugin-tailwindcss eslint-plugin-prettier @nuxt/eslint-config @nuxt/types
```

### 4. Set Up Tailwind CSS

Tailwind is already included in the project dependencies.
Dark mode and the neutral color palette are configured in `tailwind.config.js`.

To customize, edit `app/tailwind.config.js`:

```js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Use Tailwind's neutral color palette for dark mode
      }
    }
  },
  plugins: [],
}
```

### 5. Set Up ESLint & Prettier

ESLint and Prettier are pre-configured.
To lint and format code:

```bash
npm run lint
npm run format
```

Configuration files:
- `.eslintrc`
- `.prettierrc`

### 6. Configure Cloudflare

#### a. Cloudflare D1 (Database)

Create and initialize the D1 database:

```bash
# Create D1 database
npx wrangler d1 create qr-generator-db

# Apply schema to local database
npx wrangler d1 execute qr-generator-db --file=cloudflare/d1-schema.sql

# Apply schema to remote database
npx wrangler d1 execute qr-generator-db --remote --file=cloudflare/d1-schema.sql
```

The database ID will be shown in the output. Update `wrangler.toml` with the actual database ID.

#### b. Cloudflare R2 (Object Storage)

Create the R2 bucket for QR code images:

```bash
# Create R2 bucket
npx wrangler r2 bucket create qr-generator-qrs

# Verify bucket creation
npx wrangler r2 bucket list
```

#### c. Cloudflare Pages/Workers

- Deploy the app using Cloudflare Pages or Workers.
- Set environment variables for D1, R2, and secrets in the Cloudflare dashboard.

#### d. Cloudflare Access (Authentication)

- Go to the [Cloudflare Zero Trust Dashboard](https://dash.teams.cloudflare.com/)
- Add your application (domain or subdomain)
- Set up your identity providers (Google, GitHub, etc.)
- Define access policies (who can log in)
- Cloudflare Access will inject the authenticated user's email into the `Cf-Access-Authenticated-User-Email` header on every request.

#### e. Environment Variables

Create a `.env` file in `app/` with:

```
NUXT_CLOUDFLARE_D1_BINDING=your-d1-binding
NUXT_CLOUDFLARE_R2_BUCKET=your-r2-bucket
# ...other secrets as needed
```

### 7. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Project Structure

```
/app                # Nuxt app
  /components       # UI components
  /pages            # Nuxt routes
  /composables      # state, logic
  /server/api       # API endpoints
  /utils            # helpers
  /assets           # static assets
  /middleware       # auth guards
  /tests            # unit/E2E tests
/cloudflare         # D1 schema, Worker scripts, R2 config
/public             # static files
.eslintrc, .prettierrc, tailwind.config.js, etc.
```

---

## Security & Best Practices

- All user input is validated and sanitized.
- Authentication is handled by Cloudflare Access (no password storage in-app).
- API endpoints require authentication via Cloudflare Access headers.
- Rate limiting is applied to prevent abuse.
- Each user is limited to a maximum of 10 short links.
- QR images and links are only accessible to their owners.
- Least-privilege permissions for Cloudflare resources.
- HTTPS is enforced everywhere.

---

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## License

MIT

---
