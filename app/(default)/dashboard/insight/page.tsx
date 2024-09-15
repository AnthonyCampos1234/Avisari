"use client";

import { useState, useEffect } from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Insight() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="mb-8 text-4xl font-bold text-gray-900">Insight</h1>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <AIGeneratedSchedule />
                    <ScheduleCustomization />
                </div>
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <ClassInputInterface />
                    <AIAssistedModification />
                    <AdvisorInteraction />
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-4">
                    <ProgressTracking />
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-4">
                    <CourseInformation />
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <ExportAndSharing />
                </div>
            </div>
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
        <div className="bg-white p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Add Completed Course</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Autocomplete
                    options={[]} // This should be populated with course codes
                    renderInput={(params) => <TextField {...params} label="Course Code" />}
                    onInputChange={(_, newValue) => setCourseCode(newValue)}
                />
                <TextField
                    label="Course Name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Credits"
                    type="number"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Semester Taken"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    fullWidth
                />
                <Button type="submit" variant="contained" className="bg-gray-900 hover:bg-gray-800">
                    Add Course
                </Button>
            </form>
        </div>
    );
}

function AIGeneratedSchedule() {
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        // Fetch AI-generated schedule from backend
        fetchAISchedule();
    }, []);

    const fetchAISchedule = async () => {
        // API call to get AI-generated schedule
        // This is a placeholder and should be replaced with actual API call
        const response = await fetch('/api/generate-schedule');
        const data = await response.json();
        setSchedule(data);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">AI-Generated Schedule</h2>
            {schedule.map((semester: any, index: number) => (
                <div key={index} className="mb-4">
                    <h3 className="font-semibold text-gray-900">Semester {index + 1}</h3>
                    <ul>
                        {semester.courses.map((course: any, courseIndex: number) => (
                            <li key={courseIndex} className="text-gray-900">{course.code}: {course.name}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

function ScheduleCustomization() {
    const [semesters, setSemesters] = useState([]);

    const onDragEnd = (result: any) => {
        // Implement drag and drop logic here
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Customize Your Schedule</h2>
            <DragDropContext onDragEnd={onDragEnd}>
                {semesters.map((semester: any, semesterIndex: number) => (
                    <Droppable droppableId={`semester-${semesterIndex}`} key={semesterIndex}>
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="mb-4"
                            >
                                <h3 className="font-semibold text-gray-900">Semester {semesterIndex + 1}</h3>
                                {semester.courses.map((course: any, index: number) => (
                                    <Draggable key={course.id} draggableId={course.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-gray-100 p-2 mb-2 rounded text-gray-900"
                                            >
                                                {course.code}: {course.name}
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
        <div className="bg-white p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">AI-Assisted Modification</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <TextField
                    label="Ask AI for schedule modifications"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                />
                <Button type="submit" variant="contained" className="mt-2 bg-gray-900 hover:bg-gray-800">
                    Submit
                </Button>
            </form>
            {aiResponse && (
                <div className="bg-gray-100 p-3 rounded">
                    <h3 className="font-semibold mb-2 text-gray-900">AI Response:</h3>
                    <p className="text-gray-900">{aiResponse}</p>
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
        <div className="bg-white p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100">
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
        <div className="bg-white p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100">
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

function CourseInformation() {
    const [selectedCourse, setSelectedCourse] = useState<any>(null);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Course Information</h2>
            {selectedCourse ? (
                <div>
                    <h3 className="font-semibold mb-2 text-gray-900">{selectedCourse.code}: {selectedCourse.name}</h3>
                    <p className="mb-2 text-gray-900">{selectedCourse.description}</p>
                    <a href={selectedCourse.syllabus} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">View Syllabus</a>
                </div>
            ) : (
                <p className="text-gray-900">Select a course to view its information.</p>
            )}
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
        <div className="bg-white p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Export and Sharing</h2>
            <div className="space-x-2">
                <Button onClick={() => handleExport('pdf')} variant="outlined" className="text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white">Export as PDF</Button>
                <Button onClick={() => handleExport('ical')} variant="outlined" className="text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white">Export as iCal</Button>
                <Button onClick={handleShare} variant="contained" className="bg-gray-900 hover:bg-gray-800">Share Schedule</Button>
            </div>
        </div>
    );
}