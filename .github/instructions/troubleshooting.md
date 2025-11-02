# Troubleshooting Guide

## Common Development Issues

### Build and Development Server Issues

#### "Module not found" errors
```bash
# Clear Next.js cache and node_modules
rm -rf .next node_modules pnpm-lock.yaml
pnpm install
pnpm dev

# If using TypeScript, regenerate Payload types
pnpm payload:generate
```

#### Development server won't start
```bash
# Check if port 3000 is in use
lsof -ti:3000

# Kill process using port 3000
kill -9 $(lsof -ti:3000)

# Or start on different port
pnpm dev -- -p 3001
```

#### Turbopack issues
```bash
# Start without Turbopack if issues occur
next dev

# Or clear Turbopack cache
rm -rf .next/cache
```

### Internationalization Issues

#### Language not switching properly
```typescript
// Check middleware configuration in middleware.ts
export const config = {
  matcher: ['/((?!api|sitemap|robots|_next/static|_next/image|images|favicon).*)'],
};

// Verify withHandleInternalization is working
console.log('Middleware triggered for:', request.nextUrl.pathname);
```

#### Missing translations
```typescript
// Check if translation keys exist in both locales
// i18n/locales/pt/common.json
// i18n/locales/en/common.json

// Debug translation loading
const { t, ready } = useTranslation('common');
console.log('Translation ready:', ready);
console.log('Current language:', i18n.language);
```

#### Cookie not persisting language
```typescript
// Check cookie settings in withHandleInternalization
response.cookies.set(i18CookieName, lng, {
  httpOnly: false, // Allow client-side access
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
});
```

### Payload CMS Issues

#### Cannot access admin panel
```bash
# Check if admin route is excluded from i18n middleware
if (request.nextUrl.pathname.includes('admin')) return NextResponse.next();

# Verify Payload configuration
DATABASE_URI=mongodb://localhost:27017/hawkstars
PAYLOAD_SECRET=your-secret-key

# Check if database is running
mongodb://localhost:27017 # For local MongoDB
```

#### Types not updating after schema changes
```bash
# Regenerate Payload types
pnpm payload:generate

# If still having issues, restart development server
pnpm dev
```

#### Database connection issues
```typescript
// Check MongoDB connection string format
// Local: mongodb://localhost:27017/hawkstars
// Atlas: mongodb+srv://user:pass@cluster.mongodb.net/dbname

// Debug connection in payload.config.ts
db: mongooseAdapter({
  url: process.env.DATABASE_URI || 'mongodb://localhost:27017/hawkstars',
  connectOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
}),
```

#### Collection access errors
```typescript
// Verify access control in collection config
access: {
  admin: authenticated, // Only authenticated users can access admin
  read: anyone,        // Anyone can read
  create: authenticated,
  update: authenticated,
  delete: authenticated,
}

// Check if user is properly authenticated
const { user } = req;
console.log('Current user:', user);
```

### Styling and UI Issues

#### Tailwind classes not applying
```bash
# Restart development server to reload Tailwind config
pnpm dev

# Check if Tailwind CSS is imported in globals.css
@tailwind base;
@tailwind components; 
@tailwind utilities;
```

#### Custom CSS classes not working
```css
/* Check if custom classes are defined in globals.css */
.text-h1_semibold {
  font-size: 2.5rem;
  font-weight: 600;
  line-height: 1.2;
}

/* Verify CSS variables are defined */
:root {
  --color-bege-light: #fef9f6;
  --color-green: #2d5a27;
}
```

#### Button component styling issues
```typescript
// Check classname-variants configuration in Button.tsx
const buttonVariants = tv({
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium",
  variants: {
    variant: {
      success: "bg-green text-white hover:bg-green/90",
      error: "bg-red-500 text-white hover:bg-red-600",
    }
  }
});
```

### Image and Media Issues

#### Cloudinary images not loading
```typescript
// Check Next.js image configuration in next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      pathname: '/**',
    },
  ],
}

// Verify Cloudinary environment variables
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Images not uploading in CMS
```typescript
// Check Cloudinary plugin configuration in payload/plugins/index.ts
cloudStorage({
  collections: {
    media: {
      adapter: cloudinaryAdapter({
        cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
        apiKey: process.env.CLOUDINARY_API_KEY!,
        apiSecret: process.env.CLOUDINARY_API_SECRET!,
      }),
    },
  },
})
```

### Form and Data Issues

#### Form submissions failing
```typescript
// Check API route exists and is properly configured
// app/api/contact/route.ts

