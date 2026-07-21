# Cadwell Windows

Static React site for [cadwellwindows.com](https://www.cadwellwindows.com) — a faithful reproduction of the original WordPress site, built with Vite + React + React Router and deployed to AWS S3.

## Development

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at http://localhost:5173 (hot reload)
npm test           # Run tests once
npm run test:watch # Run tests in watch mode
```

## Production build

```bash
npm run build      # Compile to dist/
npm run preview    # Preview the built site at http://localhost:4173
```

## Deployment (AWS S3)

1. Build the site: `npm run build`
2. Create an S3 bucket and enable **Static website hosting**
   - Index document: `index.html`
   - Error document: `index.html` ← required for React Router to work
3. Set a public-read bucket policy
4. Upload: `aws s3 sync dist/ s3://YOUR-BUCKET-NAME --delete`

## Images

Photos live in `public/images/` and are copied into `dist/images/` at build time. If you need to re-download them from the live site:

```bash
BASE="https://www.cadwellwindows.com/wp-content/uploads/2020/08"
for f in public/images/*; do
  filename=$(basename "$f")
  curl -sf -o "public/images/$filename" "$BASE/$filename"
done
```
