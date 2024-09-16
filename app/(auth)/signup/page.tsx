"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button, TextField, Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CircularProgress from '@mui/material/CircularProgress';

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

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

      setIsLoading(false);

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
      }
    } else {
      setIsLoading(false);
      const data = await response.json();
      setError(data.error || "An error occurred during sign up");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
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
        disabled={isLoading}
        sx={{
          mt: 3,
          mb: 2,
          borderRadius: 2,
          py: 1.5,
          bgcolor: '#4ffbb4',
          '&:hover': { bgcolor: '#3dd092' },
        }}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Register"}
      </Button>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2, mb: 2 }}>
        Or
      </Typography>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<SchoolIcon />}
        sx={{
          mt: 1,
          mb: 2,
          borderRadius: 2,
          py: 1.5,
          color: '#23bbe9',
          borderColor: '#23bbe9',
          '&:hover': { bgcolor: 'rgba(35, 187, 233, 0.04)' }
        }}
      >
        University Signup
      </Button>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          By signing up, you agree to the{" "}
          <Link href="#0" passHref>
            <Typography
              component="a"
              variant="body2"
              sx={{
                color: '#23bbe9',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Terms of Service
            </Typography>
          </Link>{" "}
          and{" "}
          <Link href="#0" passHref>
            <Typography
              component="a"
              variant="body2"
              sx={{
                color: '#23bbe9',
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
  );
}