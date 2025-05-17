import React from 'react';
import AboutHero from '../components/common/AboutHero';
import AuthorDetails from '../components/common/AuthorDetails';
import TimelineComponent from '../components/common/TimelineComponent';
import ContactCTA from '../components/common/ContactCTA';
import FAQSection from '../components/common/FAQSection';

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