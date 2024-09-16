import React, { useState, useEffect } from 'react'
import Link from 'next/link'

type ChatBubbleProps = {
    type: 'student' | 'ai' | 'advisor' | 'system';
    children: React.ReactNode;
    isVisible: boolean;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ type, children, isVisible }) => {
    const bubbleClasses = {
        student: 'bg-blue-100 text-blue-800 ml-auto',
        ai: 'bg-gray-100 text-gray-800',
        advisor: 'bg-green-100 text-green-800',
        system: 'bg-yellow-100 text-yellow-800 text-center italic',
    };

    return (
        <div className={`rounded-lg p-3 max-w-[80%] ${bubbleClasses[type]} transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {children}
        </div>
    );
};

export default function SignUp() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [currentStep, setCurrentStep] = useState(0);
    const [isAdvisorChat, setIsAdvisorChat] = useState(false);

    const chatSteps = [
        { type: 'student', message: "Hello, I need help with my course selection." },
        { type: 'ai', message: "Of course! I'd be happy to help. What are your interests and current major?" },
        { type: 'student', message: "I'm interested in computer science, but I'm not sure which courses to take next semester." },
        { type: 'ai', message: "Based on your interests, I recommend considering courses in algorithms, data structures, and software engineering. However, for more personalized advice, I suggest speaking with an academic advisor." },
        { type: 'system', message: "Connecting you with an advisor..." },
    ];

    const advisorChat = [
        { type: 'advisor', message: "Hi there! I'm your academic advisor. I see you're interested in computer science courses. Let's discuss your academic goals and create a plan that aligns with your interests and degree requirements." },
        { type: 'student', message: "Thank you! I'd love to discuss my options for next semester." },
        { type: 'advisor', message: "Great! Let's start by reviewing your current progress and then we can explore some course options that will help you meet your goals." },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            if (!isAdvisorChat && currentStep < chatSteps.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else if (!isAdvisorChat && currentStep === chatSteps.length - 1) {
                setIsAdvisorChat(true);
                setCurrentStep(0);
            } else if (isAdvisorChat && currentStep < advisorChat.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                setIsAdvisorChat(false);
                setCurrentStep(0);
            }
        }, 3000);

        return () => clearInterval(timer);
    }, [currentStep, isAdvisorChat]);

    return (
        <div className="max-w-sm mx-auto">
            {/* Chat Animation */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 h-64 overflow-hidden">
                <div className={`h-full transition-opacity duration-1000 ${isAdvisorChat ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="h-full overflow-y-auto space-y-4">
                        {chatSteps.map((step, index) => (
                            <ChatBubble key={index} type={step.type as 'student' | 'ai' | 'system'} isVisible={index <= currentStep}>
                                {step.message}
                            </ChatBubble>
                        ))}
                    </div>
                </div>
                <div className={`h-full transition-opacity duration-1000 ${isAdvisorChat ? 'opacity-100' : 'opacity-0'}`} style={{ marginTop: '-256px' }}>
                    <div className="h-full overflow-y-auto space-y-4">
                        {advisorChat.map((step, index) => (
                            <ChatBubble key={index} type={step.type as 'student' | 'advisor'} isVisible={index <= currentStep}>
                                {step.message}
                            </ChatBubble>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form */}
            <form>
                <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                        <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="name">Name <span className="text-red-600">*</span></label>
                        <input id="name" type="text" className="form-input w-full text-gray-800" placeholder="Enter your name" required value={name} onChange={e => setName(e.target.value)} />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                        <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="email">Email <span className="text-red-600">*</span></label>
                        <input id="email" type="email" className="form-input w-full text-gray-800" placeholder="Enter your email address" required value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                        <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="password">Password <span className="text-red-600">*</span></label>
                        <input id="password" type="password" className="form-input w-full text-gray-800" placeholder="Enter your password" required value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mt-6">
                    <div className="w-full px-3">
                        <button className="btn text-white bg-blue-600 hover:bg-blue-700 w-full">Sign up</button>
                    </div>
                </div>
                <div className="text-sm text-gray-500 text-center mt-3">
                    By creating an account, you agree to the <a className="underline" href="#0">terms & conditions</a>, and our <a className="underline" href="#0">privacy policy</a>.
                </div>
            </form>
            <div className="text-gray-600 text-center mt-6">
                Already using Nota? <Link href="/signin" className="text-blue-600 hover:underline transition duration-150 ease-in-out">Sign in</Link>
            </div>
        </div>
    )
}