# IntuiTV Creator Studio Landing Page

Professional landing page for Creator Studio with integrated authentication, Stripe payments, and MongoDB user management.

## 🚀 Features

- **2-Day Free Trial System** - No credit card required
- **Stripe Payment Integration** - Secure subscription management
- **MongoDB User Database** - Complete user management
- **JWT Authentication** - Secure token-based auth
- **Personal CMS** - Individual content storage per user
- **Direct Dashboard Access** - Seamless login to Creator platform
- **UK Data Sovereignty** - GDPR-compliant infrastructure
- **IntuiTV Branding** - Space-themed design with starfield

## 📋 Environment Variables

Create `.env.local` file:

```env
MONGODB_URI=mongodb://localhost:27017/creator-studio
JWT_SECRET=your-secret-key-change-in-production
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
NEXT_PUBLIC_API_URL=https://api.intuitv.app
NEXT_PUBLIC_CREATOR_URL=https://creator.intuitv.app
NEXT_PUBLIC_PLAYOUT_URL=https://playout.intuitv.app
NEXT_PUBLIC_APP_URL=https://studio.intuitv.app
```

## 🛠️ Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3010](http://localhost:3010)

## 📦 Deployment

### Netlify

```bash
npm run build
```

Set environment variables in Netlify dashboard.

### MongoDB Setup

```javascript
// Collections needed:
- users
- cms_content
- subscriptions (auto-created by Stripe webhooks)
```

### Stripe Webhook Setup

1. Get webhook signing secret from Stripe Dashboard
2. Set endpoint: `https://studio.intuitv.app/api/stripe/webhook`
3. Listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

## 🎨 Required Images & Videos

### Hero Section
- `hero-demo-video.mp4` - Complete Creator Studio interface walkthrough (16:9, 1920x1080)
- Alternative: Animated GIF showing main features

### Feature Cards
1. `text-to-video-interface.png` - Screenshot of T2V generation panel
2. `animation-styles-showcase.png` - Grid showing 5 animation style examples
3. `video-editor-timeline.png` - Professional timeline editor interface
4. `ai-suggestions-panel.png` - MOTHER AI suggestions UI
5. `realtime-render-demo.png` - Split screen: input → instant output
6. `playout-integration.png` - Creator → Playout connection diagram

### Workflow Diagram
- `workflow-complete-diagram.png` - Creator Studio → CMS → Playout flow (21:9, 2560x1080)

### MOTHER AI Section
- `mother-ai-architecture.png` - Technical diagram of MOTHER system (1:1, 800x800)
- Alternative: Animated visualization of AI processing

### Demo Video Section
- `platform-demo-video.mp4` - 3-5 minute complete walkthrough
- Should include: Login → Create → Edit → Publish workflow

### Additional Assets
- `/og-image.png` - Open Graph image (1200x630)
- `/creator-pro-image.png` - Creator Pro tier visual for Stripe

## 🎬 Video Content Requirements

### Hero Demo Video (60-90 seconds)
- Show login to Creator Studio
- Text-to-video generation in action
- Quick style selection
- Real-time rendering
- Publishing to Playout
- **Style**: Fast-paced, exciting, professional

### Platform Demo Video (3-5 minutes)
- Welcome screen
- Feature tour
- Complete project creation
- Advanced editing features
- CMS organization
- Publishing workflow
- Analytics view
- **Style**: Tutorial-style, clear voiceover

## 🎨 Image Generation Prompts

### Text-to-Video Interface
"Professional video editing interface, dark theme with cyan accents, text input field with AI magic wand icon, style selector buttons, real-time preview window, progress indicators, clean modern UI design"

### Animation Styles Showcase
"Grid of 5 video thumbnails: 1) Cinematic movie scene, 2) Anime character art, 3) Photorealistic 3D render, 4) Watercolor painting style, 5) Professional photography, each with distinct visual style, 16:9 format"

### Video Editor Timeline
"Professional video editing timeline interface, multiple tracks, waveform visualization, keyframe markers, transition effects, dark interface with cyan highlights, modern NLE design"

### AI Suggestions Panel
"AI assistance panel with glowing purple icon, suggested improvements list, one-click apply buttons, real-time analysis indicators, split preview showing before/after, modern AI interface"

