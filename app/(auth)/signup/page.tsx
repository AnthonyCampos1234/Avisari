"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { IconButton, Button, TextField, Typography } from '@mui/material';
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpenPopover('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 p-2 flex relative">
          <IconButton onClick={() => handlePopoverToggle('signup')} className="rounded-full transition-all duration-300 hover:bg-gray-100">
            <PersonAddIcon />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Create your account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 rounded-lg"
            />
            <TextField
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 rounded-lg"
            />
            <TextField
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-gray-50 rounded-lg"
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 rounded-lg"
            />
            {error && (
              <Typography color="error" variant="body2" className="mt-2">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="mt-4 bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full transition-all duration-300"
            >
              Register
            </Button>
          </form>
          <Typography variant="body2" color="text.secondary" align="center" className="mt-4 mb-4">
            Or
          </Typography>
          <Button
            fullWidth
            variant="contained"
            startIcon={<SchoolIcon />}
            className="mb-4 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full transition-all duration-300"
          >
            Continue with your University
          </Button>
          <div className="text-center mt-4">
            <Typography variant="body2" color="text.secondary">
              By signing up, you agree to the{" "}
              <Link href="#0" className="text-gray-800 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#0" className="text-gray-800 hover:underline">
                Privacy Policy
              </Link>
              .
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

function PopoverContent({ type }: { type: string }) {
  const buttonStyle = "bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full transition-all duration-300";

  switch (type) {
    case 'signup':
      return (
        <div className="p-4 w-64">
          <h2 className="text-lg font-bold mb-2">Sign Up</h2>
          <p className="text-sm text-gray-600 mb-4">Create your account to get started.</p>
          <button className={buttonStyle}>
            Learn More
          </button>
        </div>
      );
    case 'help':
      return (
        <div className="p-4 w-64">
          <h2 className="text-lg font-bold mb-2">Need Help?</h2>
          <p className="text-sm text-gray-600 mb-4">Having trouble signing up? We're here to assist you.</p>
          <a href="/support" className={buttonStyle}>
            Get Support
          </a>
        </div>
      );
    default:
      return null;
  }
}