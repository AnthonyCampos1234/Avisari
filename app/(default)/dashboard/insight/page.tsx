"use client";

import { useState, useEffect } from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Insight() {
    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-semibold">Insight</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ClassInputInterface />
                <AIGeneratedSchedule />
                <ScheduleCustomization />
                <AIAssistedModification />
                <AdvisorInteraction />
                <ProgressTracking />
                <CourseInformation />
                <ExportAndSharing />
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
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Add Completed Course</h2>
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
                <Button type="submit" variant="contained" color="primary">
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
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">AI-Generated Schedule</h2>
            {schedule.map((semester: any, index: number) => (
                <div key={index} className="mb-4">
                    <h3 className="font-semibold">Semester {index + 1}</h3>
                    <ul>
                        {semester.courses.map((course: any, courseIndex: number) => (
                            <li key={courseIndex}>{course.code}: {course.name}</li>
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
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Customize Your Schedule</h2>
            <DragDropContext onDragEnd={onDragEnd}>
                {semesters.map((semester: any, semesterIndex: number) => (
                    <Droppable droppableId={`semester-${semesterIndex}`} key={semesterIndex}>
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="mb-4"
                            >
                                <h3 className="font-semibold">Semester {semesterIndex + 1}</h3>
                                {semester.courses.map((course: any, index: number) => (
                                    <Draggable key={course.id} draggableId={course.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-gray-100 p-2 mb-2 rounded"
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
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">AI-Assisted Modification</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <TextField
                    label="Ask AI for schedule modifications"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                />
                <Button type="submit" variant="contained" color="primary" className="mt-2">
                    Submit
                </Button>
            </form>
            {aiResponse && (
                <div className="bg-gray-100 p-3 rounded">
                    <h3 className="font-semibold mb-2">AI Response:</h3>
                    <p>{aiResponse}</p>
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
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Advisor Interaction</h2>
            <div className="h-64 overflow-y-auto mb-4 border rounded p-2">
                {messages.map((message: Message, index: number) => (
                    <div key={index} className={`mb-2 ${message.sender === 'student' ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded ${message.sender === 'student' ? 'bg-blue-100' : 'bg-gray-100'}`}>
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
                <Button type="submit" variant="contained" color="primary" className="ml-2">
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
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Progress Tracking</h2>
            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                            Progress
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                            {progress}%
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                </div>
            </div>
        </div>
    );
}

function CourseInformation() {
    const [selectedCourse, setSelectedCourse] = useState<any>(null);

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Course Information</h2>
            {selectedCourse ? (
                <div>
                    <h3 className="font-semibold mb-2">{selectedCourse.code}: {selectedCourse.name}</h3>
                    <p className="mb-2">{selectedCourse.description}</p>
                    <a href={selectedCourse.syllabus} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Syllabus</a>
                </div>
            ) : (
                <p>Select a course to view its information.</p>
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
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Export and Sharing</h2>
            <div className="space-x-2">
                <Button onClick={() => handleExport('pdf')} variant="outlined">Export as PDF</Button>
                <Button onClick={() => handleExport('ical')} variant="outlined">Export as iCal</Button>
                <Button onClick={handleShare} variant="contained" color="primary">Share Schedule</Button>
            </div>
        </div>
    );
}