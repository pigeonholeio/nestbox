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

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/receive');
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
    <Box sx={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      {/* Navigation Bar */}
      <Box sx={{ width: '100%', bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, zIndex: 100 }}>
        <Box sx={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 2, sm: 4, md: 6 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src="/logo.png"
              alt="PigeonHole Logo"
              sx={{ height: 40 }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              [Beta] PigeonHole 
            </Typography>
          </Box>
          <LoginButton />
        </Box>
      </Box>

      {/* Hero */}
      <Box
        sx={{
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.paper',
          position: 'relative',
          py: { xs: 6, md: 0 },
          px: { xs: 2, sm: 4, md: 6 },
          textAlign: 'center',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 800, paddingTop: "30px"}}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
              color: 'primary.main',
            }}
          >
            Flight Deck
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 4,
              fontWeight: 400,
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              lineHeight: 1.6,
            }}
          >
            Send encrypted files with total confidence - right from your browser,<br/>powered by <a href="https://pigeono.io" target='_blank'>PigeonHole</a>. <br /><br />End-to-end encryption that even we can't break.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <LoginButton size="large">Get Started</LoginButton>
            <Button variant="outlined" size="large" href="https://pigeono.io" target='_blank'>
              Learn More
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Features */}
      <Box sx={{ width: '100%', bgcolor: 'background.paper', py: { xs: 6, md: 8 }, px: { xs: 2, sm: 4, md: 6 } }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          <Typography
            id="features"
            variant="h4"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 600,
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            Why Choose Flight Deck?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ height: '100%', textAlign: 'center' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ color: 'primary.main', mb: 2, fontSize: 0 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* CTA Section */}
      <Box sx={{ width: '100%', bgcolor: 'primary.main', color: 'primary.contrastText', py: { xs: 6, md: 8 }, px: { xs: 2, sm: 4, md: 6 } }}>
        <Box sx={{ maxWidth: 900, mx: 'auto', textAlign: 'center' }}>
          <LockIcon sx={{ fontSize: 56, mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Your Data's Security is Our Priority
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7, fontSize: { xs: '0.95rem', md: '1rem' } }}>
            PigeonHole uses secure client-side GPG encryption to ensure your files are fully encrypted before they leave your device. Your private keys stay
            only in your browser, where no other app can access them. <br/><br/>You have complete control over your data.
          </Typography>
          <LoginButton variant="outlined" size="large">
            Start Encrypting Now
          </LoginButton>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ width: '100%', bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', py: 3, px: { xs: 2, sm: 4, md: 6 } }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © 2026 PigeonHole.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
