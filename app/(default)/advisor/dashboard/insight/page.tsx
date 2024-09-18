"use client";

import { useState, useEffect } from 'react';
import { Button, TextField, List, ListItem, ListItemText, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

type Course = {
    id: string;
    code: string;
    name: string;
    credits: number;
};

type Semester = {
    name: string;
    courses: Course[];
};

type Year = {
    year: number;
    semesters: Semester[];
};

type Student = {
    id: string;
    name: string;
    email: string;
    schedule: Year[];
};

export default function AdvisorInsight() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/advisor/students');
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            const data = await response.json();
            setStudents(data);
        } catch (err) {
            setError('Failed to load students. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <Paper className="p-6 mb-6">
                <Typography variant="h4" className="mb-4">Advisor Insight</Typography>
                <TextField
                    fullWidth
                    label="Search Students"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4"
                />
                {loading ? (
                    <Typography>Loading students...</Typography>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <List>
                        {filteredStudents.map((student) => (
                            <ListItem key={student.id} className="mb-4">
                                <Paper className="p-4 w-full">
                                    <Typography variant="h6">{student.name}</Typography>
                                    <Typography variant="body2" className="mb-2">{student.email}</Typography>
                                    <Typography variant="subtitle1" className="mt-2">Schedule:</Typography>
                                    {student.schedule.map((year) => (
                                        <div key={year.year} className="ml-4 mt-2">
                                            <Typography variant="subtitle2">Year {year.year}</Typography>
                                            {year.semesters.map((semester) => (
                                                <div key={semester.name} className="ml-4">
                                                    <Typography variant="body2">{semester.name}:</Typography>
                                                    <List dense>
                                                        {semester.courses.map((course) => (
                                                            <ListItem key={course.id}>
                                                                <ListItemText
                                                                    primary={`${course.code}: ${course.name}`}
                                                                    secondary={`Credits: ${course.credits}`}
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </Paper>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>
        </div>
    );
}