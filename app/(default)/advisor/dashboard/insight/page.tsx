"use client";

import { useState, useEffect } from 'react';
import { Typography, Paper, CircularProgress, Card, CardContent, Box, TextField, InputAdornment, Button } from '@mui/material';
import Link from 'next/link';
import { Search as SearchIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

type Student = {
    id: string;
    name: string;
    email: string;
};

export default function AdvisorInsight() {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        setFilteredStudents(
            students.filter(student =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [students, searchTerm]);

    const fetchStudents = async () => {
        try {
            const response = await fetch('/api/students?userType=student');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setStudents(data);
                setFilteredStudents(data);
            } else {
                throw new Error('Invalid data format');
            }
        } catch (err) {
            setError(`Error fetching students: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setLoading(false);
        }
    };

    const startLiveSession = () => {
        const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        router.push(`/live-session/${sessionId}`);
    };

    return (
        <div className="p-6">
            <Paper elevation={3} className="p-6 mb-6">
                <Typography variant="h4" className="mb-4">Student List</Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : filteredStudents.length > 0 ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3, marginTop: 4 }}>
                        {filteredStudents.map((student) => (
                            <Link key={student.id} href={`/advisor/dashboard/insight/${student.id}`} passHref style={{ textDecoration: 'none' }}>
                                <Card elevation={2} sx={{
                                    transition: '0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
                                    }
                                }}>
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px' }}>
                                        <Typography variant="h6" component="div" align="center" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                            {student.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            {student.email}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </Box>
                ) : (
                    <Typography>No students found.</Typography>
                )}
                <Button
                    onClick={startLiveSession}
                    variant="contained"
                    sx={{
                        backgroundColor: '#111827',
                        '&:hover': { backgroundColor: '#374151' },
                        borderRadius: '9999px',
                        mb: 2
                    }}
                >
                    Start Live Session
                </Button>
            </Paper>
        </div>
    );
}