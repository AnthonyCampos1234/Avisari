import PageIllustration from "@/components/page-illustration";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

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

export default function HeroHome() {
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-16">
            <h1
              className="mb-6 border-y text-5xl font-bold [border-image:linear-gradient(to_right,transparent,#4ffbb4,#f14771,#23bbe9,transparent)1] md:text-6xl"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              AI-Powered Solutions for <br className="max-lg:hidden" />
              Higher Education
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-lg text-gray-700"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                Avisari revolutionizes university operations with Insight for college advising and Savior for student financial services.
              </p>
              <div className="relative before:absolute before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1]">
                <div
                  className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay={450}
                >
                  <a
                    className="btn group mb-4 w-full bg-gradient-to-t from-black to-gray-800 bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
                    href="#0"
                  >
                    <span className="relative inline-flex items-center">
                      <Link
                        href="/signup"
                        className="btn-sm bg-gray-800 text-gray-200 shadow hover:bg-gray-900"
                      >
                        Register
                      </Link>
                      <span className="ml-1 tracking-normal text-gray-300 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </a>
                  <a
                    className="btn w-full bg-white text-gray-800 shadow hover:bg-gray-50 sm:ml-4 sm:w-auto"
                    href="#0"
                  >
                    <Link
                      href="/signin"
                      className="btn-sm bg-white text-gray-800 shadow hover:bg-gray-50"
                    >
                      Login
                    </Link>
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Hero image */}
          <div
            className="mx-auto max-w-4xl"
            data-aos="zoom-y-out"
            data-aos-delay={600}
          >
            <div className="relative aspect-video rounded-2xl bg-white p-10 shadow-xl overflow-hidden">
              <div className={`absolute inset-0 flex flex-col h-full transition-opacity duration-1000 ${isAdvisorChat ? 'opacity-0' : 'opacity-100'}`}>
                <div className="mb-6 mt-4 text-gray-500 text-sm font-medium ml-4">Chat with AI Assistant</div>
                <div className="flex-grow overflow-y-auto space-y-4 px-4">
                  {chatSteps.map((step, index) => (
                    <ChatBubble key={index} type={step.type as 'student' | 'ai' | 'system'} isVisible={index <= currentStep}>
                      {step.message}
                    </ChatBubble>
                  ))}
                </div>
              </div>
              <div className={`absolute inset-0 flex flex-col h-full transition-opacity duration-1000 ${isAdvisorChat ? 'opacity-100' : 'opacity-0'}`}>
                <div className="mb-6 mt-4 text-gray-500 text-sm font-medium ml-4">Chat with Academic Advisor</div>
                <div className="flex-grow overflow-y-auto space-y-4 px-4">
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
      </div>
    </section>
  );
}
