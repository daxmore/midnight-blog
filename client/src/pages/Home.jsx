import React from 'react'
import Hero from '../components/common/Hero'
import Features from '../components/common/Features'
import RecentBlogs from '../components/common/RecentBlogs'
import LoginCTA from '../components/common/LoginCTA'

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
