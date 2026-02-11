# PigeonHole Web UI - Deployment Guide

## Pre-Deployment Checklist

Before deploying the PigeonHole web application to production, ensure you have completed all these steps:

### 1. Environment Configuration

- [ ] Auth0 application created and configured
- [ ] Production API endpoint available
- [ ] Environment variables prepared
- [ ] SSL/TLS certificates ready (HTTPS required)

### 2. Auth0 Configuration

Configure your Auth0 application with production URLs:

1. **Application Settings**:
   - Application Type: Single Page Application
   - Token Endpoint Authentication Method: None

2. **Application URIs**:
   ```
   Allowed Callback URLs:
   https://yourdomain.com, https://yourdomain.com/callback

   Allowed Logout URLs:
   https://yourdomain.com

   Allowed Web Origins:
   https://yourdomain.com

   Allowed Origins (CORS):
   https://yourdomain.com
   ```

3. **Advanced Settings**:
   - OAuth: Enable "OIDC Conformant"
   - Grant Types: Authorization Code, Implicit, Refresh Token
   - Refresh Token Rotation: Enabled (recommended)
   - Refresh Token Expiration: 30 days (or as required)

### 3. Build Configuration

Create `.env.production` file:

```env
VITE_AUTH0_CLIENT_ID=your_production_auth0_client_id
VITE_API_BASE_URL=https://api.pigeonhole.io/v1
```

## Deployment Options

### Option 1: Netlify (Recommended)

Netlify provides easy deployment with automatic HTTPS, CDN, and continuous deployment.

#### Step-by-Step Netlify Deployment

1. **Install Netlify CLI** (optional, for CLI deployment):
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Deploy via CLI**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Or deploy via Git**:
   - Push code to GitHub/GitLab/Bitbucket
   - Connect repository to Netlify
   - Configure build settings:
     ```
     Build command: npm run build
     Publish directory: dist
     ```

5. **Configure environment variables** in Netlify dashboard:
   - Go to Site settings → Environment variables
   - Add `VITE_AUTH0_CLIENT_ID`
   - Add `VITE_API_BASE_URL`

6. **Configure redirects** for SPA routing:

   Create `public/_redirects` file (if not exists):
   ```
   /*    /index.html   200
   ```

7. **Configure headers** for security:

   Create `public/_headers` file:
   ```
   /*
     X-Frame-Options: DENY
     X-Content-Type-Options: nosniff
     Referrer-Policy: strict-origin-when-cross-origin
     Permissions-Policy: geolocation=(), microphone=(), camera=()
   ```

### Option 2: Vercel

Vercel offers similar features to Netlify with excellent performance.

#### Vercel Deployment Steps

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Or deploy via Git**:
   - Push code to GitHub
   - Import project in Vercel dashboard
   - Configure build settings:
     ```
     Framework Preset: Vite
     Build Command: npm run build
     Output Directory: dist
     ```

4. **Configure environment variables** in Vercel dashboard:
   - Add `VITE_AUTH0_CLIENT_ID`
   - Add `VITE_API_BASE_URL`

5. **Configure rewrites** in `vercel.json`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           { "key": "X-Frame-Options", "value": "DENY" },
           { "key": "X-Content-Type-Options", "value": "nosniff" },
           { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
         ]
       }
     ]
   }
   ```

### Option 3: AWS S3 + CloudFront

For full control and AWS integration.

#### AWS Deployment Steps

1. **Create S3 bucket**:
   ```bash
   aws s3 mb s3://pigeonhole-web-prod
   ```

2. **Enable static website hosting**:
   ```bash
   aws s3 website s3://pigeonhole-web-prod \
     --index-document index.html \
     --error-document index.html
   ```

3. **Build and upload**:
   ```bash
   npm run build
   aws s3 sync dist/ s3://pigeonhole-web-prod --delete
   ```

4. **Create CloudFront distribution**:
   - Origin: S3 bucket
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Compress Objects Automatically: Yes
   - Price Class: Use All Edge Locations
   - Alternate Domain Names: yourdomain.com
   - SSL Certificate: AWS Certificate Manager

5. **Configure error pages** in CloudFront:
   - Error Code: 403, 404
   - Response Page Path: /index.html
   - Response Code: 200

6. **Set up Route 53** (if using AWS DNS):
   - Create A record pointing to CloudFront distribution

### Option 4: Docker Container

For containerized deployment on any platform.

#### Dockerfile

Create `Dockerfile`:

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

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Build and run Docker container:

```bash
docker build -t pigeonhole-web .
docker run -p 80:80 pigeonhole-web
```

## Post-Deployment Configuration

### 1. DNS Configuration

Point your domain to the deployed application:

- **Netlify**: Add custom domain in dashboard
- **Vercel**: Add domain in project settings
- **AWS**: Create Route 53 records pointing to CloudFront
- **Custom**: Create A/CNAME records pointing to your server

### 2. SSL/TLS Setup

- **Netlify/Vercel**: Automatic HTTPS (Let's Encrypt)
- **AWS**: Use AWS Certificate Manager
- **Custom**: Use Let's Encrypt or commercial certificate

### 3. Content Security Policy

Add CSP headers for enhanced security:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://pigeonholeio.uk.auth0.com https://api.pigeonhole.io;
  frame-ancestors 'none';
```

