"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Chip, IconButton, Paper } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import { RealtimeChannel } from '@supabase/supabase-js';

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

type Department = {
    name: string;
    courses: Course[];
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
    const { data: session } = useSession();
    const [schedule, setSchedule] = useState<Year[]>([]);
    const [loading, setLoading] = useState(false);
    const [availableCourses, setAvailableCourses] = useState<Department[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Course[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [supabaseChannel, setSupabaseChannel] = useState<RealtimeChannel | null>(null);

    useEffect(() => {
        if (session?.user?.email) {
            loadSchedule();
            loadAvailableCourses();
            const channel = subscribeToScheduleChanges();
            setSupabaseChannel(channel);
        }

        return () => {
            if (supabaseChannel) {
                supabaseChannel.unsubscribe();
            }
        };
    }, [session]);

    const loadSchedule = async () => {
        if (!session?.user?.email) return;

        try {
            const { data, error } = await supabase
                .from('students')
                .select('schedule')
                .eq('email', session.user.email)
                .single();

            if (error) throw error;

            setSchedule(data.schedule);
        } catch (error) {
            console.error('Load error:', error);
        }
    };

    const saveSchedule = async (newSchedule: Year[]) => {
        if (!session?.user?.email) return;

        try {
            const { error } = await supabase
                .from('students')
                .update({ schedule: newSchedule })
                .eq('email', session.user.email);

            if (error) throw error;

            // The update will be automatically pushed to all subscribers
        } catch (error) {
            console.error('Save error:', error);
        }
    };

    const subscribeToScheduleChanges = () => {
        if (!session?.user?.email) return null;

        const channel = supabase.channel('custom-all-channel')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'students',
                    filter: `email=eq.${session.user.email}`,
                },
                (payload) => {
                    setSchedule(payload.new.schedule);
                }
            )
            .subscribe();

        return channel;
    };

    const initializeEmptySchedule = (): Year[] => {
        const years = 4;
        const semestersPerYear = 4;
        return Array.from({ length: years }, (_, yearIndex) => ({
            year: yearIndex + 1,
            semesters: Array.from({ length: semestersPerYear }, (_, semesterIndex) => ({
                name: getSemesterName(semesterIndex),
                courses: []
            }))
        }));
    };

    const getSemesterName = (index: number) => {
        const semesterNames = ['Fall', 'Spring', 'Summer 1', 'Summer 2'];
        return semesterNames[index];
    };

    const onDragStart = () => {
        setIsDragging(true);
    };

    const onDragEnd = (result: DropResult) => {
        setIsDragging(false);
        const { source, destination } = result;

        // Create a copy of the current schedule
        const newSchedule = JSON.parse(JSON.stringify(schedule));

        // Parse the source IDs
        const [sourceYear, sourceSemester] = source.droppableId.split('-').map(Number);

        if (!destination || destination.droppableId === 'trash') {
            // The item was dropped on the trash or outside any droppable
            newSchedule[sourceYear].semesters[sourceSemester].courses.splice(source.index, 1);
            setSchedule(newSchedule);
            saveSchedule(newSchedule);

            // Trigger delete animation
            setIsDeleting(true);
            if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
            deleteTimeoutRef.current = setTimeout(() => setIsDeleting(false), 300);
            return;
        }

        // If the item is dropped in the same place, we don't need to do anything
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) return;

        // Parse the destination IDs
        const [destYear, destSemester] = destination.droppableId.split('-').map(Number);

        // Check if the destination semester already has 5 courses
        if (newSchedule[destYear].semesters[destSemester].courses.length >= 5) {
            // If it does, don't allow the drop
            return;
        }

        // Remove the course from the source
        const [movedCourse] = newSchedule[sourceYear].semesters[sourceSemester].courses.splice(source.index, 1);

        // Add the course to the destination
        newSchedule[destYear].semesters[destSemester].courses.splice(destination.index, 0, movedCourse);

        // Update the state and save to the database
        setSchedule(newSchedule);
        saveSchedule(newSchedule);
    };

    const handleGenerateAISchedule = async () => {
        setLoading(true);
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, body: ${rawResponse}`);
            }

            let parsedSchedule;
            try {
                const initialParse = JSON.parse(rawResponse);
                if (initialParse && initialParse.schedule) {
                    // Extract the JSON string from the backticks
                    const jsonMatch = initialParse.schedule.match(/```json\n([\s\S]*?)\n```/);
                    if (jsonMatch && jsonMatch[1]) {
                        parsedSchedule = JSON.parse(jsonMatch[1]);
                    } else {
                        throw new Error('Could not find valid JSON in the schedule');
                    }
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
            console.error('Failed to generate schedule:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadAvailableCourses = async () => {
        try {
            const response = await fetch('/courses.json');
            if (response.ok) {
                const data = await response.json();
                setAvailableCourses(data.departments);
            }
        } catch (error) {
            console.error('Failed to load available courses:', error);
        }
    };

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }

        const results = availableCourses.flatMap(dept =>
            dept.courses.filter(course =>
                course.code.toLowerCase().includes(query.toLowerCase()) ||
                course.title.toLowerCase().includes(query.toLowerCase()) ||
                course.description.toLowerCase().includes(query.toLowerCase())
            )
        );
        setSearchResults(results);
    }, [availableCourses]);

    const isCourseInSchedule = useCallback((course: Course) => {
        return schedule.some(year =>
            year.semesters.some(semester =>
                semester.courses.some(c => c.code === course.code)
            )
        );
    }, [schedule]);

    const toggleCourseSelection = (course: Course) => {
        if (isCourseInSchedule(course)) {
            // Don't allow selection if the course is already in the schedule
            return;
        }
        setSelectedCourses(prev =>
            prev.some(c => c.code === course.code)
                ? prev.filter(c => c.code !== course.code)
                : [...prev, course]
        );
    };

    const addSelectedCourses = () => {
        const newSchedule = [...schedule];
        const coursesToAdd = selectedCourses.filter(course => !isCourseInSchedule(course));

        let currentYearIndex = 0;
        let currentSemesterIndex = 0;

        while (coursesToAdd.length > 0) {
            const currentYear = newSchedule[currentYearIndex];
            const currentSemester = currentYear.semesters[currentSemesterIndex];

            const availableSlots = 5 - currentSemester.courses.length;
            const coursesToAddToThisSemester = coursesToAdd.splice(0, availableSlots);

            currentSemester.courses.push(...coursesToAddToThisSemester.map(course => ({
                ...course,
                id: `${course.code}-${Date.now()}`
            })));

            // Move to the next semester
            currentSemesterIndex++;
            if (currentSemesterIndex >= currentYear.semesters.length) {
                currentSemesterIndex = 0;
                currentYearIndex++;

                // If we've run out of years, we need to stop
                if (currentYearIndex >= newSchedule.length) {
                    break;
                }
            }
        }

        setSchedule(newSchedule);
        saveSchedule(newSchedule);
        setSelectedCourses([]);
        setSearchQuery('');
        setSearchResults([]);

        // If we couldn't add all courses, inform the user
        if (coursesToAdd.length > 0) {
            alert(`Could not add ${coursesToAdd.length} course(s) due to lack of space in the schedule.`);
        }
    };

    return (
        <div className="p-6 relative">
            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <Droppable droppableId="trash">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`
                                absolute top-4 left-1/2 transform -translate-x-1/2 p-4 
                                bg-black text-white rounded-full shadow-lg 
                                transition-all duration-300 ease-in-out
                                ${snapshot.isDraggingOver ? 'bg-gray-800' : ''}
                                ${isDeleting ? 'animate-wiggle' : ''}
                                ${isDragging ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                            `}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '80px',
                                height: '80px',
                            }}
                        >
                            {snapshot.isDraggingOver ? (
                                <DeleteIcon
                                    sx={{ fontSize: 40 }}
                                    className="animate-pulse"
                                />
                            ) : (
                                <DeleteOutlineIcon sx={{ fontSize: 40 }} />
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Insight</h1>

                        <div className="mb-6">
                            <Paper
                                elevation={0}
                                component="form"
                                sx={{
                                    p: '2px 4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '9999px',
                                }}
                            >
                                <div className="p-2">
                                    <Image
                                        src="/search-icon.svg"
                                        alt="Search"
                                        width={24}
                                        height={24}
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search for courses..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full p-2 outline-none"
                                    style={{ border: 'none', backgroundColor: 'transparent' }}
                                />
                                {searchQuery && (
                                    <IconButton
                                        type="button"
                                        sx={{ p: '10px' }}
                                        aria-label="clear"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSearchResults([]);
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                )}
                            </Paper>
                            {searchResults.length > 0 && (
                                <Paper elevation={3} sx={{ mt: 2, p: 2, borderRadius: '16px' }}>
                                    <h3 className="font-semibold mb-2">Search Results:</h3>
                                    {selectedCourses.length > 0 && (
                                        <Button
                                            onClick={addSelectedCourses}
                                            variant="contained"
                                            fullWidth
                                            sx={{
                                                backgroundColor: '#111827',
                                                '&:hover': { backgroundColor: '#374151' },
                                                borderRadius: '9999px',
                                                mb: 2
                                            }}
                                        >
                                            Add Selected Courses
                                        </Button>
                                    )}
                                    <div className="space-y-2">
                                        {searchResults.map((course) => (
                                            <div
                                                key={course.code}
                                                className={`
                                                    flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer
                                                    ${isCourseInSchedule(course)
                                                        ? 'bg-gray-100 cursor-not-allowed'
                                                        : selectedCourses.some(c => c.code === course.code)
                                                            ? 'bg-gray-200 hover:bg-gray-300'
                                                            : 'hover:bg-gray-50'
                                                    }
                                                `}
                                                onClick={() => !isCourseInSchedule(course) && toggleCourseSelection(course)}
                                            >
                                                <span>{course.code}: {course.title}</span>
                                                <Chip
                                                    label={isCourseInSchedule(course) ? "In Schedule" : selectedCourses.some(c => c.code === course.code) ? "Selected" : "Select"}
                                                    color={isCourseInSchedule(course) ? "default" : selectedCourses.some(c => c.code === course.code) ? "primary" : "default"}
                                                    sx={{
                                                        borderRadius: '9999px',
                                                        '& .MuiChip-label': { px: 2 },
                                                        bgcolor: isCourseInSchedule(course) ? '#e0e0e0' : selectedCourses.some(c => c.code === course.code) ? '#111827' : 'transparent',
                                                        color: isCourseInSchedule(course) ? '#757575' : selectedCourses.some(c => c.code === course.code) ? 'white' : 'inherit',
                                                        pointerEvents: 'none',
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </Paper>
                            )}
                        </div>
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
                        </div>
                        {schedule.map((year, yearIndex) => (
                            <div key={yearIndex} className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Year {year.year}</h2>
                                <div className="grid grid-cols-4 gap-4">
                                    {year.semesters.map((semester, semesterIndex) => (
                                        <Droppable droppableId={`${yearIndex}-${semesterIndex}`} key={semesterIndex}>
                                            {(provided) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className="p-4 bg-gray-50 rounded-lg"
                                                >
                                                    <h3 className="font-semibold text-lg text-gray-900 mb-3">{semester.name}</h3>
                                                    {semester.courses.length > 0 ? (
                                                        semester.courses.map((course: Course, index: number) => (
                                                            <Draggable key={course.id} draggableId={course.id} index={index}>
                                                                {(provided) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className="bg-white p-3 mb-2 rounded-md shadow-sm border border-gray-200 transition-all hover:shadow-md"
                                                                    >
                                                                        <span className="font-medium">{course.code}:</span> {course.title}
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
                    </div>
                </div>
            </DragDropContext>
            <style jsx global>{`
                @keyframes wiggle {
                    0%, 100% { transform: rotate(-10deg); }
                    50% { transform: rotate(10deg); }
                }
                .animate-wiggle {
                    animation: wiggle 0.3s ease-in-out;
                }
            `}</style>
        </div>
    );
}