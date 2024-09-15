"use client";

import { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ShareIcon from '@mui/icons-material/Share';

export default function Insight() {
    const [activeSection, setActiveSection] = useState('schedule');
    const [semesters, setSemesters] = useState([]);

    const onDragEnd = (result: any) => {
        // Implement drag and drop logic here
    };

    const handleGenerateAISchedule = async () => {
        // API call to get AI-generated schedule
        // This is a placeholder and should be replaced with actual API call
        const response = await fetch('/api/generate-schedule');
        const data = await response.json();
        setSemesters(data);
    };

    return (
        <div className="p-4 bg-white min-h-screen flex flex-col items-center">
            <div className="w-full max-w-6xl bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <div className="flex">
                    <div className="w-16 border-r border-gray-200 p-2 space-y-4">
                        <IconButton onClick={() => setActiveSection('add')} color={activeSection === 'add' ? 'primary' : 'default'}>
                            <AddIcon />
                        </IconButton>
                        <IconButton onClick={() => setActiveSection('chat')} color={activeSection === 'chat' ? 'primary' : 'default'}>
                            <ChatIcon />
                        </IconButton>
                        <IconButton onClick={() => setActiveSection('progress')} color={activeSection === 'progress' ? 'primary' : 'default'}>
                            <AssessmentIcon />
                        </IconButton>
                        <IconButton onClick={() => setActiveSection('share')} color={activeSection === 'share' ? 'primary' : 'default'}>
                            <ShareIcon />
                        </IconButton>
                    </div>
                    <div className="flex-1 p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Course Planner</h1>
                        <div className="mb-6">
                            <Button
                                onClick={handleGenerateAISchedule}
                                variant="contained"
                                className="bg-gray-900 hover:bg-gray-800 text-white"
                            >
                                Generate with AI
                            </Button>
                        </div>
                        <DragDropContext onDragEnd={onDragEnd}>
                            {semesters.map((semester: any, semesterIndex: number) => (
                                <Droppable droppableId={`semester-${semesterIndex}`} key={semesterIndex}>
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="mb-6 p-4 bg-gray-50 rounded-lg"
                                        >
                                            <h3 className="font-semibold text-lg text-gray-900 mb-3">Semester {semesterIndex + 1}</h3>
                                            {semester.courses.map((course: any, index: number) => (
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
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </DragDropContext>
                    </div>
                </div>
            </div>
        </div>
    );
}