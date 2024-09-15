"use client";

import { useState, useEffect } from 'react';
import { Button, IconButton, Popover } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ShareIcon from '@mui/icons-material/Share';

type Semester = {
    name: string;
    courses: any[]; // Replace 'any' with a more specific type if available
};

type Year = {
    year: number;
    semesters: Semester[];
};

export default function Insight() {
    const [activeSection, setActiveSection] = useState('schedule');
    const [schedule, setSchedule] = useState<Year[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [openPopover, setOpenPopover] = useState('');

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

    const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>, popoverId: string) => {
        setAnchorEl(event.currentTarget);
        setOpenPopover(popoverId);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setOpenPopover('');
    };

    const renderPopoverContent = () => {
        switch (openPopover) {
            case 'add':
                return <div className="p-4"><h2 className="text-lg font-bold">Add Courses</h2></div>;
            case 'chat':
                return <div className="p-4"><h2 className="text-lg font-bold">AI Assistant</h2></div>;
            case 'progress':
                return <div className="p-4"><h2 className="text-lg font-bold">Progress Tracking</h2></div>;
            case 'share':
                return <div className="p-4"><h2 className="text-lg font-bold">Export/Share</h2></div>;
            default:
                return null;
        }
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'schedule':
                return (
                    <>
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Course Planner</h1>
                        <div className="mb-6">
                            <Button
                                onClick={handleGenerateAISchedule}
                                variant="contained"
                                className="bg-gray-900 hover:bg-gray-700 text-white"
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
                    </>
                );
            case 'add':
                return <h2 className="text-2xl font-bold">Add Courses</h2>;
            case 'chat':
                return <h2 className="text-2xl font-bold">AI Assistant</h2>;
            case 'progress':
                return <h2 className="text-2xl font-bold">Progress Tracking</h2>;
            case 'share':
                return <h2 className="text-2xl font-bold">Export/Share</h2>;
            default:
                return null;
        }
    };

    return (
        <div className="p-4 bg-white min-h-screen">
            <div className="w-full max-w-6xl mx-auto bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col">
                    <div className="border-b border-gray-200 p-2 flex">
                        <IconButton onClick={(e) => handlePopoverOpen(e, 'add')}>
                            <AddIcon />
                        </IconButton>
                        <IconButton onClick={(e) => handlePopoverOpen(e, 'chat')}>
                            <ChatIcon />
                        </IconButton>
                        <IconButton onClick={(e) => handlePopoverOpen(e, 'progress')}>
                            <AssessmentIcon />
                        </IconButton>
                        <IconButton onClick={(e) => handlePopoverOpen(e, 'share')}>
                            <ShareIcon />
                        </IconButton>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto max-h-screen">
                        {renderContent()}
                    </div>
                </div>
            </div>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                {renderPopoverContent()}
            </Popover>
        </div>
    );
}