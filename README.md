# PigeonHole Web UI

A secure, end-to-end encrypted file sharing application with a WeTransfer-inspired minimalist design. Built with React, TypeScript, and Material-UI.

![PigeonHole Logo](public/logo.png)

## Features

- **End-to-End Encryption**: Client-side RSA 4096-bit encryption using OpenPGP.js
- **Secure Authentication**: Auth0 integration with PigeonHole JWT token exchange
- **Multiple Recipients**: Send encrypted files to up to 3 recipients simultaneously
- **Transient Keys**: Send files to users without PigeonHole accounts using ephemeral keys
- **File Compression**: Automatic tar.gz compression before encryption
- **Expiration Control**: Set expiration times (1 hour to 28 days) or never expire
- **One-Time Secrets**: Files that self-destruct after first download
- **Progress Tracking**: Real-time progress for encryption, upload, download, and decryption
- **Multi-Account Support**: Store and manage keys for multiple email addresses
- **Theme Support**: Light and dark mode with user preference persistence
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Accessibility**: ARIA labels and keyboard navigation support

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v7
- **State Management**: Zustand
- **Routing**: React Router v6
- **Authentication**: Auth0 React SDK
- **Cryptography**: OpenPGP.js (RSA 4096-bit)
- **HTTP Client**: Axios
- **Compression**: pako (gzip) + custom tar implementation
- **File Upload**: react-dropzone

## Architecture

### Security Model

1. **Key Generation**: RSA 4096-bit keypairs generated client-side
2. **Key Storage**: Private keys encrypted with AES-GCM and stored in localStorage
3. **Encryption Flow**:
   - Files → tar.gz compression → OpenPGP encryption → Upload to S3
4. **Decryption Flow**:
   - Download from S3 → OpenPGP decryption → tar.gz extraction → Files
5. **Zero-Knowledge**: Server never sees unencrypted data or private keys

### Project Structure

```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Common/         # Reusable components
│   ├── Crypto/         # Cryptography-related UI
│   ├── Layout/         # Layout and navigation
│   ├── Send/           # Secret sending components
│   └── Receive/        # Secret receiving components
├── hooks/              # Custom React hooks
├── pages/              # Main application pages
├── services/
│   ├── api/           # API client and endpoints
│   ├── crypto/        # Cryptographic operations
│   └── fileHandling/  # File compression and validation
├── stores/            # Zustand state management
├── types/             # TypeScript type definitions
├── theme/             # Material-UI theme configuration
├── utils/             # Utility functions
└── config/            # App configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Auth0 account with configured application
- PigeonHole API access

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd pigeonhole-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```

4. **Edit `.env.local`** with your configuration:
   ```env
   VITE_AUTH0_CLIENT_ID=your_auth0_client_id_here
   VITE_API_BASE_URL=https://api.pigeonhole.io/v1
   ```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Build for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

The optimized build will be in the `dist/` directory.

## Configuration

### Auth0 Setup

1. Create an Auth0 application (Single Page Application)
2. Configure Allowed Callback URLs: `http://localhost:3000, https://yourdomain.com`
3. Configure Allowed Logout URLs: `http://localhost:3000, https://yourdomain.com`
4. Configure Allowed Web Origins: `http://localhost:3000, https://yourdomain.com`
5. Set the Auth0 Domain: `pigeonholeio.uk.auth0.com`
6. Copy the Client ID to your `.env.local`

### API Configuration

The application expects the PigeonHole API to be available at the configured `VITE_API_BASE_URL`. The API should support:

- **POST** `/auth/oidc/handler/auth0` - Exchange Auth0 token for PigeonHole JWT
- **GET** `/user/me` - Get current user details
- **POST** `/user/me/key` - Upload public key
- **GET** `/user` - Search users by email
- **POST** `/secret` - Create secret envelope
- **GET** `/secret` - List received secrets
- **GET** `/secret/:id` - Get secret details
- **GET** `/secret/:id/download` - Download encrypted secret
- **DELETE** `/secret/:id` - Delete a secret

