# 🚀 Deployment Guide

## Pre-Deployment Checklist

### ✅ Required Steps

- [ ] Environment variables configured
- [ ] Supabase project set up
- [ ] Database migrations run
- [ ] API keys added (Maps, Payment providers)
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Analytics configured (GA, Mixpanel, etc.)
- [ ] Domain name purchased
- [ ] SSL certificate obtained
- [ ] Performance tested
- [ ] Security audit completed

### 🔐 Security Checklist

- [ ] All environment variables in `.env.local` (not committed)
- [ ] API keys restricted by domain
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Supabase RLS policies configured

## Platform-Specific Deployment

### 🟢 Vercel (Recommended)

#### Quick Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Configuration (`vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "env": {
    "VITE_APP_ENV": "production"
  },
  "build": {
    "env": {
      "VITE_SUPABASE_URL": "@supabase_url",
      "VITE_SUPABASE_ANON_KEY": "@supabase_anon_key"
    }
  },
  "routes": [
    {
      "src": "/sw.js",
      "headers": { "cache-control": "public, max-age=0, must-revalidate" },
      "dest": "/sw.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### Environment Variables

Add in Vercel Dashboard:
- `VITE_APP_ENV` = `production`
- `VITE_SUPABASE_URL` = Your Supabase URL
- `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
- `VITE_MAP_API_KEY` = Your Google Maps API key
- All other variables from `.env.example`

### 🔵 Netlify

#### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 🐳 Docker

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service worker - no cache
    location = /sw.js {
        add_header Cache-Control "no-cache";
        proxy_cache_bypass $http_pragma;
        proxy_cache_revalidate on;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Build and Run

```bash
# Build
docker build -t wassel:latest .

# Run
docker run -d -p 80:80 --name wassel wassel:latest

# With docker-compose
docker-compose up -d
```

## Supabase Setup

### 1. Create Project

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref
```

### 2. Database Schema

```sql
-- Enable extensions
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text,
  phone text,
  avatar text,
  bio text,
  rating numeric(2,1) default 0,
  total_trips integer default 0,
  is_driver boolean default false,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trips table
create table public.trips (
  id uuid default uuid_generate_v4() primary key,
  driver_id uuid references public.profiles(id) on delete cascade not null,
  origin jsonb not null,
  destination jsonb not null,
  departure_time timestamp with time zone not null,
  available_seats integer not null,
  price_per_seat numeric(10,2) not null,
  trip_type text check (trip_type in ('wasel', 'raje3')) not null,
  status text check (status in ('active', 'completed', 'cancelled')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.trips enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Trips are viewable by everyone"
  on trips for select
  using (true);

create policy "Authenticated users can create trips"
  on trips for insert
  with check (auth.uid() = driver_id);
```

### 3. Run Migrations

```bash
supabase db push
```

## Performance Optimization

### 1. Bundle Analysis

```bash
npm run build -- --analyze
```

### 2. Image Optimization

- Use WebP format
- Implement lazy loading
- Use CDN for static assets

### 3. Code Splitting

Already implemented with React.lazy() in router/index.tsx

### 4. Caching Strategy

- Service Worker for offline support
- LocalStorage for user preferences
- IndexedDB for large data

## Monitoring & Analytics

### 1. Error Tracking (Sentry)

```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// In App.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### 2. Analytics (Google Analytics)

```html
<!-- In index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 3. Performance Monitoring

Use built-in `utils/performance.ts` for tracking metrics.

## Post-Deployment

### Health Checks

- [ ] All pages load correctly
- [ ] Authentication works
- [ ] API calls successful
- [ ] Maps display correctly
- [ ] Payments process (test mode)
- [ ] Real-time features work
- [ ] PWA installs correctly
- [ ] Mobile responsive
- [ ] RTL works for Arabic

### Monitoring Dashboards

Set up monitoring for:
- **Uptime**: UptimeRobot, Pingdom
- **Performance**: Google PageSpeed, Lighthouse
- **Errors**: Sentry
- **Analytics**: Google Analytics, Mixpanel
- **Logs**: Logtail, Papertrail

### Backup Strategy

- **Database**: Daily automated backups via Supabase
- **Files**: Cloud storage (S3, Cloudinary)
- **Code**: Git repository

## Rollback Plan

If deployment fails:

```bash
# Vercel
vercel rollback

# Docker
docker stop wassel
docker run previous-image

# Manual
git revert HEAD
npm run build
# Redeploy
```

## Support & Maintenance

### Regular Tasks

- Weekly: Review error logs
- Monthly: Update dependencies
- Quarterly: Security audit
- Annually: Infrastructure review

### Emergency Contacts

- DevOps: devops@wassel.app
- Support: support@wassel.app
- Security: security@wassel.app

---

**Need help?** Contact the team or check [docs.wassel.app](https://docs.wassel.app)
