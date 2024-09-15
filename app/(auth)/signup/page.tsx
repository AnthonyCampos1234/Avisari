"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { IconButton, Button, TextField, Container, Box, Typography } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HelpIcon from '@mui/icons-material/Help';
import SchoolIcon from '@mui/icons-material/School';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openPopover, setOpenPopover] = useState('');
  const router = useRouter();
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, phone, password }),
    });

    if (response.ok) {
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
    } else {
      const data = await response.json();
      setError(data.error || "An error occurred during sign up");
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
          <IconButton onClick={() => handlePopoverToggle('signup')} sx={{ mr: 1 }}>
            <PersonAddIcon />
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
            Create your account
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%', px: 4, pb: 4 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
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
            Register
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
            <Typography variant="body2" color="text.secondary">
              By signing up, you agree to the{" "}
              <Link href="#0" passHref>
                <Typography
                  component="a"
                  variant="body2"
                  sx={{
                    color: 'text.primary',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Terms of Service
                  Terms of Service
                </Typography>
              </Link>{" "}
              and{" "}
              <Link href="#0" passHref>
                <Typography
                  component="a"
                  variant="body2"
                  sx={{
                    color: 'text.primary',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Privacy Policy
                </Typography>
              </Link>
              .
            </Typography>
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
    case 'signup':
      return (
        <Box sx={{ p: 2, width: 250 }}>
          <Typography variant="h6" gutterBottom>Sign Up</Typography>
          <Typography variant="body2" paragraph>Create your account to get started.</Typography>
          <Button variant="contained" fullWidth sx={buttonStyle}>
            Learn More
          </Button>
        </Box>
      );
    case 'help':
      return (
        <Box sx={{ p: 2, width: 250 }}>
          <Typography variant="h6" gutterBottom>Need Help?</Typography>
          <Typography variant="body2" paragraph>Having trouble signing up? We're here to assist you.</Typography>
          <Button href="/support" variant="contained" fullWidth sx={buttonStyle}>
            Get Support
          </Button>
        </Box>
      );
    default:
      return null;
  }
}