## User Flows

### First-Time User (Onboarding)

1. User clicks "Sign In" on landing page
2. Auth0 authentication flow
3. PigeonHole token exchange
4. Key generation modal appears
5. RSA 4096-bit keypair generated client-side
6. Private key encrypted and stored in localStorage
7. Public key uploaded to PigeonHole API
8. User redirected to Send Secret page

### Returning User

1. User signs in with Auth0
2. Existing key loaded from localStorage
3. User immediately has access to Send/Receive pages

### Sending a Secret

1. User uploads files via drag-and-drop or file picker
2. User enters recipient email addresses (max 3)
3. User configures options:
   - Expiration time (1h, 24h, 7d, 28d, never)
   - One-time secret (optional)
   - Transient key for non-PigeonHole users (optional)
4. Application searches for recipients
5. Files compressed to tar.gz
6. tar.gz encrypted with recipients' public keys
7. Secret envelope created via API
8. Encrypted data uploaded to S3
9. User receives secret ID and share link

### Receiving a Secret

1. User navigates to Receive Secrets page
2. Application fetches list of received secrets
3. User clicks "Download" on a secret
4. Encrypted data downloaded from S3
5. Data decrypted with user's private key
6. tar.gz extracted to individual files
7. Files available for download
8. If one-time secret, automatically deleted after download

## Security Considerations

### Key Storage

- **Private keys** are encrypted with AES-GCM before localStorage storage
- **Encryption keys** are randomly generated and stored alongside
- Keys are stored per email address for multi-account support
- Keys never leave the browser

### Session Management

- **Auth0 tokens** are memory-only (not persisted)
- **PigeonHole JWT** is memory-only (not persisted)
- Sessions expire according to Auth0 configuration
- Logout clears all session data but preserves keys

### Best Practices

- Always use HTTPS in production
- Configure Content Security Policy headers
- Enable Auth0 refresh token rotation
- Regularly rotate API keys
- Monitor for security updates in dependencies

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Requires:
- Web Crypto API support
- localStorage support
- ES2020 JavaScript features

## Performance

### Bundle Size

- Initial bundle: ~390KB (gzipped)
- Code splitting enabled for:
  - Vendor libraries (React, React Router)
  - Material-UI components
  - OpenPGP.js crypto library
  - Auth0 SDK

### Optimization

- Lazy loading for routes
- Tree shaking for unused code
- Production builds minified and optimized
- Assets compressed with gzip/brotli

## Development Guidelines

### Code Style

- TypeScript strict mode enabled
- ESLint configuration included
- Follow React best practices
- Use functional components with hooks

### State Management

- **Zustand** for global state (auth, keys, secrets, UI)
- **React state** for local component state
- **Custom hooks** for reusable logic

### Component Structure

- Functional components with TypeScript
- Props interfaces defined for all components
- Error boundaries for graceful error handling
- Loading states for async operations

## Troubleshooting

### "Key generation failed"

- Ensure browser supports Web Crypto API
- Check browser console for detailed errors
- Try clearing localStorage and regenerating keys

### "Token exchange failed"

- Verify Auth0 Client ID is correct
- Check Auth0 application configuration
- Ensure API base URL is correct
- Check browser network tab for API errors

### "User not found"

- Recipient doesn't have a PigeonHole account
- Enable "Transient Key" option to generate ephemeral keys
- Or ask recipient to sign up first

### "Decryption failed"

- Secret may be encrypted for a different key
- Try signing out and back in to refresh keys
- Contact sender to verify they used the correct recipient

## Contributing

This is a production application. Follow these guidelines:

1. Write TypeScript with strict type checking
2. Add comprehensive error handling
3. Include loading and error states
4. Follow Material-UI design patterns
5. Test on multiple browsers and screen sizes
6. Update documentation for new features

## License

Proprietary - All rights reserved

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the PigeonHole API documentation
- Contact the development team

---

**Built with security and privacy in mind. Your files, your keys, your control.**
