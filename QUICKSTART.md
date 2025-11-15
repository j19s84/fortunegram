# 🚀 Fortunegram Quick Start

## Run Locally (30 seconds)

```bash
cd /Users/jessscott/Desktop/Fortunegram
npm run dev
```
Then open http://localhost:3000

## Deploy to Vercel (2 minutes)

### Step 1: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/fortunegram.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `fortunegram` repo
4. Click "Deploy"

✅ Done! Your app is live.

## File Locations

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main landing page |
| `lib/fortunes.ts` | Fortune messages (edit here!) |
| `tailwind.config.js` | Colors & styling |
| `app/globals.css` | CSS animations |
| `components/FortuneCard.tsx` | Fortune display |
| `components/StarField.tsx` | Background animation |

## Customize Fortunes

Edit `lib/fortunes.ts`:
```typescript
const fortunes = [
  "Your custom fortune here",
  "Another fortune...",
]
```

## Customize Colors

Edit `tailwind.config.js` colors section:
- Change purples, blacks, etc.
- Modify glow effects
- Adjust animations

## Production Build

```bash
npm run build
npm start
```

## Environment

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (easiest)

---

Questions? See `README.md` or `PROJECT_SUMMARY.md` for more details.
