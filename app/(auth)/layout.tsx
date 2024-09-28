"use client";

import Image from "next/image";
import Logo from "@/public/images/logo-01.svg";
import PageIllustration from "@/components/page-illustration";
import { Box, Container, Paper, Typography } from '@mui/material';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f0f4f8',
      }}
    >
      <PageIllustration />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          elevation={6}
          sx={{
            my: { xs: 3, md: 6 },
            p: { xs: 2, md: 3 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(to right, #4ffbb4, #f14771, #23bbe9)',
            }}
          />
          <Box sx={{ my: 2 }}>
            <Image src={Logo} alt="Avisari Solutions Logo" width={100} height={100} />
          </Box>
          <Typography component="h1" variant="h4" gutterBottom>
            Avisari Solutions
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Simplifying complexity, one university at a time
          </Typography>
          {children}
        </Paper>
      </Container>
    </Box>
  );
}