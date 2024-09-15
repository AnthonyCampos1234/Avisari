"use client";

import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import PlanetImg from "@/public/images/planet.png";
import PlanetOverlayImg from "@/public/images/planet-overlay.svg";

export default function Dashboard() {
    const { session, status } = useAuth(true);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <section className="relative">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="pb-12 pt-32 md:pb-20 md:pt-40">
                    <div className="text-center">
                        <h1 className="mb-6 border-y text-5xl font-bold [border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1] md:text-6xl">
                            Welcome to Your Dashboard
                        </h1>
                        <p className="mb-8 text-lg text-gray-700">
                            Hello, {session?.user?.name}! Here's an overview of your account.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Stats Card */}
                        <div className="rounded-lg bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-xl font-semibold">Your Stats</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Total Courses</p>
                                    <p className="text-2xl font-bold text-blue-600">12</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Completed</p>
                                    <p className="text-2xl font-bold text-green-600">8</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Card */}
                        <div className="rounded-lg bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
                            <ul className="space-y-2">
                                <li className="text-sm text-gray-600">Completed Python Course</li>
                                <li className="text-sm text-gray-600">Started JavaScript Basics</li>
                                <li className="text-sm text-gray-600">Submitted Project: ToDo App</li>
                            </ul>
                        </div>

                        {/* Upcoming Deadlines Card */}
                        <div className="rounded-lg bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-xl font-semibold">Upcoming Deadlines</h2>
                            <ul className="space-y-2">
                                <li className="text-sm text-gray-600">React Project (2 days left)</li>
                                <li className="text-sm text-gray-600">Database Quiz (5 days left)</li>
                                <li className="text-sm text-gray-600">Final Exam (2 weeks left)</li>
                            </ul>
                        </div>
                    </div>

                    {/* Planet Illustration (similar to home page) */}
                    <div className="mt-12 text-center" data-aos="zoom-y-out">
                        <div className="relative inline-flex rounded-full">
                            <div className="animate-[pulse_4s_cubic-bezier(.4,0,.6,1)_infinite] absolute inset-0 rounded-full bg-blue-500 opacity-75 blur-xl"></div>
                            <Image
                                className="relative rounded-full"
                                src={PlanetImg}
                                width={300}
                                height={300}
                                alt="Dashboard Planet"
                            />
                            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                                <Image
                                    className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
                                    src={PlanetOverlayImg}
                                    width={500}
                                    height={500}
                                    alt="Planet decoration"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}