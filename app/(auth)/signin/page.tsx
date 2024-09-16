"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, TextField, Container, Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

type ChatBubbleProps = {
  type: 'student' | 'ai' | 'advisor' | 'system';
  children: React.ReactNode;
  isVisible: boolean;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ type, children, isVisible }) => {
  const bubbleClasses = {
    student: 'bg-blue-100 text-blue-800 ml-auto',
    ai: 'bg-gray-100 text-gray-800',
    advisor: 'bg-green-100 text-green-800',
    system: 'bg-yellow-100 text-yellow-800 text-center italic',
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
  const [isAdvisorChat, setIsAdvisorChat] = useState(false);

  const chatSteps: { type: ChatBubbleProps['type']; message: string }[] = [
    { type: 'student', message: "Hello, I need help with my course selection." },
    { type: 'ai', message: "Of course! I'd be happy to help. What are your interests and current major?" },
    { type: 'student', message: "I'm interested in computer science, but I'm not sure which courses to take next semester." },
    { type: 'ai', message: "Based on your interests, I recommend considering courses in algorithms, data structures, and software engineering. However, for more personalized advice, I suggest speaking with an academic advisor." },
    { type: 'system', message: "Connecting you with an advisor..." },
  ];

  const advisorChat: { type: ChatBubbleProps['type']; message: string }[] = [
    { type: 'advisor', message: "Hi there! I'm your academic advisor. I see you're interested in computer science courses. Let's discuss your academic goals and create a plan that aligns with your interests and degree requirements." },
    { type: 'student', message: "Thank you! I'd love to discuss my options for next semester." },
    { type: 'advisor', message: "Great! Let's start by reviewing your current progress and then we can explore some course options that will help you meet your goals." },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAdvisorChat && currentStep < chatSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else if (!isAdvisorChat && currentStep === chatSteps.length - 1) {
        setIsAdvisorChat(true);
        setCurrentStep(0);
      } else if (isAdvisorChat && currentStep < advisorChat.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsAdvisorChat(false);
        setCurrentStep(0);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [currentStep, isAdvisorChat]);

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
            bgcolor: 'white',
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            mb: 4,
            height: '300px',
            overflow: 'hidden',
          }}
        >
          <div className={`h-full transition-opacity duration-1000 ${isAdvisorChat ? 'opacity-0' : 'opacity-100'}`}>
            <div className="h-full overflow-y-auto space-y-4">
              {chatSteps.map((step, index) => (
                <ChatBubble key={index} type={step.type} isVisible={index <= currentStep}>
                  {step.message}
                </ChatBubble>
              ))}
            </div>
          </div>
          <div className={`h-full transition-opacity duration-1000 ${isAdvisorChat ? 'opacity-100' : 'opacity-0'}`} style={{ marginTop: '-300px' }}>
            <div className="h-full overflow-y-auto space-y-4">
              {advisorChat.map((step, index) => (
                <ChatBubble key={index} type={step.type} isVisible={index <= currentStep}>
                  {step.message}
                </ChatBubble>
              ))}
            </div>
          </div>
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