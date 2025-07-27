import React from "react";
import { Link } from "react-router-dom";

const RecentBlogs = () => {
    // Sample blog post data
    const blogPosts = [
        {
            id: 1,
            title: "The Future of Web Development in 2025",
            excerpt: "Exploring emerging technologies and frameworks that will shape how we build for the web.",
            category: "Development",
            date: "April 18, 2025",
            imageUrl: "https://cdn.dribbble.com/userupload/14912902/file/original-12c002c69215970cd2eaf4824b287a4f.png?resize=1504x1128&vertical=center",
            size: "large" // large featured post
        },
        {
            id: 2,
            title: "Mastering CSS Grid for Modern Layouts",
            excerpt: "A comprehensive guide to creating responsive layouts with CSS Grid.",
            category: "Design",
            date: "April 15, 2025",
            imageUrl: "https://cdn.dribbble.com/userupload/8810075/file/original-a320e71434adedbfea4703d2bd310fa6.png?resize=1504x1128&vertical=center",
            size: "medium" // medium post with image
        },
        {
            id: 3,
            title: "Building Accessible Web Applications",
            excerpt: "Best practices for ensuring your web applications are accessible to everyone.",
            category: "Accessibility",
            date: "April 12, 2025",
            color: "bg-indigo-100",
            textColor: "text-indigo-900",
            size: "small" // small text-only card
        },
        {
            id: 4,
            title: "Performance Optimization Techniques",
            excerpt: "Tips and tricks to make your website load faster and run smoother for better user experience.",
            category: "Performance",
            date: "April 8, 2025",
            imageUrl: "https://cdn.dribbble.com/userupload/22443335/file/original-a4655d92a0289b1d355dfa6576054719.png?resize=752x564&vertical=center",
            size: "tall" // tall image card
        },
        {
            id: 5,
            title: "Introduction to Serverless Architecture",
            excerpt: "Understanding the benefits and implementation of serverless architecture for modern applications.",
            category: "Backend",
            date: "April 5, 2025",
            color: "bg-amber-100",
            textColor: "text-amber-900",
            size: "small" // small text-only card
        }
    ];

    // Helper function to determine which component to render based on post size
    const renderPost = (post) => {
        switch (post.size) {
            case 'large':
                return (
                    <div key={post.id} className="col-span-12 md:col-span-8 row-span-2 rounded-3xl overflow-hidden shadow-md group transition duration-300 hover:shadow-xl">
                        <Link to={`/blog/${post.id}`} className="block h-full">
                            <div className="relative h-64 sm:h-96 md:h-full">
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                                    <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-medium mb-3">
                                        {post.category}
                                    </span>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{post.title}</h3>
                                    <p className="text-gray-200 mb-3 hidden sm:block">{post.excerpt}</p>
                                    <div className="flex items-center text-gray-300 text-sm">
                                        <span>{post.date}</span>
                                        <span className="mx-2">•</span>
                                        <span className="flex items-center">
                                            Read more
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                );

            case 'medium':
                return (
                    <div key={post.id} className="col-span-12 sm:col-span-6 md:col-span-4 rounded-3xl overflow-hidden shadow-md group transition duration-300 hover:shadow-xl bg-white">
                        <Link to={`/blog/${post.id}`} className="block h-full">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-5">
                                <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mb-3">
                                    {post.category}
                                </span>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">{post.date}</span>
                                    <span className="text-blue-600 font-medium flex items-center">
                                        Read
                                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                );

            case 'tall':
                return (
                    <div key={post.id} className="col-span-12 sm:col-span-6 md:col-span-4 row-span-2 rounded-3xl overflow-hidden shadow-md group transition duration-300 hover:shadow-xl">
                        <Link to={`/blog/${post.id}`} className="block h-full relative">
                            <div className="relative h-full">
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <span className="inline-block px-3 py-1 rounded-full bg-green-600 text-white text-xs font-medium mb-3">
                                        {post.category}
                                    </span>
                                    <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                                    <div className="flex items-center text-gray-300 text-sm">
                                        <span>{post.date}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                );

            case 'small':
                return (
                    <div key={post.id} className={`col-span-12 sm:col-span-6 md:col-span-4 rounded-3xl p-6 ${post.color || 'bg-gray-100'} ${post.textColor || 'text-gray-900'} shadow-md transition duration-300 hover:shadow-xl`}>
                        <Link to={`/blog/${post.id}`} className="block h-full">
                            <span className="text-sm font-medium opacity-80">{post.category}</span>
                            <h3 className="text-xl font-bold mt-2 mb-3">{post.title}</h3>
                            <p className="opacity-80 mb-6 text-sm">{post.excerpt}</p>
                            <div className="flex justify-between items-center text-sm">
                                <span className="opacity-70">{post.date}</span>
                                <span className="font-medium flex items-center">
                                    Read article
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold font-rubik text-white mb-2">Latest Articles</h2>
            <p className="text-gray-400 mb-8">Discover our newest insights and tutorials</p>

            <div className="grid grid-cols-12 gap-6 auto-rows-min">
                {blogPosts.map((post) => renderPost(post))}
            </div>
        </div>
    );
}

export default RecentBlogs;