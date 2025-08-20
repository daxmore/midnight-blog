import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Users, FileText, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBlog } from '../../context/BlogContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { blogs } = useBlog();
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    recentViews: 0,
    trendingCategories: []
  });
  
  // Simulate fetching dashboard statistics
  useEffect(() => {
    // In a real application, you would fetch this data from your API
    const fetchStats = async () => {
      // Simulating API call
      setTimeout(() => {
        setStats({
          totalPosts: blogs.length || 42,
          totalUsers: 157,
          recentViews: 1238,
          trendingCategories: [
            { name: 'Technology', count: 24 },
            { name: 'Travel', count: 18 },
            { name: 'Food', count: 15 },
            { name: 'Lifestyle', count: 12 }
          ]
        });
      }, 500);
    };
    
    fetchStats();
  }, [blogs]);

  const statCards = [
    { 
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'bg-blue-500'
    },
    { 
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500'
    },
    { 
      title: 'Recent Views',
      value: stats.recentViews,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    { 
      title: 'Active Now',
      value: Math.floor(Math.random() * 50),
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Admin Dashboard</h1>
        <div className="bg-gray-800 px-4 py-2 rounded-lg">
          <p className="text-gray-300">
            Welcome back, <span className="font-semibold text-white">{currentUser?.name || 'Admin'}</span>
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                <h2 className="text-3xl font-bold">{stat.value}</h2>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity and Trending Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2" size={20} />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="border-b border-gray-700 pb-3 last:border-0">
                <p className="text-gray-300">
                  New post published: <span className="font-medium text-white">Understanding React Hooks</span>
                </p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart2 className="mr-2" size={20} />
            Trending Categories
          </h2>
          <div className="space-y-4">
            {stats.trendingCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300">{category.name}</span>
                <div className="flex items-center">
                  <div className="w-36 bg-gray-700 rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(category.count / 30) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-400">{category.count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gray-800 rounded-lg p-6 shadow-lg mt-6"
      >
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {['Create New Post', 'Manage Users', 'View Analytics', 'Settings'].map((action, index) => (
            <button
              key={index}
              className="bg-gray-700 hover:bg-gray-600 transition-colors p-4 rounded-lg text-center"
            >
              {action}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;