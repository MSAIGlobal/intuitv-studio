# 🚀 CREATOR STUDIO DEPLOYMENT GUIDE

## Pre-Deployment Checklist

### 1. MongoDB Setup
```bash
# Install MongoDB locally or use MongoDB Atlas
# Create database: creator-studio
# Collections will be created automatically on first use

# Connection string format:
mongodb://localhost:27017/creator-studio
# OR for Atlas:
mongodb+srv://username:password@cluster.mongodb.net/creator-studio
```

### 2. Stripe Setup

1. **Get API Keys:**
   - Go to https://dashboard.stripe.com/apikeys
   - Copy "Publishable key" (pk_test_...)
   - Copy "Secret key" (sk_test_...)

2. **Create Product:**
   - Products → Add Product
   - Name: "IntuiTV Creator Pro"
   - Price: £49.00 GBP monthly recurring
   - Copy Price ID

3. **Setup Webhook:**
   - Developers → Webhooks → Add endpoint
   - Endpoint URL: `https://studio.intuitv.app/api/stripe/webhook`
   - Events to send:
     - checkout.session.completed
     - customer.subscription.updated
     - customer.subscription.deleted
     - invoice.payment_failed
   - Copy signing secret (whsec_...)

### 3. Environment Variables

Create `.env.local` with:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_generated_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# URLs
NEXT_PUBLIC_API_URL=https://api.intuitv.app
NEXT_PUBLIC_CREATOR_URL=https://creator.intuitv.app
NEXT_PUBLIC_PLAYOUT_URL=https://playout.intuitv.app
NEXT_PUBLIC_APP_URL=https://studio.intuitv.app
```

## Deployment Options

### Option 1: Netlify (Recommended)

```bash
# 1. Build locally to test
npm install
npm run build

# 2. Deploy to Netlify
# Via Netlify CLI:
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod

# OR via GitHub integration:
# Push to GitHub → Connect to Netlify → Auto-deploy
```

**Netlify Configuration:**
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18.x or higher
- Add all environment variables in Netlify dashboard

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production
vercel --prod
```

**Vercel Configuration:**
- Framework Preset: Next.js
- Build Command: `next build`
- Output Directory: `.next`
- Install Command: `npm install`
- Add environment variables in dashboard

### Option 3: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3010

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t creator-studio .
docker run -p 3010:3010 --env-file .env creator-studio
```

## Post-Deployment Tasks

### 1. Test Authentication Flow
- [ ] Sign up new user
- [ ] Check MongoDB for user record
- [ ] Verify trial end date is 2 days from now
- [ ] Log in with created account
- [ ] Verify redirect to Creator dashboard

### 2. Test Stripe Integration
- [ ] Use test card: 4242 4242 4242 4242
- [ ] Complete checkout
- [ ] Verify webhook received
- [ ] Check user status updated in MongoDB
- [ ] Test subscription management

### 3. Test Trial Expiry
```javascript
// Manually set trial expiry in MongoDB for testing:
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { trialEnds: new Date() } }
)
// Try to login → Should block access
```

### 4. DNS Configuration
```
studio.intuitv.app → Your deployment URL
```

### 5. SSL Certificate
- Netlify/Vercel: Automatic
- Self-hosted: Let's Encrypt

## Monitoring Setup

### 1. Error Tracking
Consider adding Sentry:

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "your-sentry-dsn",
  tracesSampleRate: 1.0,
});
```

### 2. Analytics
Add Google Analytics or Plausible:

```javascript
// app/layout.tsx
<Script src="https://plausible.io/js/script.js" data-domain="studio.intuitv.app" />
```

### 3. Uptime Monitoring
- UptimeRobot
- Pingdom
- Better Uptime

## Security Checklist

- [ ] All API keys in environment variables (not code)
- [ ] JWT secret is strong and random
- [ ] MongoDB connection uses authentication
- [ ] HTTPS enabled on all domains
- [ ] CORS configured for specific domains only
- [ ] Rate limiting enabled (consider adding)
- [ ] Input validation on all forms
- [ ] SQL injection prevention (using MongoDB)
- [ ] XSS protection (React default)

## Performance Optimization

### 1. Image Optimization
```bash
# Install Sharp for image optimization
npm install sharp
```

### 2. Caching Headers
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

### 3. Bundle Analysis
```bash
npm install @next/bundle-analyzer
ANALYZE=true npm run build
```

## Backup Strategy

### MongoDB Backups
```bash
# Daily automated backup
mongodump --uri="your_mongodb_uri" --out=/backups/$(date +%Y%m%d)

# Restore if needed
mongorestore --uri="your_mongodb_uri" /backups/20260109
```

### Environment Variables Backup
Store securely in password manager (1Password, LastPass)

## Scaling Considerations

### When to Scale:
- 1,000+ users: Consider MongoDB Atlas M10+
- 10,000+ users: Add Redis for session caching
- 100,000+ users: Consider CDN for static assets
- High traffic: Implement rate limiting

### Recommended Upgrades:
1. **Database:** MongoDB Atlas with auto-scaling
2. **Caching:** Redis for JWT tokens and session data
3. **CDN:** CloudFlare for static assets
4. **Load Balancer:** For multiple instances

## Troubleshooting

### Common Issues:

**1. MongoDB Connection Failed**
```bash
# Check connection string
# Verify IP whitelist in MongoDB Atlas
# Check network connectivity
```

**2. Stripe Webhook Not Working**
```bash
# Verify webhook URL is correct
# Check webhook signing secret
# Test with Stripe CLI:
stripe listen --forward-to localhost:3010/api/stripe/webhook
```

**3. JWT Token Invalid**
```bash
# Verify JWT_SECRET matches between deployments
# Check token expiration time
# Clear localStorage and try again
```

**4. Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Support Contacts

**Deployment Issues:**
- Netlify Support: support@netlify.com
- Vercel Support: support@vercel.com

**Service Issues:**
- MongoDB Support: https://support.mongodb.com
- Stripe Support: https://support.stripe.com

## Success Metrics

Monitor these post-launch:
- [ ] Signup conversion rate
- [ ] Trial-to-paid conversion rate
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] 99.9% uptime
- [ ] Zero critical errors

## Launch Checklist

- [ ] All environment variables set
- [ ] MongoDB connected and tested
- [ ] Stripe webhooks working
- [ ] Authentication flow working
- [ ] Trial system working
- [ ] Payment flow tested
- [ ] All images and assets uploaded
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] Error tracking enabled
- [ ] Analytics enabled
- [ ] Backups configured
- [ ] Monitoring alerts set
- [ ] Documentation complete
- [ ] Team notified

---

**You're ready to launch when all items are checked! 🚀**

For additional support: enterprise@intuitv.app
