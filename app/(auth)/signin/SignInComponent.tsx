"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, TextField, Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import { useSearchParams } from 'next/navigation';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useSession } from "next-auth/react";

export default function SignInComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated" && session?.user?.userType) {
            redirectBasedOnUserType(session.user.userType);
        }
    }, [status, session]);

    const redirectBasedOnUserType = (userType: string) => {
        switch (userType) {
            case 'student':
                router.push("/student/dashboard");
                break;
            case 'advisor':
                router.push("/advisor/dashboard");
                break;
            default:
                router.push("/dashboard");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
        // No else block needed here, as the useEffect will handle redirection
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
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
                disabled={isLoading}
                sx={{
                    mt: 3,
                    mb: 2,
                    borderRadius: 2,
                    py: 1.5,
                    bgcolor: '#000000',
                    '&:hover': { bgcolor: '#333333' },
                }}
            >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
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
                University Signin
            </Button>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/forgot-password" passHref>
                    <Typography
                        component="a"
                        variant="body2"
                        sx={{
                            color: '#23bbe9',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                        }}
                    >
                        Forgot password?
                    </Typography>
                </Link>
                <Link href="/signup" passHref>
                    <Typography
                        component="a"
                        variant="body2"
                        sx={{
                            color: '#23bbe9',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                        }}
                    >
                        Don't have an account? Sign Up
                    </Typography>
                </Link>
            </Box>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link href="/" passHref>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: '#666',
                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                        }}
                    >
                        Back to Home
                    </Button>
                </Link>
            </Box>
        </Box>
    );
}