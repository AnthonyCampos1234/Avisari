"use client";

import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconButton, Button, TextField } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import HelpIcon from '@mui/icons-material/Help';
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
    <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 p-2 flex relative">
          <IconButton onClick={() => handlePopoverToggle('signin')} className="rounded-full transition-all duration-300 hover:bg-gray-100">
            <LoginIcon />
          </IconButton>
          <IconButton onClick={() => handlePopoverToggle('help')} className="rounded-full transition-all duration-300 hover:bg-gray-100">
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
                className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg z-20"
              >
                <PopoverContent type={openPopover} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Sign in to your account</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                placeholder="corybarker@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 mt-2"
                >
                  {error}
                </motion.p>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={<LoginIcon />}
                sx={{
                  backgroundColor: '#111827',
                  '&:hover': {
                    backgroundColor: '#374151',
                  },
                  borderRadius: '9999px',
                  textTransform: 'none',
                }}
              >
                Sign In
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors duration-200"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
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
        <div className="p-4 w-64">
          <h2 className="text-lg font-bold mb-2">Sign In</h2>
          <p className="mb-4">Enter your credentials to access your account.</p>
          <Button variant="contained" fullWidth sx={buttonStyle}>
            Learn More
          </Button>
        </div>
      );
    case 'help':
      return (
        <div className="p-4 w-64">
          <h2 className="text-lg font-bold mb-2">Need Help?</h2>
          <p className="mb-4">Having trouble signing in? We're here to assist you.</p>
          <Button href="/support" variant="contained" fullWidth sx={buttonStyle}>
            Get Support
          </Button>
        </div>
      );
    default:
      return null;
  }
}