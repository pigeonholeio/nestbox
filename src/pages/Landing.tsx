import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import { LoginButton } from '@/components/Auth/LoginButton';

/**
 * Landing page for non-authenticated users
 */
export const Landing: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/send');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: <LockIcon sx={{ fontSize: 48 }} />,
      title: 'End-to-End Encryption',
      description:
        'Your files are encrypted in your browser before upload. Only you and your recipients can decrypt them.',
    },
    {
      icon: <CloudOffIcon sx={{ fontSize: 48 }} />,
      title: 'Zero-Knowledge Architecture',
      description:
        'Your private keys never leave your browser. We cannot access your encrypted data, ever.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48 }} />,
      title: 'Military-Grade Security',
      description:
        'RSA 4096-bit encryption with OpenPGP ensures your secrets are protected with the strongest cryptography.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 48 }} />,
      title: 'Simple & Fast',
      description:
        'No technical knowledge required. Drag, drop, and send. Your recipients get instant notifications.',
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header - Full Width */}
      <Box sx={{ width: '100%', bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ py: 2, px: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src="/logo.png"
              alt="PigeonHole Logo"
              sx={{ height: 32 }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
              PigeonHole
            </Typography>
          </Box>
          <LoginButton />
        </Box>
      </Box>

      {/* Hero Section with Background Image - Full Width */}
      <Box
        sx={{
          width: '100%',
          backgroundImage: 'url(https://pigeono.io/assets/images/landing_page.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          position: 'relative',
          py: { xs: 8, sm: 12, md: 16 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
              }}
            >
              Secure Drop
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                mb: 4,
                maxWidth: 700,
                mx: 'auto',
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              Send encrypted files with confidence through your browser! End-to-end encryption that even we can't break.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <LoginButton size="large">Get Started Free</LoginButton>
              <Button variant="outlined" size="large" href="#features">
                Learn More
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Features Section - Full Width */}
      <Box sx={{ width: '100%', bgcolor: 'background.default', py: { xs: 8, sm: 12, md: 16 } }}>
        <Box sx={{ px: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
          <Typography
            id="features"
            variant="h4"
            sx={{
              textAlign: 'center',
              mb: 8,
              fontWeight: 600,
              fontSize: { xs: '1.75rem', md: '2.125rem' },
            }}
          >
            Why Secure Drop?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                  }}
                >
                  <CardContent>
                    <Box sx={{ color: 'primary.main', mb: 2, display: 'flex', justifyContent: 'center' }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Security Notice Section - Full Width */}
      <Box sx={{ width: '100%', bgcolor: 'primary.main', color: 'primary.contrastText', py: { xs: 8, sm: 12, md: 16 } }}>
        <Box sx={{ px: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto', textAlign: 'center' }}>
          <LockIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
            Your Security is Our Priority
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto', mb: 4, lineHeight: 1.6 }}>
            PigeonHole is powered by GPG client-side encryption to ensure that your files are secure before they ever leave your
            device. Your private keys are stored only in your browser securely and where no other app can access, giving you complete
            control over your data.
          </Typography>
          <LoginButton variant="outlined" size="large">
            Start Encrypting Now
          </LoginButton>
        </Box>
      </Box>

      {/* Footer - Full Width */}
      <Box sx={{ width: '100%', bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', mt: 'auto' }}>
        <Box sx={{ py: 3, px: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © 2026 PigeonHole. Secure file sharing with end-to-end encryption.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
