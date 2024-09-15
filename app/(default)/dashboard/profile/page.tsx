"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IconButton, Button, TextField } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [openPopover, setOpenPopover] = useState('');
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/signin");
        } else if (session?.user) {
            setName(session.user.name || "");
            setEmail(session.user.email || "");
        }
    }, [session, status, router]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            });
            if (res.ok) {
                setMessage("Profile updated successfully!");
            } else {
                setMessage("Failed to update profile.");
            }
        } catch (error) {
            setMessage("An error occurred.");
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

    if (status === "loading") {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="border-b border-gray-200 p-2 flex relative">
                    <IconButton onClick={() => handlePopoverToggle('profile')} className="rounded-full transition-all duration-300 hover:bg-gray-100">
                        <PersonIcon />
                    </IconButton>
                    <IconButton onClick={() => handlePopoverToggle('edit')} className="rounded-full transition-all duration-300 hover:bg-gray-100">
                        <EditIcon />
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">User Profile</h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <TextField
                                label="Name"
                                variant="outlined"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SaveIcon />}
                                sx={{
                                    backgroundColor: '#111827',
                                    '&:hover': {
                                        backgroundColor: '#374151',
                                    },
                                    borderRadius: '9999px',
                                    textTransform: 'none',
                                }}
                            >
                                Update Profile
                            </Button>
                        </form>
                        {message && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4 text-sm text-green-600 text-center"
                            >
                                {message}
                            </motion.p>
                        )}
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
        case 'profile':
            return (
                <div className="p-4 w-64">
                    <h2 className="text-lg font-bold mb-2">Profile</h2>
                    <p className="mb-4">View and manage your profile information.</p>
                    <Button href="/dashboard/profile" variant="contained" fullWidth sx={buttonStyle}>
                        Go to Profile
                    </Button>
                </div>
            );
        case 'edit':
            return (
                <div className="p-4 w-64">
                    <h2 className="text-lg font-bold mb-2">Edit Profile</h2>
                    <p className="mb-4">Make changes to your profile information.</p>
                    <Button variant="contained" fullWidth sx={buttonStyle}>
                        Edit Profile
                    </Button>
                </div>
            );
        default:
            return null;
    }
}