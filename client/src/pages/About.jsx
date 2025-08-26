import React from 'react';
import AboutHero from '../components/about/AboutHero';
import AuthorDetails from '../components/about/AuthorDetails';
import TimelineComponent from '../components/about/TimelineComponent';
import ContactCTA from '../components/contact/ContactCTA';
import FAQSection from '../components/about/FAQSection';

const About = () => {
    return (
        <>
            <AboutHero />
            <AuthorDetails />
            <TimelineComponent />
            <ContactCTA />
            <FAQSection />
        </>
    );
};

export default About;