### 4. Update Auth0 Configuration

Update Auth0 settings with production URLs:

1. Go to Auth0 Dashboard
2. Update application URLs with production domain
3. Test authentication flow

### 5. Monitor and Test

- [ ] Test user authentication
- [ ] Test key generation
- [ ] Test file upload and encryption
- [ ] Test file download and decryption
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify HTTPS is working
- [ ] Check browser console for errors
- [ ] Verify API connections

## Continuous Deployment

### GitHub Actions (Example)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        env:
          VITE_AUTH0_CLIENT_ID: ${{ secrets.VITE_AUTH0_CLIENT_ID }}
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
        run: npm run build

      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './dist'
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Monitoring and Maintenance

### Error Monitoring

Set up error monitoring with Sentry:

1. **Install Sentry**:
   ```bash
   npm install @sentry/react
   ```

2. **Configure in `main.tsx`**:
   ```typescript
   import * as Sentry from "@sentry/react";

   if (import.meta.env.PROD) {
     Sentry.init({
       dsn: "your-sentry-dsn",
       environment: "production",
       tracesSampleRate: 0.1,
     });
   }
   ```

### Analytics (Optional)

Add Google Analytics or similar:

1. Add tracking code to `index.html`
2. Implement privacy-friendly analytics
3. Track key user actions (sign-ups, uploads, downloads)

### Performance Monitoring

Monitor performance metrics:
- Page load time
- Time to interactive
- First contentful paint
- Bundle size
- API response times

### Backup and Recovery

- Regularly backup Auth0 configuration
- Document environment variables
- Keep deployment scripts version controlled
- Test disaster recovery procedures

## Scaling Considerations

### CDN Configuration

- Enable CDN for static assets
- Configure cache headers appropriately
- Use edge locations close to users

### API Rate Limiting

- Implement client-side rate limiting
- Handle 429 responses gracefully
- Add retry logic with exponential backoff

### Browser Caching

Configure appropriate cache headers:

```
# Immutable assets (with hash in filename)
Cache-Control: public, max-age=31536000, immutable

# HTML (always revalidate)
Cache-Control: no-cache

# Other assets
Cache-Control: public, max-age=86400
```

## Security Checklist

- [ ] HTTPS enabled and enforced
- [ ] Security headers configured
- [ ] CSP policy implemented
- [ ] Auth0 production settings verified
- [ ] API endpoints use HTTPS
- [ ] CORS configured correctly
- [ ] No sensitive data in client code
- [ ] localStorage encryption in place
- [ ] Session timeout configured
- [ ] Rate limiting enabled

## Rollback Procedure

If issues occur after deployment:

### Netlify/Vercel
1. Go to Deployments
2. Find previous working deployment
3. Click "Publish deploy"

### AWS CloudFront
1. Invalidate CloudFront cache: `aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"`
2. Restore previous S3 version or re-upload

### Docker
```bash
docker pull pigeonhole-web:previous-tag
docker-compose up -d
```

## Support and Troubleshooting

### Common Issues

1. **"Token exchange failed"**
   - Verify Auth0 Client ID
   - Check Auth0 callback URLs
   - Ensure API is accessible

2. **"CORS errors"**
   - Update API CORS settings
   - Verify Auth0 allowed origins

3. **"Static assets not loading"**
   - Check build output
   - Verify CDN configuration
   - Check cache settings

4. **"Routing not working"**
   - Ensure SPA redirects configured
   - Check Netlify _redirects file
   - Verify nginx configuration

## Maintenance Schedule

### Weekly
- Monitor error logs
- Check performance metrics
- Review user feedback

### Monthly
- Update dependencies: `npm update`
- Security audit: `npm audit`
- Review analytics data

### Quarterly
- Major dependency updates
- Performance optimization review
- Security assessment

## Contact and Support

For deployment issues or questions:
- Review this deployment guide
- Check application logs
- Contact DevOps team
- Review Auth0 documentation
- Review PigeonHole API documentation

---

**Deployment Status**: Ready for production deployment 🚀
