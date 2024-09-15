"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { IconButton, Button } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const { session, status } = useAuth(true);
    const [openPopover, setOpenPopover] = useState('');
    const popoverRef = useRef<HTMLDivElement>(null);

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

    if (status === "loading") {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

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
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="border-b border-gray-200 p-2 flex relative">
                    <IconButton onClick={() => handlePopoverToggle('insight')} className="rounded-full transition-all duration-300 hover:bg-gray-100">
                        <AssessmentIcon />
                    </IconButton>
                    <IconButton onClick={() => handlePopoverToggle('savior')} className="rounded-full transition-all duration-300 hover:bg-gray-100">
                        <AttachMoneyIcon />
                    </IconButton>
                    <IconButton onClick={() => handlePopoverToggle('profile')} className="rounded-full transition-all duration-300 hover:bg-gray-100">
                        <PersonIcon />
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome, {session?.user?.name}!</h1>
                    <div className="grid gap-6 md:grid-cols-3">
                        <DashboardPreview
                            title="Insight"
                            icon={<AssessmentIcon />}
                            content={
                                <>
                                    <p className="mb-2">Current GPA: 3.5</p>
                                    <p className="mb-2">Credits completed: 60/120</p>
                                    <p className="font-semibold">Next recommended course:</p>
                                    <p>Advanced Algorithms</p>
                                </>
                            }
                            linkHref="/dashboard/insight"
                        />
                        <DashboardPreview
                            title="Savior"
                            icon={<AttachMoneyIcon />}
                            content={
                                <>
                                    <p className="mb-2">Tuition balance: $5,000</p>
                                    <p className="mb-2">Scholarship opportunities: 3 new</p>
                                    <p className="font-semibold">Tip:</p>
                                    <p>Apply for Merit Scholarship by June 1st</p>
                                </>
                            }
                            linkHref="/dashboard/savior"
                        />
                        <DashboardPreview
                            title="Profile"
                            icon={<PersonIcon />}
                            content={
                                <>
                                    <p className="mb-2">Name: {session?.user?.name}</p>
                                    <p className="mb-2">Email: {session?.user?.email}</p>
                                    <p className="font-semibold">Action needed:</p>
                                    <p>Update your contact information</p>
                                </>
                            }
                            linkHref="/dashboard/profile"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardPreview({ title, icon, content, linkHref }: {
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
    linkHref: string;
}) {
    return (
        <Link href={linkHref} className="block">
            <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gray-50 rounded-lg p-6 shadow-md transition-all duration-200"
            >
                <div className="flex items-center mb-4">
                    <IconButton className="mr-2 bg-gray-200">
                        {icon}
                    </IconButton>
                    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                </div>
                <div className="text-gray-600">
                    {content}
                </div>
            </motion.div>
        </Link>
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
        case 'insight':
            return (
                <div className="p-4 w-64">
                    <h2 className="text-lg font-bold mb-2">Insight</h2>
                    <p className="mb-4">View your academic progress and get course recommendations.</p>
                    <Button href="/dashboard/insight" variant="contained" fullWidth sx={buttonStyle}>
                        Go to Insight
                    </Button>
                </div>
            );
        case 'savior':
            return (
                <div className="p-4 w-64">
                    <h2 className="text-lg font-bold mb-2">Savior</h2>
                    <p className="mb-4">Manage your finances and explore scholarship opportunities.</p>
                    <Button href="/dashboard/savior" variant="contained" fullWidth sx={buttonStyle}>
                        Go to Savior
                    </Button>
                </div>
            );
        case 'profile':
            return (
                <div className="p-4 w-64">
                    <h2 className="text-lg font-bold mb-2">Profile</h2>
                    <p className="mb-4">Update your personal information and settings.</p>
                    <Button href="/dashboard/profile" variant="contained" fullWidth sx={buttonStyle}>
                        View Profile
                    </Button>
                </div>
            );
        default:
            return null;
    }
}