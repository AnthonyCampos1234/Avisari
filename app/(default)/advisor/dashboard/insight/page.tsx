"use client";

import { useState, useEffect } from 'react';
import { Typography, Paper, CircularProgress, Card, CardContent, CardActionArea, Box } from '@mui/material';
import Link from 'next/link';
import { Person as PersonIcon } from '@mui/icons-material';

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
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {students.map((student) => (
                            <Box key={student.id} sx={{ flexBasis: { xs: '100%', sm: '45%', md: '30%', lg: '22%' } }}>
                                <Link href={`/advisor/dashboard/insight/${student.id}`} passHref>
                                    <Card component="a" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <CardActionArea>
                                            <CardContent className="flex flex-col items-center">
                                                <PersonIcon style={{ fontSize: 48, marginBottom: '8px' }} />
                                                <Typography variant="h6" component="div" align="center">
                                                    {student.name}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Link>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Typography>No students found.</Typography>
                )}
            </Paper>
        </div>
    );
}