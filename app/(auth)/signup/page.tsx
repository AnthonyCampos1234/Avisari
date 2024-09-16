import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const chatSteps = [
    { type: 'user', message: "Hi, I'd like to create a new account." },
    { type: 'ai', message: "Great! Please fill out the registration form with your details. Make sure to use a strong password." },
    { type: 'user', message: "Do I need to verify my email after signing up?" },
    { type: 'ai', message: "Yes, we'll send a verification link to your email. Please check your inbox and click the link to activate your account." },
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

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 4,
          }}
        >
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Create your account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                      color: 'text.primary',
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
        <Box
          sx={{
            flex: 1,
            bgcolor: '#f3f4f6',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
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
      </Box>
    </Container>
  );
}