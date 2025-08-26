import React from 'react'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import RecentBlogs from '../components/home/RecentBlogs'
import LoginCTA from '../components/home/LoginCTA'

const Home = () => {
    return (
        <>
            <Hero />
            <Features />
            <RecentBlogs />
            <LoginCTA />
        </>
    )
}

export default Home
