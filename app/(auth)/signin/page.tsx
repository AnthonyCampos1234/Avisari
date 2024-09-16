"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, TextField, Container, Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

type ChatBubbleProps = {
  type: 'user' | 'ai';
  children: React.ReactNode;
  isVisible: boolean;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ type, children, isVisible }) => {
  const bubbleClasses = {
    user: 'bg-blue-100 text-blue-800 ml-auto',
    ai: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className={`rounded-lg p-3 max-w-[80%] ${bubbleClasses[type]} transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {children}
    </div>
  );
};

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const chatSteps = [
    { type: 'user', message: "Hi, I need to sign in to my account." },
    { type: 'ai', message: "Of course! Please enter your email and password in the fields below. If you're a university student, you can also use the 'University Signin' button." },
    { type: 'user', message: "What if I forgot my password?" },
    { type: 'ai', message: "No problem! You can click on the 'Forgot password?' link below the sign-in form to reset your password." },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentStep < chatSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setCurrentStep(0);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [currentStep]);

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

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Chat Hero Section */}
        <Box
          sx={{
            width: '100%',
            bgcolor: '#f3f4f6',
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            mb: 4,
            minHeight: '200px',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Need help?
          </Typography>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            {chatSteps.map((step, index) => (
              <ChatBubble key={index} type={step.type as 'user' | 'ai'} isVisible={index <= currentStep}>
                {step.message}
              </ChatBubble>
            ))}
          </Box>
        </Box>

        {/* Sign In Form Section */}
        <Box
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Sign in to your account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
              University Signin
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
      </Box>
    </Container>
  );
}