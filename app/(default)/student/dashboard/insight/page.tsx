"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

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
    const [error, setError] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string | null>(null);
    const [availableCourses, setAvailableCourses] = useState<Department[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Course[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
    const [visibleError, setVisibleError] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.email) {
            loadSchedule();
            loadAvailableCourses();
        }
    }, [session]);

    const loadSchedule = async () => {
        if (!session?.user?.email) return;

        try {
            setDebugInfo('Loading schedule...');
            const { data, error } = await supabase
                .from('schedules')
                .select('data')
                .eq('user_email', session.user.email)
                .single();

            if (error) throw error;

            if (data && data.data) {
                setSchedule(data.data);
                setDebugInfo('Schedule loaded successfully');
            } else {
                const initialSchedule = initializeEmptySchedule();
                setSchedule(initialSchedule);
                await saveSchedule(initialSchedule);
                setDebugInfo('Initialized empty schedule');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            setVisibleError(`Failed to load schedule: ${errorMessage}`);
            setDebugInfo(`Load error: ${errorMessage}`);
            const initialSchedule = initializeEmptySchedule();
            setSchedule(initialSchedule);
            await saveSchedule(initialSchedule);
        }
    };

    const saveSchedule = async (newSchedule: Year[]) => {
        if (!session?.user?.email) {
            setVisibleError('No user email found in session');
            return;
        }

        try {
            setDebugInfo('Saving schedule...');
            const { data, error } = await supabase
                .from('schedules')
                .upsert({
                    user_email: session.user.email,
                    data: newSchedule
                }, {
                    onConflict: 'user_email'
                });

            if (error) throw error;

            setDebugInfo(`Schedule saved successfully: ${JSON.stringify(data)}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            setVisibleError(`Failed to save schedule: ${errorMessage}`);
            setDebugInfo(`Save error: ${errorMessage}`);
        }
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

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) {
            // The item was dropped outside the list
            if (result.reason === 'DROP') {
                // The item was dropped on the trash can
                const newSchedule = [...schedule];
                const [sourceYear, sourceSemester] = source.droppableId.split('-').map(Number);
                newSchedule[sourceYear].semesters[sourceSemester].courses.splice(source.index, 1);
                setSchedule(newSchedule);
                saveSchedule(newSchedule);
            }
            return;
        }

        // If the item is dropped in the same place, we don't need to do anything
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) return;

        // Create a copy of the current schedule
        const newSchedule = JSON.parse(JSON.stringify(schedule));

        // Parse the source and destination IDs
        const [sourceYear, sourceSemester] = source.droppableId.split('-').map(Number);
        const [destYear, destSemester] = destination.droppableId.split('-').map(Number);

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

    const toggleCourseSelection = (course: Course) => {
        setSelectedCourses(prev =>
            prev.some(c => c.code === course.code)
                ? prev.filter(c => c.code !== course.code)
                : [...prev, course]
        );
    };

    const addSelectedCourses = () => {
        const newSchedule = [...schedule];
        const firstYear = newSchedule[0];
        const firstSemester = firstYear.semesters[0];
        firstSemester.courses.push(...selectedCourses.map(course => ({
            ...course,
            id: `${course.code}-${Date.now()}`
        })));
        setSchedule(newSchedule);
        saveSchedule(newSchedule);
        setSelectedCourses([]);
        setSearchQuery('');
        setSearchResults([]);
    };

    const showCurrentSchedule = () => {
        setDebugInfo(`Current schedule: ${JSON.stringify(schedule)}`);
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Insight</h1>

                    {visibleError && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {visibleError}
                        </div>
                    )}

                    <div className="mb-4">
                        <button
                            onClick={showCurrentSchedule}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Show Current Schedule
                        </button>
                    </div>

                    {debugInfo && (
                        <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded">
                            <pre>{debugInfo}</pre>
                        </div>
                    )}

                    <div className="mb-6">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                            <SearchIcon className="ml-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for courses..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full p-2 outline-none"
                            />
                        </div>
                        {searchResults.length > 0 && (
                            <div className="mt-4 border rounded-lg p-4">
                                <h3 className="font-semibold mb-2">Search Results:</h3>
                                <ul>
                                    {searchResults.map((course) => (
                                        <li key={course.code} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedCourses.some(c => c.code === course.code)}
                                                onChange={() => toggleCourseSelection(course)}
                                                className="mr-2"
                                            />
                                            <span>{course.code}: {course.title}</span>
                                        </li>
                                    ))}
                                </ul>
                                {selectedCourses.length > 0 && (
                                    <Button
                                        onClick={addSelectedCourses}
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#111827',
                                            '&:hover': { backgroundColor: '#374151' },
                                            borderRadius: '9999px',
                                            mt: 2
                                        }}
                                    >
                                        Add Selected Courses
                                    </Button>
                                )}
                            </div>
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
                        <Droppable droppableId="trash">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="fixed bottom-4 right-4 p-4 bg-red-500 text-white rounded-full shadow-lg"
                                >
                                    <DeleteIcon fontSize="large" />
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        </div>
    );
}