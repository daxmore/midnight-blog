import React from 'react';
import ContactHero from '../components/contact/ContactHero';
import ContactForm from '../components/contact/ContactForm';
import ContactInformation from '../components/contact/ContactInformation';
import FAQLink from '../components/contact/FAQLink';

const Contact = () => {
    return (
        <>
            <div className="text-white">
                <ContactHero />
                <ContactForm />
                <ContactInformation />
                <FAQLink />
            </div>
        </>
    );
};

export default Contact;