"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { SignIn } from "@clerk/nextjs";

// import { Footer } from "@/components/ui/footer"; // Assuming you create a footer component

const LandingPage = () => {
    const [open, setOpen] = useState(false)
    return (
        <div className="bg-white text-black">
            {/* Hero Section */}
            <section className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-center py-16">
                <h1 className="text-5xl font-bold leading-tight mb-4">
                    Welcome to the Future of Site Monitoring
                </h1>
                <p className="text-lg mb-8 max-w-2xl mx-auto">
                    Monitor your websites in real-time with powerful analytics and seamless uptime checks. Stay on top of your site's health effortlessly.
                </p>
                <Button onClick={e => setOpen(true)} className="bg-teal-700 hover:bg-teal-800 text-white text-lg py-3 px-6 rounded-md">
                    Get Started
                </Button>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                        Features That Make Monitoring Easy
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Real-Time Monitoring</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Stay updated with real-time data about your site's performance and health. Get your website monitored everyday at 5:00 AM UST.
                                </CardDescription>
                            </CardContent>
                        </Card>
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Detailed Analytics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Dive deep into historical data and view detailed analytics to improve your uptime. Get alert over email if website is down
                                </CardDescription>
                            </CardContent>
                        </Card>
                        
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-center">
                <h2 className="text-3xl font-semibold mb-6">Start Monitoring Today</h2>
                <p className="text-lg mb-8 max-w-2xl mx-auto">
                    Don't wait until your website goes down. Take control of your site's performance now.
                </p>
                <Button onClick={e => setOpen(true)} className="bg-white text-teal-600 hover:bg-gray-200 text-lg py-3 px-6 rounded-md">
                    Try It For Free
                </Button>
            </section>

            {/* Footer */}
            {/* <Footer /> */}

            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger>Open</DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Welcome to SitesPlus Sign in Below</DrawerTitle>
                        {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
                    </DrawerHeader>
                    <DrawerFooter>
                        <div className="flex justify-center items-center p-10">

                            <SignIn routing="hash" />
                        </div>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default LandingPage;
