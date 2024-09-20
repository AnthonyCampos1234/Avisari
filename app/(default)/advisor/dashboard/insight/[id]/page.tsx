"use client";

import { useState, useEffect } from 'react';
import { Typography, Paper, CircularProgress, Box, Button, Chip, IconButton } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useParams } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import RefreshIcon from '@mui/icons-material/Refresh';

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

type StudentDetails = {
    id: string;
    name: string;
    email: string;
    schedule: Year[] | null;
};

type Department = {
    name: string;
    courses: Course[];
};

export default function StudentDetails() {
    const [student, setStudent] = useState<StudentDetails | null>(null);
    const [schedule, setSchedule] = useState<Year[]>([]);
    const [loading, setLoading] = useState(true);
    const [availableCourses, setAvailableCourses] = useState<Department[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Course[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const params = useParams();
    const studentId = params.id as string;

    useEffect(() => {
        if (studentId) {
            fetchStudentDetails();
            loadAvailableCourses();
        } else {
            setError("Student ID is missing from the URL");
            setLoading(false);
        }
    }, [studentId]);

    const fetchStudentDetails = async () => {
        setLoading(true);
        setError(null); // Reset error state
        try {
            console.log('Fetching student details for ID:', studentId);

            // First, fetch the student's basic info from the 'users' table
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', studentId)
                .single();

            if (userError) {
                console.error('Error fetching user data:', userError);
                throw userError;
            }

            if (!userData) {
                console.error('No user data returned for student ID:', studentId);
                setError("No student found with the given ID");
                setStudent(null);
            } else {
                console.log('User data fetched:', userData);

                // Now fetch the student's schedule from the 'schedules' table
                const { data: scheduleData, error: scheduleError } = await supabase
                    .from('schedules')
                    .select('*')
                    .eq('user_email', userData.email)
                    .single();

                if (scheduleError && scheduleError.code !== 'PGRST116') {
                    console.error('Error fetching schedule data:', scheduleError);
                    throw scheduleError;
                }

                console.log('Schedule data fetched:', scheduleData);

                setStudent({
                    ...userData,
                    schedule: scheduleData ? scheduleData.data : null
                });

                if (scheduleData && scheduleData.data) {
                    setSchedule(scheduleData.data);
                } else {
                    console.log('No schedule data found, initializing empty schedule');
                    setSchedule(initializeEmptySchedule());
                }
            }
        } catch (err) {
            console.error('Error in fetchStudentDetails:', err);
            setError(`Error fetching student details: ${err instanceof Error ? err.message : String(err)}`);
            setStudent(null);
        } finally {
            setLoading(false);
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

    const getSemesterName = (index: number): string => {
        const semesterNames = ['Fall', 'Spring', 'Summer 1', 'Summer 2'];
        return semesterNames[index];
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

    const saveSchedule = async (newSchedule: Year[]) => {
        if (!student) return;

        try {
            const { error } = await supabase
                .from('schedules')
                .upsert({
                    user_email: student.email,
                    data: newSchedule
                }, {
                    onConflict: 'user_email'
                });

            if (error) throw error;

            setSchedule(newSchedule);
        } catch (error) {
            console.error('Save error:', error);
        }
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
            // If the item is dropped in the trash, remove it from the source
            newSchedule[sourceYear].semesters[sourceSemester].courses.splice(source.index, 1);
            setSchedule(newSchedule);
            saveSchedule(newSchedule);
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

    const handleSearch = (query: string) => {
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
    };

    const isCourseInSchedule = (course: Course) => {
        return schedule.some(year =>
            year.semesters.some(semester =>
                semester.courses.some(c => c.code === course.code)
            )
        );
    };

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

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchStudentDetails();
        setRefreshing(false);
    };

    if (error) return <Typography color="error">{error}</Typography>;
    if (loading) return <CircularProgress />;
    if (!student) return <Typography>No student found</Typography>;

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
                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Student Schedule</h1>
                            <div>
                                <div className="text-right mb-2">
                                    <Typography variant="h6">Name: {student?.name}</Typography>
                                    <Typography variant="body1">Email: {student?.email}</Typography>
                                </div>
                                <Button
                                    variant="outlined"
                                    startIcon={<RefreshIcon />}
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                >
                                    {refreshing ? 'Refreshing...' : 'Refresh Schedule'}
                                </Button>
                            </div>
                        </div>

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