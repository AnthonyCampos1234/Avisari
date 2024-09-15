"use client";

import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconButton, Button, TextField, Container, Box, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import HelpIcon from '@mui/icons-material/Help';
import SchoolIcon from '@mui/icons-material/School';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openPopover, setOpenPopover] = useState('');
  const router = useRouter();
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  const handlePopoverToggle = (popoverId: string) => {
    setOpenPopover(prevState => prevState === popoverId ? '' : popoverId);
  };

  const popoverVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', p: 2, display: 'flex', justifyContent: 'flex-start' }}>
          <IconButton onClick={() => handlePopoverToggle('signin')} sx={{ mr: 1 }}>
            <LoginIcon />
          </IconButton>
          <IconButton onClick={() => handlePopoverToggle('help')}>
            <HelpIcon />
          </IconButton>
          <AnimatePresence>
            {openPopover && (
              <motion.div
                ref={popoverRef}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={popoverVariants}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  zIndex: 1,
                  marginTop: '0.5rem',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
              >
                <PopoverContent type={openPopover} />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
        <Box sx={{ mt: 3, mb: 2, px: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Sign in to your account
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%', px: 4, pb: 4 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, borderRadius: 28, py: 1.5, bgcolor: '#111827', '&:hover': { bgcolor: '#374151' } }}
          >
            Sign In
          </Button>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2, mb: 2 }}>
            Or
          </Typography>
          <Button
            fullWidth
            variant="contained"
            startIcon={<SchoolIcon />}
            sx={{
              mt: 1,
              mb: 2,
              borderRadius: 28,
              py: 1.5,
              bgcolor: '#24292e',
              '&:hover': { bgcolor: '#555' }
            }}
          >
            Continue with your University
          </Button>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link href="/forgot-password" passHref>
              <Typography
                component="a"
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Forgot password?
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

function PopoverContent({ type }: { type: string }) {
  const buttonStyle = {
    backgroundColor: '#111827',
    '&:hover': {
      backgroundColor: '#374151',
    },
    borderRadius: '9999px',
    textTransform: 'none',
    color: 'white',
  };

  switch (type) {
    case 'signin':
      return (
        <Box sx={{ p: 2, width: 250 }}>
          <Typography variant="h6" gutterBottom>Sign In</Typography>
          <Typography variant="body2" paragraph>Enter your credentials to access your account.</Typography>
          <Button variant="contained" fullWidth sx={buttonStyle}>
            Learn More
          </Button>
        </Box>
      );
    case 'help':
      return (
        <Box sx={{ p: 2, width: 250 }}>
          <Typography variant="h6" gutterBottom>Need Help?</Typography>
          <Typography variant="body2" paragraph>Having trouble signing in? We're here to assist you.</Typography>
          <Button href="/support" variant="contained" fullWidth sx={buttonStyle}>
            Get Support
          </Button>
        </Box>
      );
    default:
      return null;
  }
}