"use client";

import { useState, useEffect } from 'react';
import { Typography, Paper, CircularProgress } from '@mui/material';
import { useParams } from 'next/navigation';

type StudentDetails = {
    id: string;
    name: string;
    email: string;
    // Add other relevant fields
};

export default function StudentDetails() {
    const [student, setStudent] = useState<StudentDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const studentId = params.id as string;

    useEffect(() => {
        fetchStudentDetails();
    }, [studentId]);

    const fetchStudentDetails = async () => {
        try {
            const response = await fetch(`/api/students/${studentId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch student details');
            }
            const data = await response.json();
            setStudent(data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching student details');
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
                <Typography variant="h6">{student.name}</Typography>
                <Typography>{student.email}</Typography>
                {/* Add more student details here */}
            </Paper>
        </div>
    );
}