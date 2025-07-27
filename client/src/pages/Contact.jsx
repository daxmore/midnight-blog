import React from 'react';
import ContactHero from '../components/common/ContactHero';
import ContactForm from '../components/common/ContactForm';
import ContactInformation from '../components/common/ContactInformation';
import FAQLink from '../components/common/FAQLink';

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