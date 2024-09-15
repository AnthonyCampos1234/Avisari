"use client";

import { useState, useEffect } from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Insight() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen pt-24 flex flex-col items-center">
            <h1 className="mb-8 text-4xl font-bold text-gray-900 text-center">Course Planner</h1>
            <div className="max-w-6xl w-full">
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-12 lg:col-span-8">
                        <Schedule />
                    </div>
                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        <ClassInputInterface />
                        <AIAssistedModification />
                        <AdvisorInteraction />
                        <ProgressTracking />
                        <ExportAndSharing />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Schedule() {
    const [semesters, setSemesters] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const onDragEnd = (result: any) => {
        // Implement drag and drop logic here
    };

    const handleGenerateAISchedule = async () => {
        setIsLoading(true);
        // API call to get AI-generated schedule
        // This is a placeholder and should be replaced with actual API call
        const response = await fetch('/api/generate-schedule');
        const data = await response.json();
        setSemesters(data);
        setIsLoading(false);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Your Schedule</h2>
                <Button
                    onClick={handleGenerateAISchedule}
                    variant="contained"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                >
                    {isLoading ? 'Generating...' : 'Generate with AI'}
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
    );
}

function ClassInputInterface() {
    const [courseCode, setCourseCode] = useState('');
    const [courseName, setCourseName] = useState('');
    const [credits, setCredits] = useState('');
    const [semester, setSemester] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to submit the course
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Add Course</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Autocomplete
                    options={[]} // This should be populated with course codes
                    renderInput={(params) => <TextField {...params} label="Course Code" variant="outlined" />}
                    onInputChange={(_, newValue) => setCourseCode(newValue)}
                    fullWidth
                />
                <TextField
                    label="Course Name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    label="Credits"
                    type="number"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    label="Semester"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    fullWidth
                    variant="outlined"
                />
                <Button type="submit" variant="contained" fullWidth className="bg-green-600 hover:bg-green-700 text-white">
                    Add Course
                </Button>
            </form>
        </div>
    );
}

function AIAssistedModification() {
    const [userInput, setUserInput] = useState('');
    const [aiResponse, setAiResponse] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Call AI API to get response
        // This is a placeholder and should be replaced with actual API call
        const response = await fetch('/api/ai-assist', {
            method: 'POST',
            body: JSON.stringify({ input: userInput }),
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setAiResponse(data.response);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">AI Assistant</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                    label="Ask AI for schedule modifications"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                />
                <Button type="submit" variant="contained" fullWidth className="bg-purple-600 hover:bg-purple-700 text-white">
                    Get AI Suggestions
                </Button>
            </form>
            {aiResponse && (
                <div className="mt-4 bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-purple-900">AI Suggestion:</h3>
                    <p className="text-purple-800">{aiResponse}</p>
                </div>
            )}
        </div>
    );
}

function AdvisorInteraction() {
    interface Message {
        text: string;
        sender: 'student' | 'advisor';
    }

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to send message to advisor
        setMessages([...messages, { text: newMessage, sender: 'student' }]);
        setNewMessage('');
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Advisor Interaction</h2>
            <div className="h-64 overflow-y-auto mb-4 border rounded p-2">
                {messages.map((message: Message, index: number) => (
                    <div key={index} className={`mb-2 ${message.sender === 'student' ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded ${message.sender === 'student' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
                            {message.text}
                        </span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex">
                <TextField
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    fullWidth
                    placeholder="Type your message..."
                />
                <Button type="submit" variant="contained" className="ml-2 bg-gray-900 hover:bg-gray-800">
                    Send
                </Button>
            </form>
        </div>
    );
}

function ProgressTracking() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Fetch progress data
        // This is a placeholder and should be replaced with actual API call
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        const response = await fetch('/api/progress');
        const data = await response.json();
        setProgress(data.progress);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Progress Tracking</h2>
            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-900 bg-gray-200">
                            Progress
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-gray-900">
                            {progress}%
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-900"></div>
                </div>
            </div>
        </div>
    );
}

function ExportAndSharing() {
    const handleExport = (format: string) => {
        // Logic to export schedule in different formats
    };

    const handleShare = () => {
        // Logic to share schedule
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Export and Sharing</h2>
            <div className="space-x-2">
                <Button onClick={() => handleExport('pdf')} variant="outlined" className="text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white">Export as PDF</Button>
                <Button onClick={() => handleExport('ical')} variant="outlined" className="text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white">Export as iCal</Button>
                <Button onClick={handleShare} variant="contained" className="bg-gray-900 hover:bg-gray-800">Share Schedule</Button>
            </div>
        </div>
    );
}