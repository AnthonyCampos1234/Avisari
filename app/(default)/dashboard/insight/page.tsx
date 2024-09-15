"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, IconButton, TextField, List, ListItem, ListItemText } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ShareIcon from '@mui/icons-material/Share';
import { motion, AnimatePresence } from 'framer-motion';

type Semester = {
    name: string;
    courses: any[]; // Replace 'any' with a more specific type if available
};

type Year = {
    year: number;
    semesters: Semester[];
};

export default function Insight() {
    const [schedule, setSchedule] = useState<Year[]>([]);
    const [openPopover, setOpenPopover] = useState('');
    const [newCourse, setNewCourse] = useState({ code: '', name: '' });
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<string[]>([]);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize empty schedule structure
        const years = 4;
        const semestersPerYear = 4;
        const newSchedule = Array.from({ length: years }, (_, yearIndex) => ({
            year: yearIndex + 1,
            semesters: Array.from({ length: semestersPerYear }, (_, semesterIndex) => ({
                name: getSemesterName(semesterIndex),
                courses: []
            }))
        }));
        setSchedule(newSchedule);
    }, []);

    const getSemesterName = (index: number) => {
        const semesterNames = ['Fall', 'Spring', 'Summer 1', 'Summer 2'];
        return semesterNames[index];
    };

    const onDragEnd = (result: any) => {
        // Implement drag and drop logic here
    };

    const handleGenerateAISchedule = async () => {
        // API call to get AI-generated schedule
        // This is a placeholder and should be replaced with actual API call
        const response = await fetch('/api/generate-schedule');
        const data = await response.json();
        setSchedule(data);
    };

    const handlePopoverToggle = useCallback((popoverId: string) => {
        setOpenPopover(prevState => prevState === popoverId ? '' : popoverId);
    }, []);

    const handleAddCourse = () => {
        if (newCourse.code && newCourse.name) {
            // Add the new course to the first available semester
            const updatedSchedule = [...schedule];
            const firstYear = updatedSchedule[0];
            const firstSemester = firstYear.semesters[0];
            firstSemester.courses.push({
                id: `course-${Date.now()}`, // Generate a unique ID
                ...newCourse
            });
            setSchedule(updatedSchedule);
            setNewCourse({ code: '', name: '' });
            handlePopoverToggle(''); // Close the popover
        }
    };

    const handleChatSubmit = () => {
        if (chatMessage.trim()) {
            setChatHistory(prev => [...prev, `You: ${chatMessage}`]);
            // Here you would typically send the message to an AI service and get a response
            // For now, we'll just echo a simple response
            setTimeout(() => {
                setChatHistory(prev => [...prev, `AI: Thanks for your message about "${chatMessage}". How can I assist you further?`]);
            }, 1000);
            setChatMessage('');
        }
    };

    const renderPopoverContent = () => {
        const buttonStyle = {
            backgroundColor: '#111827',
            '&:hover': {
                backgroundColor: '#374151',
            },
            borderRadius: '9999px',
            textTransform: 'none',
            color: 'white',
        };

        switch (openPopover) {
            case 'add':
                return (
                    <div className="p-4 w-64">
                        <h2 className="text-lg font-bold mb-2">Add Course</h2>
                        <TextField
                            label="Course Code"
                            value={newCourse.code}
                            onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Course Name"
                            value={newCourse.name}
                            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <Button onClick={handleAddCourse} variant="contained" fullWidth sx={buttonStyle}>
                            Add Course
                        </Button>
                    </div>
                );
            case 'chat':
                return (
                    <div className="p-4 w-64">
                        <h2 className="text-lg font-bold mb-2">AI Assistant</h2>
                        <List className="h-40 overflow-y-auto mb-2">
                            {chatHistory.map((msg, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={msg} />
                                </ListItem>
                            ))}
                        </List>
                        <TextField
                            label="Message"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Button onClick={handleChatSubmit} variant="contained" fullWidth sx={buttonStyle}>
                            Send
                        </Button>
                    </div>
                );
            case 'progress':
                return (
                    <div className="p-4 w-64">
                        <h2 className="text-lg font-bold mb-2">Progress Tracking</h2>
                        <Button variant="contained" fullWidth sx={buttonStyle}>
                            View Progress
                        </Button>
                    </div>
                );
            case 'share':
                return (
                    <div className="p-4 w-64">
                        <h2 className="text-lg font-bold mb-2">Export/Share</h2>
                        <Button variant="contained" fullWidth sx={buttonStyle}>
                            Share Schedule
                        </Button>
                    </div>
                );
            default:
                return null;
        }
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
                                {renderPopoverContent()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Course Planner</h1>
                    <div className="mb-6">
                        <Button
                            onClick={handleGenerateAISchedule}
                            variant="contained"
                            sx={{
                                backgroundColor: '#111827',
                                '&:hover': {
                                    backgroundColor: '#374151',
                                },
                                borderRadius: '9999px',
                            }}
                        >
                            Generate with AI
                        </Button>
                    </div>
                    <DragDropContext onDragEnd={onDragEnd}>
                        {schedule.map((year, yearIndex) => (
                            <div key={yearIndex} className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Year {year.year}</h2>
                                <div className="grid grid-cols-4 gap-4">
                                    {year.semesters.map((semester, semesterIndex) => (
                                        <Droppable droppableId={`year-${yearIndex}-semester-${semesterIndex}`} key={semesterIndex}>
                                            {(provided) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className="p-4 bg-gray-50 rounded-lg"
                                                >
                                                    <h3 className="font-semibold text-lg text-gray-900 mb-3">{semester.name}</h3>
                                                    {semester.courses.length > 0 ? (
                                                        semester.courses.map((course: any, index: number) => (
                                                            <Draggable key={course.id} draggableId={course.id} index={index}>
                                                                {(provided) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className="bg-white p-3 mb-2 rounded-md shadow-sm border border-gray-200 transition-all hover:shadow-md"
                                                                    >
                                                                        <span className="font-medium">{course.code}:</span> {course.name}
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-500 italic">No courses added yet</p>
                                                    )}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </DragDropContext>
                </div>
            </div>
        </div>
    );
}