# Deployment

This project is a Vite-based Vue frontend. Deployment is a static build:

- install dependencies
- build the app
- upload the generated `dist/` folder to your web server or static hosting platform

## Prerequisites

- Node.js 24.x is recommended
- npm 11.x or newer

## Environment Variables

This app requires:

```bash
VITE_APP_API_URL=...
```

Current local and production examples:

- `.env`
  `VITE_APP_API_URL=http://localhost:3000/api`
- `.env.production`
  `VITE_APP_API_URL=http://timesheets-test4.lecopainters.co.nz/timesheets_server/public/index.php/api`

Before deploying, make sure `.env.production` points to the correct API for the target environment.

## Install

```bash
npm install
```

## Validate Before Deploying

```bash
npm run lint
npm run build
```

## Build

```bash
npm run build
```

The production output is written to:

```bash
dist/
```

## Local Preview Of Production Build

```bash
npm run preview
```

## Deploying `dist/`

You can deploy `dist/` to any static hosting platform or web server, for example:

- Nginx
- Apache
- cPanel static site hosting
- Netlify
- Vercel
- an S3/CloudFront-style static hosting setup

## SPA Routing

Because this is a Vue single-page app, your web server should return `index.html` for non-file routes.

Example Nginx config inside the site root:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Typical Deployment Flow

```bash
npm install
npm run lint
npm run build
```

Then upload the contents of `dist/` to the server document root for the frontend site.

## Notes

- If you deploy under a subpath instead of the domain root, update the Vite `base` setting in [vite.config.mjs](/Users/tuanthanh/htdocs/lecotimesheets/lecotimesheets_frontend/vite.config.mjs).
- The generated route typing file `src/route-map.d.ts` is expected and can stay committed.
