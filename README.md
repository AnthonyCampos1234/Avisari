<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Avisari - University Advising and Student Success Platform</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 font-sans">
    <header class="bg-blue-600 text-white p-6">
        <div class="container mx-auto">
            <h1 class="text-4xl font-bold">Avisari</h1>
            <p class="mt-2">University Advising and Student Success Platform</p>
        </div>
    </header>

    <main class="container mx-auto mt-8 p-4">
        <section id="hero" class="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 class="text-3xl font-semibold mb-4">Welcome to Avisari</h2>
            <p class="text-lg mb-4">Revolutionizing university operations with a focus on college advising and student financial services.</p>
            <a href="#" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">Get Started</a>
        </section>

        <section id="features" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-xl font-semibold mb-2">Student-Advisor Connection</h3>
                <p>Seamless communication between students and academic advisors.</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-xl font-semibold mb-2">Course Selection Assistance</h3>
                <p>Make informed decisions about your academic path.</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-xl font-semibold mb-2">Financial Services Integration</h3>
                <p>Tools for managing student financial services.</p>
            </div>
        </section>

        <section id="login" class="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 class="text-2xl font-semibold mb-4">Sign In</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 class="text-xl font-semibold mb-2">Advisor</h3>
                    <p>Email: newUser123@gmail.com</p>
                    <p>Password: 123123123</p>
                </div>
                <div>
                    <h3 class="text-xl font-semibold mb-2">Student</h3>
                    <p>Email: newUser321@gmail.com</p>
                    <p>Password: 123123123</p>
                </div>
            </div>
            <p class="mt-4">Feel free to register as a student or an advisor!</p>
        </section>

        <section id="tech-stack" class="bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-semibold mb-4">Technology Stack</h2>
            <ul class="list-disc pl-6">
                <li>Frontend: Next.js with React and TypeScript</li>
                <li>Styling: Tailwind CSS</li>
                <li>Backend: Supabase</li>
                <li>Authentication: Next-Auth</li>
                <li>Hosting: Netlify</li>
                <li>Real-time Features: Socket.io</li>
            </ul>
        </section>
    </main>

    <footer class="bg-gray-800 text-white p-6 mt-8">
        <div class="container mx-auto text-center">
            <p>Built with ❤️ by the Avisari team (Anthony Campos)</p>
            <a href="https://www.avisari.com" class="text-blue-300 hover:underline">Visit Avisari.com</a>
        </div>
    </footer>
</body>
</html>
