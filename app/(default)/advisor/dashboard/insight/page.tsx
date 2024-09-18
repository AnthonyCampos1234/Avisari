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

// Mock data
const mockStudents: Student[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        schedule: [
            {
                year: 1,
                semesters: [
                    {
                        name: "Fall",
                        courses: [
                            { id: "CS101", code: "CS101", name: "Introduction to Programming", credits: 3 },
                            { id: "MATH101", code: "MATH101", name: "Calculus I", credits: 4 },
                        ]
                    },
                    {
                        name: "Spring",
                        courses: [
                            { id: "CS102", code: "CS102", name: "Data Structures", credits: 3 },
                            { id: "PHYS101", code: "PHYS101", name: "Physics I", credits: 4 },
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        schedule: [
            {
                year: 1,
                semesters: [
                    {
                        name: "Fall",
                        courses: [
                            { id: "BIO101", code: "BIO101", name: "Biology I", credits: 4 },
                            { id: "CHEM101", code: "CHEM101", name: "Chemistry I", credits: 4 },
                        ]
                    },
                    {
                        name: "Spring",
                        courses: [
                            { id: "BIO102", code: "BIO102", name: "Biology II", credits: 4 },
                            { id: "PSYCH101", code: "PSYCH101", name: "Introduction to Psychology", credits: 3 },
                        ]
                    }
                ]
            }
        ]
    }
];

export default function AdvisorInsight() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Simulate API call with mock data
        setTimeout(() => {
            setStudents(mockStudents);
            setLoading(false);
        }, 1000);
    }, []);

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