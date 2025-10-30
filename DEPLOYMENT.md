# DeCertify - Complete Deployment Guide

This guide provides step-by-step instructions for deploying DeCertify to production on Vercel.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] GitHub account with repository access
- [ ] Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] Supabase project setup (via Lovable Cloud)
- [ ] Polygon Amoy testnet wallet (MetaMask recommended)
- [ ] Smart contract deployed on Polygon Amoy
- [ ] Test certificates issued successfully
- [ ] All environment variables documented

## 🚀 Deployment Methods

### Method 1: Vercel Dashboard (Recommended for Beginners)

#### Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Ensure `.gitignore` excludes:**
   ```
   node_modules
   .env
   .env.local
   dist
   .vercel
   ```

#### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Click "Import Git Repository"
4. Select your GitHub repository
5. Authorize Vercel to access your repository

#### Step 3: Configure Build Settings

**Framework Preset:** Vite

**Root Directory:** `./` (leave blank if project is in root)

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```bash
dist
```

**Install Command:**
```bash
npm install
```

#### Step 4: Add Environment Variables

Click "Environment Variables" and add the following:

```env
# Supabase Configuration (from Lovable Cloud)
VITE_SUPABASE_URL=https://eknberhkvyylqblbkebp.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=eknberhkvyylqblbkebp

# Smart Contract Configuration
VITE_CERTIFICATE_CONTRACT_ADDRESS=0xYourContractAddress

# Optional: Analytics, Monitoring
VITE_ANALYTICS_ID=your_analytics_id
```

**Important:** 
- All client-side variables MUST start with `VITE_`
- Never commit `.env` files to Git
- Use Vercel's encrypted environment variables

#### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete (usually 1-3 minutes)
3. Vercel will provide a URL: `https://your-project.vercel.app`

#### Step 6: Verify Deployment

1. Visit the provided URL
2. Test all features:
   - [ ] Home page loads
   - [ ] Organization registration works
   - [ ] Certificate issuance works (connect wallet)
   - [ ] Certificate verification works
   - [ ] PDF download functions
   - [ ] AI CertiBot responds

### Method 2: Vercel CLI (Advanced)

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

#### Step 2: Login

```bash
vercel login
```

Enter your email and verify.

#### Step 3: Deploy

```bash
# From project root directory
vercel

# For production
vercel --prod
```

#### Step 4: Set Environment Variables via CLI

```bash
# Add environment variable
vercel env add VITE_SUPABASE_URL

# List all environment variables
vercel env ls

# Pull environment variables to local
vercel env pull
```

## 🔧 Advanced Configuration

### Custom Domain Setup

#### Step 1: Add Domain in Vercel

1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain: `decertify.com`

#### Step 2: Configure DNS

**For Root Domain (example.com):**

Add A record:
```
Type: A
Name: @
Value: 76.76.21.21
```

**For Subdomain (app.example.com):**

Add CNAME record:
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

#### Step 3: Wait for DNS Propagation

- Usually takes 24-48 hours
- Check status: `dig example.com` or `nslookup example.com`
- Vercel auto-provisions SSL certificate

### Environment-Specific Deployments

#### Production Environment

```bash
vercel --prod
```

Variables: Use "Production" scope in Vercel dashboard

#### Preview Environment

```bash
vercel
```

Variables: Use "Preview" scope in Vercel dashboard

#### Development Environment

```bash
npm run dev
```

Variables: Use `.env.local` file

### Continuous Deployment Setup

Vercel automatically deploys on Git push:

**Production Deployments:**
- Trigger: Push to `main` branch
- URL: Your production domain

**Preview Deployments:**
- Trigger: Push to any branch or open PR
- URL: Unique preview URL per branch/PR

**Configure in Vercel:**
1. Project Settings → Git
2. Set Production Branch: `main`
3. Enable "Deploy Previews"

## 🔒 Security Best Practices

### Environment Variables Security

1. **Never commit `.env` to Git**
   ```bash
   # Add to .gitignore
   .env
   .env.local
   .env.production
   ```

2. **Use Vercel's encrypted storage**
   - All env vars in Vercel are encrypted at rest
   - Only decrypted during build/runtime

