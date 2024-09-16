"use client";

import React, { useState, useEffect } from 'react';
import Logo from "@/components/ui/logo";
import PageIllustration from "@/components/page-illustration";

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

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <section className="relative">
      <PageIllustration />
      <div className="flex min-h-screen">
        {/* Left side - Hero section and Sign in form */}
        <div className="flex-1 flex flex-col">
          <header className="py-4">
            <div className="container mx-auto">
              <Logo />
            </div>
          </header>

          <div className="flex-grow flex flex-col justify-center px-4 sm:px-6">
            <div className="pb-12 pt-32 md:pt-40 text-center">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
                AI-Powered Solutions for Higher Education
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Nota Solutions revolutionizes university operations with Insight for college advising and Savior for student financial services.
              </p>
            </div>

            {/* Sign in form */}
            <div className="max-w-sm mx-auto w-full bg-white shadow-lg rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Sign in to your account</h2>
              {children}
            </div>
          </div>
        </div>

        {/* Right side - Chat demonstration */}
        <div className="hidden lg:flex flex-1 bg-blue-50 items-center justify-center p-8">
          <div className="w-full max-w-2xl aspect-video bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className={`h-full flex flex-col transition-opacity duration-1000 ${isAdvisorChat ? 'opacity-0' : 'opacity-100'}`}>
              <div className="bg-gray-100 p-4 text-sm font-medium">Chat with AI Assistant</div>
              <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {chatSteps.map((step, index) => (
                  <ChatBubble key={index} type={step.type as 'student' | 'ai' | 'system'} isVisible={index <= currentStep}>
                    {step.message}
                  </ChatBubble>
                ))}
              </div>
            </div>
            <div className={`absolute inset-0 h-full flex flex-col transition-opacity duration-1000 ${isAdvisorChat ? 'opacity-100' : 'opacity-0'}`}>
              <div className="bg-gray-100 p-4 text-sm font-medium">Chat with Academic Advisor</div>
              <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {advisorChat.map((step, index) => (
                  <ChatBubble key={index} type={step.type as 'advisor' | 'student'} isVisible={index <= currentStep}>
                    {step.message}
                  </ChatBubble>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}