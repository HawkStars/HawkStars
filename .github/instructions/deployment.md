# Deployment Guide

## Environment Setup

### Required Environment Variables

```bash
# Database
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/hawkstars

# Payload CMS
PAYLOAD_SECRET=your-32-character-secret-key

# Cloudinary (Media Storage)
CLOUDINARY_CLOUD_NAME=hawkstars-media
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Sentry (Error Monitoring)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ORG=your-org
SENTRY_PROJECT=hawkstars

# Production Only
NODE_ENV=production
```

### Development vs Production Configuration

#### Development

```bash
# Start development server
pnpm dev

# Access points:
# - Frontend: http://localhost:3000
# - CMS Admin: http://localhost:3000/admin
# - API: http://localhost:3000/api
```

#### Production Build

```bash
# Build optimized version
pnpm build

# Start production server
pnpm start
```

## Deployment Platforms

### Vercel Deployment (Recommended)

#### Automatic Deployment

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set build command: `pnpm build`
4. Set output directory: `.next`
5. Enable automatic deployments on push to main

#### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Production deployment
vercel --prod
```

#### Vercel Configuration

```javascript
// vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Alternative: Docker Deployment

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  hawkstars:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URI=${DATABASE_URI}
      - PAYLOAD_SECRET=${PAYLOAD_SECRET}
      - CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
      - CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
      - CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
    depends_on:
      - mongo

  mongo:
    image: mongo:5.0
    ports:
      - '27017:27017'
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

## Database Deployment

### MongoDB Atlas (Cloud)

1. Create MongoDB Atlas account
2. Create new cluster
3. Configure network access (add your deployment IP)
4. Create database user
5. Get connection string for DATABASE_URI
6. Ensure connection string includes database name

### Local MongoDB (Development)

```bash
# Install MongoDB locally
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Use local connection string
DATABASE_URI=mongodb://localhost:27017/hawkstars
```

## Content Delivery Network

### Cloudinary Setup

1. Create Cloudinary account
2. Note your cloud name from dashboard
3. Generate API credentials
4. Configure upload presets for different image types
5. Set up automatic optimizations and transformations

### Image Optimization Strategy

```typescript
// Cloudinary transformations in use:
// - Auto format (webp/avif when supported)
// - Auto quality optimization
// - Responsive sizing based on device
// - Lazy loading for performance
```

## Performance Monitoring

### Sentry Configuration

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: process.env.NODE_ENV === 'development',
  environment: process.env.NODE_ENV,
});
```

### Performance Optimizations

```typescript
// next.config.ts optimizations:
export default {
  // Image optimization
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Compression
  compress: true,

  // Bundle analysis
  experimental: {
    bundleAnalyzer: {
      enabled: process.env.ANALYZE === 'true',
    },
  },
};
```

## Deployment Checklist

### Pre-Deployment

- [ ] Run `pnpm build` locally to verify build success
- [ ] Test all environment variables are set correctly
- [ ] Verify database connection works
- [ ] Check Cloudinary integration is working
- [ ] Run `pnpm lint` and fix any issues
- [ ] Test both Portuguese and English language versions
- [ ] Verify CMS admin panel is accessible

### Post-Deployment

- [ ] Test frontend loads correctly on both /pt and /en routes
- [ ] Verify CMS admin panel works (/admin)
- [ ] Check image uploads and display correctly
- [ ] Test form submissions work
- [ ] Monitor Sentry for any errors
- [ ] Verify Google Forms integration works
- [ ] Test responsive design on mobile devices
- [ ] Check page load speeds with Lighthouse

### Production Maintenance

- [ ] Monitor Sentry dashboard for errors
- [ ] Check MongoDB Atlas metrics
- [ ] Monitor Cloudinary usage limits
- [ ] Set up regular database backups
- [ ] Monitor Vercel function usage and limits
- [ ] Keep dependencies updated with security patches

## SSL and Security

### Content Security Policy

```typescript
// Configured in next.config.ts
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://*.cloudinary.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.sentry.io;
`;
```

### HTTPS Configuration

- Vercel automatically provides SSL certificates
- Ensure all external APIs use HTTPS endpoints
- Configure secure cookies for authentication

## Rollback Procedures

### Vercel Rollback

1. Go to Vercel dashboard
2. Navigate to deployments
3. Select previous successful deployment
4. Click "Promote to Production"

### Database Rollback

1. Restore from MongoDB Atlas backup
2. Or revert specific collection changes via Payload admin
3. Clear any cached data if necessary

### Emergency Procedures

1. Disable automatic deployments in Vercel
2. Rollback to last known good version
3. Check error logs in Sentry
4. Fix issues in development
5. Re-enable automatic deployments after verification

This deployment guide ensures reliable and secure production deployments of the HawkStars application.
