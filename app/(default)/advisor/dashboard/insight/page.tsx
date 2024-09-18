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
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setStudents(data);
            } else {
                throw new Error('Invalid data format');
            }
        } catch (err) {
            setError(`Error fetching students: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
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
                ) : students.length > 0 ? (
                    <List>
                        {students.map((student) => (
                            <ListItem key={student.id} className="mb-2">
                                <Link href={`/advisor/dashboard/insight/${student.id}`}>
                                    <Typography>{student.name}</Typography>
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No students found.</Typography>
                )}
            </Paper>
        </div>
    );
}