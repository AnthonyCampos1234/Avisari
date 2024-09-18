"use client";

import { useState, useEffect } from 'react';
import { List, ListItem, Typography, Paper, CircularProgress } from '@mui/material';
import Link from 'next/link';

type Student = {
    id: string;
    name: string;
};

export default function AdvisorInsight() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await fetch('/api/students?userType=student');
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            const data = await response.json();
            setStudents(data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching students');
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <Paper className="p-6 mb-6">
                <Typography variant="h4" className="mb-4">Student List</Typography>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <List>
                        {students.map((student) => (
                            <ListItem key={student.id} className="mb-2">
                                <Link href={`/advisor/dashboard/insight/${student.id}`}>
                                    <Typography>{student.name}</Typography>
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>
        </div>
    );
}