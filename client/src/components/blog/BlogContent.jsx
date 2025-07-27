import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const BlogContent = ({ content }) => {
    const contentRef = useRef(null);
    const fadeInVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Add heading IDs for better navigation and SEO
    useEffect(() => {
        if (contentRef.current) {
            const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headings.forEach((heading) => {
                if (!heading.id) {
                    // Create slug from heading text
                    const id = heading.textContent
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                    heading.id = id;
                }
            });
        }
    }, [content]);

    // Handle string content
    if (typeof content === 'string') {
        return (
            <motion.div
                ref={contentRef}
                initial="hidden"
                animate="visible"
                variants={fadeInVariants}
                transition={{ duration: 0.6 }}
                className="prose prose-invert prose-lg max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ __html: content }}
                itemScope
                itemType="https://schema.org/Article"
                itemProp="articleBody"
            />
        );
    }

    // Handle array content (for backward compatibility)
    return (
        <motion.div
            ref={contentRef}
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            transition={{ duration: 0.6 }}
            className="prose prose-invert prose-lg max-w-none text-gray-300"
            itemScope
            itemType="https://schema.org/Article"
            itemProp="articleBody"
        >
            {Array.isArray(content) && content.map((section, index) => (
                <Section key={index} content={section} />
            ))}
        </motion.div>
    );
};

const Section = ({ content }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            role="region"
        >
            {/* Render different content types: paragraph, headers, code blocks, etc. */}
            {content}
        </motion.div>
    );
};

export default BlogContent;
