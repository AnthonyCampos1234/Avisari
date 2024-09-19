"use client";

import { useState, useEffect } from 'react';
import { Typography, Paper, CircularProgress, Box } from '@mui/material';
import { useParams } from 'next/navigation';

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
    schedule: Year[];
};

export default function StudentDetails() {
    const [student, setStudent] = useState<StudentDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const studentId = params.id as string;

    useEffect(() => {
        if (studentId) {
            fetchStudentDetails();
        } else {
            setError("Student ID is missing from the URL");
            setLoading(false);
        }
    }, [studentId]);

    const fetchStudentDetails = async () => {
        try {
            const response = await fetch(`/api/students/${studentId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch student details');
            }
            const data = await response.json();
            setStudent(data);
            setLoading(false);
        } catch (err) {
            setError(`Error fetching student details: ${err instanceof Error ? err.message : String(err)}`);
            setLoading(false);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!student) return <Typography>No student found</Typography>;

    return (
        <div className="p-6">
            <Paper className="p-6 mb-6">
                <Typography variant="h4" className="mb-4">Student Details</Typography>
                <Box mb={4}>
                    <Typography variant="h6" className="mb-2">Name</Typography>
                    <Typography variant="body1" className="mb-2">{student.name}</Typography>
                    <Typography variant="h6" className="mb-2">Email</Typography>
                    <Typography variant="body1">{student.email}</Typography>
                </Box>
                <Typography variant="h6" className="mt-4">Schedule</Typography>
                {student.schedule.map((year, yearIndex) => (
                    <div key={yearIndex} className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Year {year.year}</h2>
                        <div className="grid grid-cols-4 gap-4">
                            {year.semesters.map((semester, semesterIndex) => (
                                <div key={semesterIndex} className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-3">{semester.name}</h3>
                                    {semester.courses.length > 0 ? (
                                        semester.courses.map((course: Course, index: number) => (
                                            <div key={course.id} className="bg-white p-3 mb-2 rounded-md shadow-sm border border-gray-200 transition-all hover:shadow-md">
                                                <span className="font-medium">{course.code}:</span> {course.title}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 italic">No courses added yet</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </Paper>
        </div>
    );
}