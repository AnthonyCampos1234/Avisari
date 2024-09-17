"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, IconButton, TextField, List, ListItem, ListItemText } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ShareIcon from '@mui/icons-material/Share';
import { motion, AnimatePresence } from 'framer-motion';

type Course = {
    id: string;
    code: string;
    name: string;
    credits: number;
};

type Semester = {
    name: string;
    courses: Course[];
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string | null>(null);

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

    const onDragEnd = (result: DropResult) => {
        // Implement drag and drop logic here
    };

    const handleGenerateAISchedule = async () => {
        setLoading(true);
        setError(null);
        setDebugInfo(null);
        try {
            const jsonData = JSON.stringify({
                departments: [
                    {
                        name: "Computer Science",
                        courses: [
                            { code: "CS101", name: "Introduction to Programming", credits: 4, compulsory: 1 },
                            { code: "CS201", name: "Data Structures", credits: 4, compulsory: 1 },
                        ]
                    },
                ]
            });
            const userPreference = "Computer Science";

            const response = await fetch('/api/generate-schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jsonData, userPreference }),
            });

            const rawResponse = await response.text();
            setDebugInfo(`Raw API response: ${rawResponse}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, body: ${rawResponse}`);
            }

            let parsedSchedule;
            try {
                const initialParse = JSON.parse(rawResponse);
                if (initialParse && initialParse.schedule) {
                    // Remove the introductory text and parse the JSON directly
                    const scheduleJson = initialParse.schedule.substring(initialParse.schedule.indexOf('['));
                    parsedSchedule = JSON.parse(scheduleJson);
                } else {
                    throw new Error('Unexpected response structure');
                }
            } catch (parseError) {
                const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
                throw new Error(`Failed to parse API response: ${errorMessage}, raw response: ${rawResponse}`);
            }

            if (!Array.isArray(parsedSchedule)) {
                throw new Error(`Invalid API response format. Received: ${typeof parsedSchedule}`);
            }

            const isValidStructure = parsedSchedule.every(year =>
                typeof year.year === 'number' &&
                Array.isArray(year.semesters) &&
                year.semesters.every((semester: Semester) =>
                    typeof semester.name === 'string' &&
                    Array.isArray(semester.courses)
                )
            );

            if (!isValidStructure) {
                throw new Error(`Invalid schedule structure. Received: ${JSON.stringify(parsedSchedule)}`);
            }

            setSchedule(parsedSchedule);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(`Failed to generate schedule: ${errorMessage}`);
            setDebugInfo(`Error details: ${JSON.stringify({
                message: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : 'No stack trace available'
            }, null, 2)}`);
        } finally {
            setLoading(false);
        }
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
                ...newCourse,
                credits: 0 // Add a default value for credits
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Insight</h1>
                    <div className="mb-6">
                        <Button
                            onClick={handleGenerateAISchedule}
                            variant="contained"
                            disabled={loading}
                            sx={{
                                backgroundColor: '#111827',
                                '&:hover': {
                                    backgroundColor: '#374151',
                                },
                                borderRadius: '9999px',
                            }}
                        >
                            {loading ? 'Generating...' : 'Generate with AI'}
                        </Button>
                        {error && (
                            <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                                <p>{error}</p>
                                {debugInfo && (
                                    <details>
                                        <summary>Debug Info</summary>
                                        <pre className="mt-2 whitespace-pre-wrap">{debugInfo}</pre>
                                    </details>
                                )}
                            </div>
                        )}
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