3. **Rotate keys regularly**
   - Update Supabase keys every 90 days
   - Update smart contract address if redeployed

4. **Limit variable scope**
   - Production vars for production only
   - Development vars for local development only

### CORS Configuration

If you encounter CORS errors, configure in Supabase:

```sql
-- In Supabase SQL Editor
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
```

Or in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
        { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
      ]
    }
  ]
}
```

## 🐛 Troubleshooting

### Build Failures

**Error: "Module not found"**
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error: "TypeScript errors"**
```bash
# Check types locally
npm run type-check

# Fix type errors before deploying
```

**Error: "Out of memory"**
```bash
# Increase Node.js memory in vercel.json
{
  "build": {
    "env": {
      "NODE_OPTIONS": "--max-old-space-size=4096"
    }
  }
}
```

### Runtime Errors

**Error: "Network request failed"**
- Check environment variables are set
- Verify Supabase URL is correct
- Check CORS configuration

**Error: "Wallet not connecting"**
- Ensure Web3Modal is configured correctly
- Check Polygon Amoy RPC is accessible
- Verify smart contract address is correct

**Error: "PDF download not working"**
- Check jsPDF is installed
- Verify client-side rendering
- Check browser console for errors

### Performance Issues

**Slow initial load:**
```bash
# Enable code splitting in vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          web3: ['ethers', 'wagmi'],
        }
      }
    }
  }
})
```

**Large bundle size:**
```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer

# Optimize imports
# Use: import { Button } from '@/components/ui/button'
# Not: import * as UI from '@/components/ui'
```

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Enable in Project Settings → Analytics
2. View real-time traffic, performance metrics
3. Monitor Core Web Vitals

### Custom Analytics

Add to `src/main.tsx`:

```typescript
// Google Analytics
if (import.meta.env.PROD) {
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_ID}`;
  document.head.appendChild(script);
}
```

### Error Tracking

Integrate Sentry:

```bash
npm install @sentry/react

# In src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

## 🔄 Rollback Procedure

If deployment fails or has issues:

### Via Vercel Dashboard

1. Go to Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

### Via CLI

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

## 📦 Production Optimizations

### 1. Enable Compression

In `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Encoding",
          "value": "gzip"
        }
      ]
    }
  ]
}
```

### 2. Configure Caching

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3. Optimize Images

```bash
# Install sharp for image optimization
npm install sharp

# Vercel automatically optimizes images
```

## 🧪 Testing Before Production

### Staging Environment

1. Create `staging` branch
2. Deploy to Vercel (auto-creates preview)
3. Test thoroughly on preview URL
4. Merge to `main` when ready

### Load Testing

```bash
# Install k6
brew install k6

# Run load test
k6 run loadtest.js
```

### Security Scan

```bash
# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix
```

## 📝 Post-Deployment Checklist

- [ ] All features working on production URL
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Environment variables set correctly
- [ ] Analytics tracking
- [ ] Error monitoring active
- [ ] Performance metrics acceptable
- [ ] Mobile responsiveness tested
- [ ] Wallet connection working
- [ ] Blockchain transactions confirmed
- [ ] PDF generation functional
- [ ] Email notifications working (if enabled)

## 🆘 Support

If you encounter issues:

1. **Check Vercel Logs:**
   - Project → Deployments → [Deployment] → Logs

2. **Check Build Logs:**
   - Project → Deployments → [Deployment] → Build Logs

3. **Contact Support:**
   - Vercel: [vercel.com/support](https://vercel.com/support)
   - DeCertify: support@decertify.app

## 🎯 Next Steps

After successful deployment:

1. Monitor analytics for first 24 hours
2. Set up status page (e.g., status.io)
3. Configure uptime monitoring (e.g., UptimeRobot)
4. Set up automated backups for database
5. Plan for scaling (Vercel auto-scales)
6. Implement feature flags for gradual rollouts
7. Set up staging → production pipeline

---

**Congratulations! Your DeCertify platform is now live! 🎉**

For ongoing updates and maintenance, refer to the [README.md](README.md) and monitor your Vercel dashboard regularly.
