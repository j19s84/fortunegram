# Fortunegram - Deployment Guide

## Local Development

To run the app locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

```bash
npm run build
npm start
```

## Vercel Deployment (Recommended)

Fortunegram is built specifically for easy Vercel deployment. Follow these steps:

### Option 1: Via GitHub (Recommended)

1. **Initialize GitHub Repository**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/fortunegram.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Select "Import Git Repository"
   - Connect your GitHub account
   - Select the `fortunegram` repository
   - Click "Deploy"

   Vercel will automatically:
   - Detect Next.js
   - Build your app
   - Deploy to a live URL
   - Set up automatic deployments on every push

### Option 2: Via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Answer the prompts:**
   - Link to existing project? → No (for first deploy)
   - Set up and deploy? → Yes
   - Which scope? → Your account
   - Link to existing project? → No
   - Project name → `fortunegram`
   - Directory → `.` (current)

4. **Configure npm cache for Vercel**
   - Go to your Vercel project settings
   - Add environment variable: `NPM_FLAGS` = `--cache /tmp/npm-cache`

## Environment Variables

No environment variables are required for basic functionality.

## Deployment Checklist

- [x] TypeScript configured
- [x] Tailwind CSS configured
- [x] Next.js optimized for production
- [x] ESLint configured
- [x] Build successful
- [x] Ready for Vercel deployment

## Post-Deployment

Once deployed:
1. Your app will be available at `https://fortunegram.vercel.app` (or custom domain)
2. New pushes to `main` will auto-deploy
3. Preview deployments for pull requests

## Customization Before Deployment

Edit these files to customize:
- **Fortunes**: `lib/fortunes.ts`
- **Colors**: `tailwind.config.js`
- **Styles**: `app/globals.css`
- **Meta Data**: `app/layout.tsx`

## Troubleshooting

### Build fails with npm error
- The app uses `npm cache /tmp/npm-cache` to avoid npm cache issues
- Vercel should handle this automatically with the build command

### Port already in use locally
```bash
npm run dev -- -p 3001
```

### Clear Next.js cache
```bash
rm -rf .next
npm run build
```

---

🔮 Ready to launch your mystical fortune app! 🔮
