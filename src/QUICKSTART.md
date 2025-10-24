# ⚡ Quick Start Guide

Get Wassel up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- (Optional) Supabase account for backend
- (Optional) Google Maps API key

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your values (optional for development)
nano .env.local
```

**Minimum Required (for development):**
```env
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173
```

**Optional (enhances features):**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_MAP_API_KEY=your_google_maps_key
```

## Step 3: Start Development Server

```bash
npm run dev
```

Visit **http://localhost:5173** in your browser!

## Step 4: Test the App

### Login/Signup
1. Go to the landing page
2. Click "Get Started" or "Login"
3. Use any email/password (mock auth in development)

### Explore Features
- **Dashboard**: View your stats and quick actions
- **Find a Ride**: Search for available trips
- **Offer a Ride**: Post a new trip
- **Messages**: Real-time chat (WebSocket)
- **Payments**: View wallet and transactions
- **Settings**: Manage preferences

## Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run tests
npm run test:coverage    # Run with coverage
npm run test:ui          # Interactive test UI

# Code Quality
npm run lint             # Check linting
npm run lint:fix         # Fix linting issues
npm run format           # Format code
npm run type-check       # Check TypeScript
```

## Project Structure

```
wassel/
├── components/     # React components
├── contexts/       # Context providers
├── hooks/          # Custom hooks
├── pages/          # Page components
├── router/         # Routing configuration
├── services/       # External services
├── utils/          # Utility functions
├── test/           # Test files
└── public/         # Static assets
```

## Common Tasks

### Add a New Page

1. Create page component in `/pages/MyPage.tsx`
2. Add route in `/router/index.tsx`
3. Add navigation link in `/components/Sidebar.tsx`

### Add a New Hook

1. Create hook in `/hooks/useMyHook.ts`
2. Export from `/hooks/index.ts`
3. Use anywhere: `import { useMyHook } from '../hooks';`

### Add a New Component

1. Create component in `/components/MyComponent.tsx`
2. Import where needed
3. Use shadcn/ui components from `/components/ui/`

## Testing

```bash
# Run all tests
npm run test

# Run specific test file
npm run test Dashboard.test.tsx

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Building for Production

```bash
# Build
npm run build

# Preview
npm run preview

# Check build size
npm run build -- --analyze
```

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the /dist folder
```

### Docker
```bash
docker build -t wassel .
docker run -p 80:80 wassel
```

## Environment Variables

### Development
```env
VITE_APP_ENV=development
VITE_ENABLE_DEBUG_MODE=true
```

### Production
```env
VITE_APP_ENV=production
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check TypeScript
npm run type-check

# Check linting
npm run lint
```

## Next Steps

1. ✅ **Read the README**: Full project documentation
2. ✅ **Check DEPLOYMENT.md**: Production deployment guide
3. ✅ **Review PRODUCTION_CHECKLIST.md**: Complete features list
4. ✅ **Set up Supabase**: Backend integration
5. ✅ **Configure Analytics**: Google Analytics, etc.

## Need Help?

- **Documentation**: Check `/README.md` and `/DEPLOYMENT.md`
- **Issues**: Create an issue on GitHub
- **Email**: support@wassel.app

---

**Happy Coding! 🚀**

Built with ❤️ for the Middle East
