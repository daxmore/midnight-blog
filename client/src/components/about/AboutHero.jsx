"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Star, Sparkles, BookOpen, Users, Code } from "lucide-react"
import { Link } from "react-router-dom";

const AboutHero = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    const calculateTranslate = (x, y, strength = 0.02) => {
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        const moveX = (x - windowWidth / 2) * strength
        const moveY = (y - windowHeight / 2) * strength

        return { x: moveX, y: moveY }
    }

    return (
        <div className="relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-purple-500/5"
                        initial={{
                            width: Math.random() * 100 + 50,
                            height: Math.random() * 100 + 50,
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            opacity: 0.05 + Math.random() * 0.1,
                        }}
                        animate={{
                            y: [null, Math.random() * -200 - 100],
                            opacity: [null, 0],
                        }}
                        transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 10 + Math.random() * 20,
                            ease: "linear",
                            delay: Math.random() * 10,
                        }}
                    />
                ))}
            </div>

            {/* Hero Section */}
            <section className="relative max-sm:my-20 w-full h-screen">
                {/* Content Container */}
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-center h-full space-y-8">
                        {/* Floating elements */}
                        <motion.div
                            className="absolute top-20 right-20 text-purple-400/20"
                            style={{
                                transform: `translate(${calculateTranslate(mousePosition.x, mousePosition.y, 0.05).x}px, ${calculateTranslate(mousePosition.x, mousePosition.y, 0.05).y}px)`,
                            }}
                        >
                            <Sparkles size={80} />
                        </motion.div>
                        <motion.div
                            className="absolute bottom-20 left-20 text-purple-400/15"
                            style={{
                                transform: `translate(${calculateTranslate(mousePosition.x, mousePosition.y, 0.03).x}px, ${calculateTranslate(mousePosition.x, mousePosition.y, 0.03).y}px)`,
                            }}
                        >
                            <Star size={100} />
                        </motion.div>

                        {/* Title with animation */}
                        <motion.h1
                            className="text-4xl -tracking-tighter sm:tracking-normal md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white sm:leading-20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Welcome to Midnight Blog
                        </motion.h1>

                        {/* Mission Statement with animation */}
                        <motion.p
                            className="text-xl md:text-2xl text-gray-200 max-w-3xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            A student's journey through code. This is my personal blog where I share tutorials, projects, and my thoughts on web development.
                        </motion.p>

                        {/* Key Features with staggered animation */}
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300 mt-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            {[
                                {
                                    title: "Student's Perspective",
                                    description: "Sharing my journey as I learn and grow in the world of web development.",
                                    icon: <Users className="mb-2 text-purple-400" />,
                                },
                                {
                                    title: "Practical Tech Tutorials",
                                    description: "Step-by-step guides and tutorials on the technologies I'm using.",
                                    icon: <BookOpen className="mb-2 text-purple-500" />,
                                },
                                {
                                    title: "Open Source & Collaboration",
                                    description: "Exploring open-source projects and sharing my own code.",
                                    icon: <Code className="mb-2 text-purple-600" />,
                                },
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="p-4 rounded-xl backdrop-blur-sm bg-[#1f2937]/50 hover:bg-[#1f2937]/80 transition-all duration-300 border border-[#374151]"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                >
                                    {feature.icon}
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* CTA Button with animation */}
                        <motion.div
                            className="mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                        >
                            <Link to="/start-writing">
                                <motion.button
                                    className="group relative overflow-hidden bg-gradient-to-r from-purple-400 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="relative z-10 flex items-center">
                                        Start Writing
                                        <motion.span
                                            initial={{ x: 0 }}
                                            animate={{ x: 5 }}
                                            transition={{
                                                repeat: Number.POSITIVE_INFINITY,
                                                repeatType: "reverse",
                                                duration: 0.6,
                                            }}
                                        >
                                            <ChevronRight className="ml-1" />
                                        </motion.span>
                                    </span>
                                    <motion.span
                                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-600 z-0"
                                        initial={{ x: "100%" }}
                                        whileHover={{ x: 0 }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </motion.button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Blog Statistics Section with animations */}
            <section className="py-16 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        {[
                            { value: "1K+", label: "Monthly Readers" },
                            { value: "50+", label: "Published Articles" },
                            { value: "1", label: "Creator" },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-white p-6 rounded-xl backdrop-blur-sm bg-[#1f2937]/50 border border-[#374151]"
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 0 20px rgba(192, 132, 252, 0.2)",
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.div
                                    className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-400"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                                >
                                    {stat.value}
                                </motion.div>
                                <motion.div
                                    className="text-gray-400"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                                >
                                    {stat.label}
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default AboutHero;