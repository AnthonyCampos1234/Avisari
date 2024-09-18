"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ShareIcon from '@mui/icons-material/Share';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinancialAid() {
    const [openPopover, setOpenPopover] = useState('');
    const popoverRef = useRef<HTMLDivElement>(null);

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
                    <IconButton onClick={() => handlePopoverToggle('add')} className="rounded-full transition-all duration-300 hover:bg-gray-100">
                        <AddIcon />
                    </IconButton>
                    <IconButton onClick={() => handlePopoverToggle('chat')} className="rounded-full transition-all duration-300 hover:bg-gray-100">
                        <ChatIcon />
                    </IconButton>
                    <IconButton onClick={() => handlePopoverToggle('progress')} className="rounded-full transition-all duration-300 hover:bg-gray-100">
                        <AssessmentIcon />
                    </IconButton>
                    <IconButton onClick={() => handlePopoverToggle('share')} className="rounded-full transition-all duration-300 hover:bg-gray-100">
                        <ShareIcon />
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
                                {/* Popover content would go here */}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Financial Aid Management</h1>
                    <div className="mb-6">
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#111827',
                                '&:hover': {
                                    backgroundColor: '#374151',
                                },
                                borderRadius: '9999px',
                            }}
                        >
                            Add New Scholarship
                        </Button>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Active Scholarships</h2>
                            <ul className="list-disc pl-5">
                                <li>Merit Scholarship - Due June 1st</li>
                                <li>STEM Excellence Award - Due July 15th</li>
                                <li>Community Service Grant - Due August 30th</li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
                            <ul className="list-disc pl-5">
                                <li>John Doe - Merit Scholarship</li>
                                <li>Jane Smith - STEM Excellence Award</li>
                                <li>Mike Johnson - Community Service Grant</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}