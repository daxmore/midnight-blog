import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

import BlogHeader from '../components/blog/BlogHeader';
import BlogContent from '../components/blog/BlogContent';
import ShareButtons from '../components/blog/ShareButtons';
import AuthorBioCard from '../components/blog/AuthorBioCard';
import CommentSection from '../components/blog/CommentSection';
import NewsletterCTA from '../components/common/NewsletterCTA';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import ErrorPage from './ErrorPage';

// Internal DocumentHead component to avoid import issues
const DocumentHead = ({ title, description, image, author, date, category, slug }) => {
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
        canonicalLink.setAttribute('href', `${window.location.origin}/blogs/${slug}`);

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
                "@id": `${window.location.origin}/blogs/${slug}`
            }
        };
        
        schemaScript.textContent = JSON.stringify(schemaData);
        document.head.appendChild(schemaScript);
        
    }, [title, description, image, author, date, category, slug]);

    return null; // This component doesn't render anything
};

const BlogDetailsPage = () => {
    const params = useParams();
    const slug = params.slug;
    const navigate = useNavigate();
    const { getBlogById, loading, blogs } = useBlog();

    console.log('BlogDetailsPage - params:', params);
    console.log('BlogDetailsPage - slug:', slug);
    console.log('BlogDetailsPage - All blogs:', blogs);
    
    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
        </div>;
    }

    if (!slug) {
        console.error('No slug parameter found in URL');
        return <ErrorPage errorCode="400" errorMessage="Missing Blog Identifier" />;
    }

    const fetchedBlogPost = getBlogById(slug);
    console.log('BlogDetailsPage - Fetched blog:', fetchedBlogPost);

    if (!fetchedBlogPost) {
        console.error(`Blog post with ID or slug "${slug}" not found.`);
        return <ErrorPage errorCode="404" errorMessage="Blog Post Not Found" />;
    }

    // Ensure the blog post has all required fields
    const safeBlog = {
        id: fetchedBlogPost.id,
        title: fetchedBlogPost.title || 'Untitled Blog Post',
        content: fetchedBlogPost.content || '<p>No content available</p>',
        image: fetchedBlogPost.image || null,
        date: fetchedBlogPost.date || new Date().toLocaleDateString(),
        slug: fetchedBlogPost.slug || slug,
        author: fetchedBlogPost.author || 'Anonymous',
        readTime: fetchedBlogPost.readTime || '5 min read',
        comments: fetchedBlogPost.comments || [],
        excerpt: fetchedBlogPost.excerpt || 'Blog post details',
        category: fetchedBlogPost.category || 'Blog'
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
                            <ShareButtons
                                title={safeBlog.title}
                                url={`/blogs/${safeBlog.slug}`}
                            />

                            <BlogContent content={safeBlog.content} />

                            <AuthorBioCard
                                author={safeBlog.author}
                            />
                        </div>
                    </div>

                    <CommentSection
                        postId={safeBlog.id}
                        comments={safeBlog.comments}
                    />

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
