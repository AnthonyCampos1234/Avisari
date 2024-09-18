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
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome Advisor, {session?.user?.name}!</h1>
                    <div className="grid gap-6 md:grid-cols-3">
                        <DashboardPreview
                            title="Student Insights"
                            icon={<AssessmentIcon />}
                            content={
                                <>
                                    <p className="mb-2">Total Students: 120</p>
                                    <p className="mb-2">At-risk Students: 15</p>
                                    <p className="font-semibold">Action needed:</p>
                                    <p>Schedule meetings with 5 students</p>
                                </>
                            }
                            linkHref="/dashboard/insight"
                        />
                        <DashboardPreview
                            title="Financial Aid"
                            icon={<AttachMoneyIcon />}
                            content={
                                <>
                                    <p className="mb-2">New Scholarships: 3</p>
                                    <p className="mb-2">Aid Applications: 25</p>
                                    <p className="font-semibold">Upcoming deadline:</p>
                                    <p>Merit Scholarship: June 1st</p>
                                </>
                            }
                            linkHref="/dashboard/savior"
                        />
                        <DashboardPreview
                            title="Advisor Profile"
                            icon={<PersonIcon />}
                            content={
                                <>
                                    <p className="mb-2">Name: {session?.user?.name}</p>
                                    <p className="mb-2">Email: {session?.user?.email}</p>
                                    <p className="font-semibold">Next appointment:</p>
                                    <p>May 15, 2:00 PM - John Doe</p>
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
                    <h2 className="text-lg font-bold mb-2">Student Insights</h2>
                    <p className="mb-4">View and manage your students' academic progress.</p>
                    <Button href="/dashboard/insight" variant="contained" fullWidth sx={buttonStyle}>
                        Go to Insights
                    </Button>
                </div>
            );
        case 'savior':
            return (
                <div className="p-4 w-64">
                    <h2 className="text-lg font-bold mb-2">Financial Aid</h2>
                    <p className="mb-4">Manage financial aid and scholarship opportunities for students.</p>
                    <Button href="/dashboard/savior" variant="contained" fullWidth sx={buttonStyle}>
                        Go to Financial Aid
                    </Button>
                </div>
            );
        case 'profile':
            return (
                <div className="p-4 w-64">
                    <h2 className="text-lg font-bold mb-2">Advisor Profile</h2>
                    <p className="mb-4">Update your information and view your schedule.</p>
                    <Button href="/dashboard/profile" variant="contained" fullWidth sx={buttonStyle}>
                        View Profile
                    </Button>
                </div>
            );
        default:
            return null;
    }
}