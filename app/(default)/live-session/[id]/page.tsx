"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useSocket } from '@/app/contexts/SocketContext';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Typography, Paper, CircularProgress, Button } from '@mui/material';

// Define types
type Course = {
    id: string;
    code: string;
    title: string;
    credits: number;
    description: string;
    prerequisites?: string[];
    corequisites?: string[];
    attributes?: string[];
};

type Semester = {
    name: string;
    courses: Course[];
};

type Year = {
    year: number;
    semesters: Semester[];
};

export default function LiveSession() {
    const { id: sessionId } = useParams();
    const { data: session } = useSession();
    const { socket, joinRoom, leaveRoom } = useSocket();
    const [schedule, setSchedule] = useState<Year[]>([]);
    const [loading, setLoading] = useState(true);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (sessionId && socket) {
            joinRoom(sessionId as string);
            loadSchedule();

            return () => {
                leaveRoom(sessionId as string);
            };
        }
    }, [sessionId, socket, joinRoom, leaveRoom]);

    useEffect(() => {
        if (socket) {
            socket.on('schedule-updated', (updatedSchedule) => {
                setSchedule(updatedSchedule);
            });

            socket.on('cursor-updated', (cursor) => {
                setCursorPosition(cursor);
            });

            return () => {
                socket.off('schedule-updated');
                socket.off('cursor-updated');
            };
        }
    }, [socket]);

    const loadSchedule = async () => {
        // Implement loadSchedule logic similar to the existing insight page
        // For now, let's set a dummy schedule
        setSchedule([
            {
                year: 1,
                semesters: [
                    { name: 'Fall', courses: [] },
                    { name: 'Spring', courses: [] },
                ]
            }
        ]);
        setLoading(false);
    };

    const saveSchedule = async (newSchedule: Year[]) => {
        // Implement saveSchedule logic similar to the existing insight page
        if (socket) {
            socket.emit('update-schedule', { roomId: sessionId, schedule: newSchedule });
        }
    };

    const onDragEnd = (result: DropResult) => {
        // Implement onDragEnd logic similar to the existing insight page
        // For now, let's just log the result
        console.log(result);
        // Don't forget to call saveSchedule at the end
        // saveSchedule(updatedSchedule);
    };

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const cursor = { x: e.clientX, y: e.clientY };
        if (socket) {
            socket.emit('update-cursor', { roomId: sessionId, cursor });
        }
    }, [socket, sessionId]);

    if (loading) return <CircularProgress />;

    return (
        <div className="p-6 relative" onMouseMove={handleMouseMove}>
            <Typography variant="h4" className="mb-4">Live Collaboration Session</Typography>
            <DragDropContext onDragEnd={onDragEnd}>
                {schedule.map((year, yearIndex) => (
                    <div key={yearIndex}>
                        <Typography variant="h5">Year {year.year}</Typography>
                        {year.semesters.map((semester, semesterIndex) => (
                            <Droppable droppableId={`${yearIndex}-${semesterIndex}`} key={semesterIndex}>
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        <Typography variant="h6">{semester.name}</Typography>
                                        {semester.courses.map((course, index) => (
                                            <Draggable key={course.id} draggableId={course.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <Paper elevation={2} className="p-2 mb-2">
                                                            {course.code}: {course.title}
                                                        </Paper>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                ))}
            </DragDropContext>
            <div
                className="absolute w-4 h-4 bg-red-500 rounded-full pointer-events-none"
                style={{ left: cursorPosition.x, top: cursorPosition.y }}
            />
        </div>
    );
}