### Real-time Render Demo
"Split screen comparison: left shows text prompt 'sunset over mountains', right shows generated video playing, progress bar at 100%, 'rendered in 3.2 seconds' indicator, impressive quality"

### Playout Integration
"System architecture diagram: Creator Studio icon → arrow → Personal CMS icon → arrow → Playout icon → arrow → 11 platform icons (TV, mobile, web), data flow indicators, UK data center badge"

### Workflow Complete Diagram
"Three connected stages with icons: 1) Creation tools (AI, edit, effects), 2) CMS storage (folders, assets, organization), 3) Broadcast (scheduling, streaming, analytics), modern infographic style, cyan and purple gradient"

### MOTHER AI Architecture
"Futuristic AI brain visualization, neural network connections, H200 GPU chips, UK flag badge, sovereign data indicators, real-time processing streams, purple and cyan energy flows, technical but beautiful"

## 🔐 User Flow

1. **Landing Page** → User sees features and pricing
2. **Sign Up** → Creates account, gets 2-day trial
3. **Redirect** → Automatically goes to `creator.intuitv.app` with auth token
4. **Trial Expiry** → After 2 days, shown paywall on next login
5. **Subscription** → Stripe checkout → Full access restored
6. **Dashboard Access** → Unlimited creation, download, and publishing

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (bcrypt hashed),
  name: String,
  createdAt: Date,
  trialEnds: Date,
  isTrialActive: Boolean,
  isPaid: Boolean,
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  subscriptionStatus: String, // 'trial', 'active', 'past_due', 'canceled'
  role: String // 'creator'
}
```

### CMS Content Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  folders: Array,
  assets: Array,
  createdAt: Date
}
```

## 🎯 Key Pages

- `/` - Landing page with full feature showcase
- `/signup` - Registration with 2-day free trial
- `/login` - Authentication portal
- `/contact` - Enterprise inquiries
- `/pricing` - Pricing comparison table (on main page)

## 🔗 Integration Points

### With Creator Dashboard (`creator.intuitv.app`)
- Auth token passed via localStorage
- User data synced on login
- Trial status checked on each request
- Redirect to payment if expired

### With Playout System (`playout.intuitv.app`)
- Published content appears in channel scheduling
- Real-time sync between Creator and Playout
- Analytics flow back to Creator

### With MOTHER AI
- Text-to-video generation API calls
- Real-time rendering on H200 GPUs
- Content moderation and analysis
- Style transfer and effects

## 🚧 Trial System Logic

```javascript
// On signup
trialEnds = now + 2 days
isTrialActive = true
isPaid = false

// On login
if (now > trialEnds && !isPaid) {
  // Block access, show paywall
  redirect('/pricing')
} else {
  // Allow access
  redirect('https://creator.intuitv.app')
}

// After payment
isPaid = true
subscriptionStatus = 'active'
// Full access granted
```

## 🎨 Branding Guidelines

**Colors:**
- Space Dark: `#000814`
- Space Blue: `#001d3d`
- Deep Blue: `#003566`
- Cyber Cyan: `#00d9ff`
- Electric Blue: `#0096c7`
- Neon Purple: `#8B5CF6`
- MOTHER Purple: `#7C3AED`

**Fonts:**
- Headings: Orbitron (Bold, Black)
- Body: System font stack

**Effects:**
- Glass morphism backgrounds
- Subtle glow effects on hover
- Gradient text for emphasis
- Starfield animation background
- Smooth transitions (0.3s)

## 📱 Responsive Design

- Mobile: Full-width cards, stacked layout
- Tablet: 2-column grid
- Desktop: 3-column grid, expanded features
- 4K: Max-width container (1440px)

## ✅ Testing Checklist

- [ ] Signup creates user in MongoDB
- [ ] Trial expiration calculated correctly
- [ ] Login redirects to Creator dashboard
- [ ] Stripe checkout session creation
- [ ] Webhook handling for subscription events
- [ ] Trial expiry blocks access
- [ ] Payment restores access
- [ ] JWT tokens work across subdomains
- [ ] All images load properly
- [ ] Mobile responsive design works
- [ ] Forms validate correctly

## 🆘 Support

For issues or questions:
- Email: support@intuitv.app
- Enterprise: enterprise@intuitv.app
- Documentation: https://docs.intuitv.app

---

**Built by Media Stream AI Limited**  
🇬🇧 UK Sovereign AI Infrastructure • GDPR Compliant
