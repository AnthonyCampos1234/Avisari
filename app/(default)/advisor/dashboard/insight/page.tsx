"use client";

import { useState, useEffect } from 'react';
import { Typography, Paper, CircularProgress, Card, CardContent, Box, TextField, InputAdornment, Button } from '@mui/material';
import Link from 'next/link';
import { Search as SearchIcon, Videocam as VideocamIcon } from '@mui/icons-material';

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

    return (
        <div className="p-6">
            <Paper elevation={3} className="p-6 mb-6">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h4">Student List</Typography>
                    <Button
                        variant="contained"
                        startIcon={<VideocamIcon />}
                        sx={{
                            backgroundColor: '#4CAF50',
                            '&:hover': {
                                backgroundColor: '#45a049',
                            },
                        }}
                    >
                        Join Live
                    </Button>
                </Box>
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
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
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
            </Paper>
        </div>
    );
}