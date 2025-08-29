import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios

import BlogHeader from '../components/blog/BlogHeader';
import BlogContent from '../components/blog/BlogContent';
import AuthorBioCard from '../components/blog/AuthorBioCard';

import NewsletterCTA from "../components/home/NewsletterCTA";
import { useBlog } from '../context/BlogContext';
import ErrorPage from './ErrorPage';

// Internal DocumentHead component to avoid import issues
const DocumentHead = ({ title, description, image, author, date, category, id }) => {
    useEffect(() => {
        // Update page title
        if (title) {
            document.title = title;
        }

        // Update or create meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription && description) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        if (metaDescription && description) {
            metaDescription.setAttribute('content', description);
        }

        // Set canonical URL for this post
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', `${window.location.origin}/blogs/${id}`);

        // Add keywords for better SEO
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', `${category || ''}, blog, midnight blog, ${title.split(' ').join(', ')}`);

        // Handle Open Graph tags
        const ogTags = {
            'og:title': title,
            'og:description': description,
            'og:image': image,
            'og:type': 'article',
            'og:url': window.location.href,
            'og:site_name': 'Midnight Blog',
            'article:published_time': date,
            'article:section': category
        };

        // Create or update Open Graph tags
        Object.entries(ogTags).forEach(([property, content]) => {
            if (!content) return;

            let metaTag = document.querySelector(`meta[property="${property}"]`);
            if (!metaTag) {
                metaTag = document.createElement('meta');
                metaTag.setAttribute('property', property);
                document.head.appendChild(metaTag);
            }
            metaTag.setAttribute('content', content);
        });

        // Add professional profiles metadata
        const profiles = {
            'linkedin:profile': 'https://linkedin.com/in/yourusername',
            'github:profile': 'https://github.com/yourusername'
        };

        // Create or update professional profile tags
        Object.entries(profiles).forEach(([name, content]) => {
            let metaTag = document.querySelector(`meta[name="${name}"]`);
            if (!metaTag) {
                metaTag = document.createElement('meta');
                metaTag.setAttribute('name', name);
                document.head.appendChild(metaTag);
            }
            metaTag.setAttribute('content', content);
        });

        // Add schema.org structured data for the article
        let schemaScript = document.querySelector('#blog-schema');
        if (schemaScript) {
            document.head.removeChild(schemaScript);
        }

        schemaScript = document.createElement('script');
        schemaScript.setAttribute('id', 'blog-schema');
        schemaScript.setAttribute('type', 'application/ld+json');

        const schemaData = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": description,
            "image": image,
            "datePublished": date,
            "author": {
                "@type": "Person",
                "name": author
            },
            "publisher": {
                "@type": "Organization",
                "name": "Midnight Blog",
                "logo": {
                    "@type": "ImageObject",
                    "url": `${window.location.origin}/logo.png`
                },
                "sameAs": [
                    "https://linkedin.com/in/yourusername",
                    "https://github.com/yourusername"
                ]
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `${window.location.origin}/blogs/${id}`
            }
        };

        schemaScript.textContent = JSON.stringify(schemaData);
        document.head.appendChild(schemaScript);

    }, [title, description, image, author, date, category, id]);

    return null; // This component doesn't render anything
};

const BlogDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null); // State to store the fetched blog
    const [loading, setLoading] = useState(true); // Local loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchBlogDetails = async () => {
            if (!id) {
                setError('Blog ID is missing.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const res = await axios.get(`/api/blogs/${id}`); // Fetch directly from backend
                setBlog(res.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching blog details:', err);
                setError('Blog not found or an error occurred.');
                setBlog(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetails();
    }, [id]); // Re-fetch when ID changes

    // Show loading spinner
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    // Show error page if blog not found or error occurred
    if (error || !blog) {
        console.error("Blog post not found or ID is missing/invalid.");
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Blog Not Found</h1>
                <p className="text-gray-400 mb-6">{error || "The blog post you're looking for doesn't exist."}</p>
                <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                    Go Back to Home
                </button>
            </div>
        );
    }

    // Ensure the blog post has all required fields
    const safeBlog = {
        id: blog._id, // Use _id from fetched blog
        title: blog.title || 'Untitled Blog Post',
        content: blog.content || '<p>No content available</p>',
        image: blog.featuredImage || '/images/default-blog.jpg', // Use a local default image
        date: blog.publishedAt || new Date().toLocaleDateString(), // Use publishedAt
        author: blog.author || 'Anonymous',
        readTime: blog.readTime || '5 min read',
        excerpt: blog.excerpt || 'Blog post details',
        category: blog.category || 'Blog'
    };

    try {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-dark-background text-white min-h-screen"
            >
                <DocumentHead
                    title={`${safeBlog.title} | Midnight Blog`}
                    description={safeBlog.excerpt}
                    image={safeBlog.image}
                    author={safeBlog.author}
                    date={safeBlog.date}
                    category={safeBlog.category}
                    slug={safeBlog.slug}
                />

                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    <BlogHeader
                        title={safeBlog.title}
                        featuredImage={safeBlog.image}
                        author={safeBlog.author}
                        date={safeBlog.date}
                        readTime={safeBlog.readTime}
                    />

                    <div className="grid md:grid-cols-[1fr_auto] gap-8 mt-12">
                        <div>
                            <BlogContent content={safeBlog.content} />

                            <AuthorBioCard
                                author={safeBlog.author}
                            />
                        </div>
                    </div>

                    <NewsletterCTA />
                </div>
            </motion.div>
        );
    } catch (error) {
        console.error('Error rendering blog details page:', error);
        return <ErrorPage errorCode="500" errorMessage="Error Loading Blog" />;
    }
};

export default BlogDetailsPage;
