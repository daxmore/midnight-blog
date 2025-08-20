import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, PlusCircle, Eye, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useBlog } from '../../context/BlogContext';

const BlogList = () => {
  const { blogs, loading } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await axios.delete(`/api/blogs/${blogId}`);
        // The blog context should refresh the blogs after deletion
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  // Filter and search logic
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          blog.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && blog.category === filter;
  });

  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(blogs.map(blog => blog.category))];

  return (
    <div className="bg-gray-900 rounded-xl shadow-xl overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">Blog Management</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
            
            <div className="relative">
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="pl-4 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none w-full sm:w-48"
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <Link to="/create-blog" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
              <PlusCircle className="h-5 w-5" />
              <span>New Post</span>
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6">
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <div key={blog._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-64 h-48 md:h-auto overflow-hidden">
                        <img 
                          src={blog.featuredImage} 
                          alt={blog.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-5 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full">
                                {blog.category}
                              </span>
                              {blog.featured && (
                                <span className="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded-full">
                                  Featured
                                </span>
                              )}
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">{blog.title}</h2>
                          </div>
                          <div className="flex space-x-2">
                            <Link to={`/blogs/${blog._id}`} className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                              <Eye className="h-5 w-5" />
                            </Link>
                            <Link to={`/edit-blog/${blog._id}`} className="p-2 text-gray-400 hover:text-yellow-400 transition-colors">
                              <Edit className="h-5 w-5" />
                            </Link>
                            <button 
                              onClick={() => handleDeleteBlog(blog._id)}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {blog.excerpt || blog.content.slice(0, 150) + '...'}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{new Date(blog.publishedDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{blog.readTime || '5'} min read</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold">By {blog.author.name || 'Admin'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-800 rounded-lg p-10 text-center text-gray-500">
                  No blogs found matching your search criteria
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
              <div>Showing {filteredBlogs.length} of {blogs.length} posts</div>
              <div className="flex space-x-1">
                <button className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700">Previous</button>
                <button className="px-3 py-1 rounded bg-blue-600 text-white">1</button>
                <button className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700">2</button>
                <button className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700">Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogList;