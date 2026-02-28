import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { LoginButton } from '@/components/Auth/LoginButton';

/**
 * Landing page for non-authenticated users
 * Plane Sailing design system: dark theme with violet accent
 */
export const Landing: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/vault');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        backgroundColor: '#07090d',
        position: 'relative',
      }}
    >
      {/* Radial Violet Glow Background */}
      <Box
        sx={{
          position: 'fixed',
          top: '20%',
          right: '-30%',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Navigation Bar */}
      <Box
        sx={{
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(7, 9, 13, 0.8)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(167, 139, 250, 0.1)',
        }}
      >
        <Box
          sx={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 2, sm: 4, md: 6 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src="/logo.png"
              alt="PigeonHole Logo"
              sx={{ height: 32, width: 'auto' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#a78bfa',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Pigeon<span style={{ color: '#a78bfa' }}>Hole</span>
            </Typography>
          </Box>
          <LoginButton size="small" />
        </Box>
      </Box>

      {/* Main Content - Offset by fixed header */}
      <Box sx={{ flex: 1, position: 'relative', zIndex: 1, pt: 8 }}>
        {/* Hero Section */}
        <Box
          sx={{
            minHeight: { xs: 'calc(100vh - 64px)', md: '80vh' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            px: { xs: 2, sm: 4, md: 6 },
            py: { xs: 6, md: 8 },
          }}
        >
          <Container maxWidth="md">
            {/* Kicker Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mb: 3,
                px: 2,
                py: 1,
                backgroundColor: 'rgba(167, 139, 250, 0.1)',
                borderRadius: 20,
                border: '1px solid rgba(167, 139, 250, 0.2)',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#a78bfa',
                  animation: 'blink 1.5s infinite',
                  '@keyframes blink': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.3 },
                  },
                }}
              />
              <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600 }}>
                ZERO-KNOWLEDGE ENCRYPTION
              </Typography>
            </Box>

            {/* Main Heading */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                fontWeight: 700,
                lineHeight: 1.1,
                mb: 3,
                color: '#dde6f0',
              }}
            >
              Send secrets with{' '}
              <span style={{ color: '#a78bfa', fontStyle: 'italic' }}>total</span> confidence
            </Typography>

            {/* Lead Paragraph */}
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.1rem' },
                color: '#6b7f96',
                lineHeight: 1.7,
                mb: 4,
                maxWidth: 600,
              }}
            >
              End-to-end encrypted file sharing. Your private keys stay in your browser. Even we can't access your data.
            </Typography>

            {/* CTA Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 12, flexWrap: 'wrap' }}>
              <LoginButton size="large">Get Started Free</LoginButton>
              <Button
                variant="outlined"
                size="large"
                href="https://pigeono.io"
                target="_blank"
                sx={{
                  borderColor: 'rgba(167, 139, 250, 0.3)',
                  color: '#a78bfa',
                  '&:hover': {
                    borderColor: '#a78bfa',
                    backgroundColor: 'rgba(167, 139, 250, 0.08)',
                  },
                }}
              >
                Learn More
              </Button>
            </Box>

            {/* Browser Chrome Portal Mockup */}
            <Box
              sx={{
                maxWidth: 650,
                margin: '0 auto',
                backgroundColor: '#0b0e14',
                border: '1px solid rgba(167, 139, 250, 0.1)',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(167, 139, 250, 0.1)',
              }}
            >
              {/* Browser Tab Bar */}
              <Box
                sx={{
                  backgroundColor: '#0f1219',
                  borderBottom: '1px solid rgba(167, 139, 250, 0.1)',
                  px: 3,
                  py: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[12, 12, 12].map((size, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: size,
                        height: 12,
                        borderRadius: '2px',
                        backgroundColor: i === 0 ? 'rgba(167, 139, 250, 0.3)' : 'rgba(167, 139, 250, 0.15)',
                      }}
                    />
                  ))}
                </Box>
                <Typography variant="caption" sx={{ color: '#6b7f96', ml: 2, fontSize: '0.7rem' }}>
                  nestbox.pigeono.io
                </Typography>
              </Box>

              {/* Mock UI Content */}
              <Box sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#a78bfa', fontWeight: 600, mb: 1 }}>
                    My Vault
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(167, 139, 250, 0.05)',
                      border: '1px solid rgba(167, 139, 250, 0.1)',
                      borderRadius: '8px',
                      p: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#dde6f0', fontWeight: 500 }}>
                          secret-proposal.pdf
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b7f96' }}>
                          From: alice@example.com
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '6px',
                          backgroundColor: 'rgba(167, 139, 250, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="caption" sx={{ color: '#a78bfa', fontWeight: 700 }}>
                          PDF
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        height: 2,
                        backgroundColor: 'rgba(167, 139, 250, 0.1)',
                        borderRadius: '1px',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: '65%',
                          height: '100%',
                          backgroundColor: '#a78bfa',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Stats Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
            gap: 0,
            backgroundColor: 'rgba(167, 139, 250, 0.03)',
            borderTop: '1px solid rgba(167, 139, 250, 0.1)',
            borderBottom: '1px solid rgba(167, 139, 250, 0.1)',
          }}
        >
          {[
            { label: 'RSA 4096', desc: 'Military-grade encryption' },
            { label: 'Zero-Knowledge', desc: 'We cant access your data' },
            { label: 'One-time Delivery', desc: 'Secrets expire after use' },
          ].map((stat, i) => (
            <Box
              key={i}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRight: i < 2 ? '1px solid rgba(167, 139, 250, 0.1)' : 'none',
              }}
            >
              <Typography variant="h6" sx={{ color: '#a78bfa', fontWeight: 600, mb: 1 }}>
                {stat.label}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7f96' }}>
                {stat.desc}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Features Section */}
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            px: { xs: 2, sm: 4, md: 6 },
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 8,
                textAlign: 'center',
                color: '#dde6f0',
              }}
            >
              Enterprise-Grade Features
            </Typography>

            {/* Hairline Grid Features */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                gap: 0,
              }}
            >
              {[
                {
                  kicker: '// encryption',
                  title: 'Client-Side Encryption',
                  desc: 'All files are encrypted in your browser before upload. Your private keys never leave your device.',
                },
                {
                  kicker: '// recipients',
                  title: 'Multiple Recipients',
                  desc: 'Send secrets to multiple people. Each recipient decrypts with their own key for maximum security.',
                },
                {
                  kicker: '// expiration',
                  title: 'Expiration Control',
                  desc: 'Set custom expiration times. Secrets auto-delete after viewing or on deadline.',
                },
              ].map((feature, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 4,
                    borderRight: i % 3 < 2 ? '1px solid rgba(167, 139, 250, 0.1)' : 'none',
                    borderBottom: i < 3 ? '1px solid rgba(167, 139, 250, 0.1)' : 'none',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#6b7f96',
                      fontSize: '0.68rem',
                      textTransform: 'uppercase',
                      fontFamily: 'JetBrains Mono, monospace',
                      letterSpacing: '0.1em',
                      display: 'block',
                      mb: 2,
                    }}
                  >
                    {feature.kicker}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#dde6f0', fontWeight: 600, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7f96', lineHeight: 1.6 }}>
                    {feature.desc}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            borderTop: '1px solid rgba(167, 139, 250, 0.1)',
            py: 6,
            px: { xs: 2, sm: 4, md: 6 },
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 4, mb: 4 }}>
              {/* Product Column */}
              <Box>
                <Typography variant="h6" sx={{ color: '#dde6f0', fontWeight: 600, mb: 2 }}>
                  Product
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['Vault', 'Keys', 'Settings'].map((item) => (
                    <Typography
                      key={item}
                      variant="body2"
                      sx={{
                        color: '#6b7f96',
                        cursor: 'pointer',
                        '&:hover': { color: '#a78bfa' },
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Box>

              {/* Company Column */}
              <Box>
                <Typography variant="h6" sx={{ color: '#dde6f0', fontWeight: 600, mb: 2 }}>
                  Company
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['About', 'Blog', 'Careers'].map((item) => (
                    <Typography
                      key={item}
                      variant="body2"
                      sx={{
                        color: '#6b7f96',
                        cursor: 'pointer',
                        '&:hover': { color: '#a78bfa' },
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Box>

              {/* Legal Column */}
              <Box>
                <Typography variant="h6" sx={{ color: '#dde6f0', fontWeight: 600, mb: 2 }}>
                  Legal
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['Privacy', 'Terms', 'Security'].map((item) => (
                    <Typography
                      key={item}
                      variant="body2"
                      sx={{
                        color: '#6b7f96',
                        cursor: 'pointer',
                        '&:hover': { color: '#a78bfa' },
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                borderTop: '1px solid rgba(167, 139, 250, 0.1)',
                pt: 4,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: '#6b7f96' }}>
                © 2026 PigeonHole. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};