// Verify CORS headers if needed
export async function POST(request: Request) {
  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
```

#### React Hook Form validation not working
```typescript
// Check form validation rules
const { register, handleSubmit, formState: { errors } } = useForm({
  mode: 'onBlur', // Validate on blur
  defaultValues: {
    email: '',
    name: '',
  }
});

// Ensure validation rules are properly defined
{...register('email', { 
  required: 'Email is required',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email address'
  }
})}
```

## Production Issues

### Deployment Failures

#### Vercel build failures
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing environment variables
# - TypeScript errors
# - Import path issues

# Test build locally
pnpm build

# Check for type errors
npx tsc --noEmit
```

#### Environment variable issues
```bash
# Verify all required environment variables are set in Vercel
# Go to Project Settings > Environment Variables

# Test environment variables locally
echo $DATABASE_URI
echo $PAYLOAD_SECRET
```

### Performance Issues

#### Slow page load times
```typescript
// Check for heavy imports that can be dynamized
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false // If component doesn't need SSR
});

// Optimize images with proper sizing
<Image
  src={imageUrl}
  alt={altText}
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={isAboveFold} // Only for above-fold images
/>
```

#### Large bundle size
```bash
# Analyze bundle size
ANALYZE=true pnpm build

# Check for duplicate dependencies
npx depcheck

# Consider code splitting for large components
```

### SEO and Meta Issues

#### Meta tags not updating
```typescript
// Check metadata generation in layout.tsx and page.tsx
export async function generateMetadata({ params: { lng } }) {
  const { t } = await createTranslation(lng, 'common');
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      locale: lng,
    },
  };
}
```

### Database Issues

#### MongoDB connection timeouts
```bash
# Check MongoDB Atlas network access
# Ensure deployment IP is whitelisted
# Or allow access from anywhere: 0.0.0.0/0

# Check connection string format
mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

#### Collection queries failing
```typescript
// Add error handling to Payload queries
try {
  const result = await payload.find({
    collection: 'artworks',
    locale: lng,
  });
  return result.docs;
} catch (error) {
  console.error('Failed to fetch artworks:', error);
  return [];
}
```

## Debug Tools and Commands

### Logging and Debugging
```typescript
// Add debugging to middleware
export async function middleware(request: NextRequest) {
  console.log('Middleware:', {
    pathname: request.nextUrl.pathname,
    cookies: request.cookies.getAll(),
    headers: Object.fromEntries(request.headers.entries())
  });
  
  if (request.nextUrl.pathname.includes('admin')) return NextResponse.next();
  return withHandleInternalization(request);
}
```

### Useful Development Commands
```bash
# Clear all caches and restart
rm -rf .next node_modules pnpm-lock.yaml
pnpm install
pnpm payload:generate
pnpm dev

# Check TypeScript errors
npx tsc --noEmit

# Format code and fix linting
pnpm format:fix
pnpm lint --fix

# Test database connection
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.DATABASE_URI).then(() => console.log('Connected')).catch(console.error)"

# Check environment variables
printenv | grep -E "(DATABASE_URI|PAYLOAD_SECRET|CLOUDINARY)"
```

### Browser Debugging
```javascript
// Check language detection in browser console
console.log('Current language:', localStorage.getItem('i18nextLng'));
console.log('Accept-Language header:', navigator.language);
console.log('Available languages:', navigator.languages);

// Check cookies
console.log('i18next cookie:', document.cookie.split(';').find(c => c.includes('i18next')));

// Debug translations
console.log('Translation function:', window.i18n?.t('home.title'));
```

## Getting Help

### Documentation Resources
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [React i18next Documentation](https://react.i18next.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Community Support
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)
- [Payload CMS Discord](https://discord.gg/payload)
- [React i18next GitHub Issues](https://github.com/i18next/react-i18next/issues)

### Project-Specific Help
1. Check existing GitHub issues in the HawkStars repository
2. Review recent commits for similar changes
3. Test the issue in isolation to identify the root cause
4. Create minimal reproduction case for complex issues

This troubleshooting guide covers the most common issues encountered in HawkStars development. Always start with the simplest solutions before diving into complex debugging.