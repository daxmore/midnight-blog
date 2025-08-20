import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Layout, ChevronLeft, Users, FileText, BarChart2, LogOut 
} from 'lucide-react';

const AdminLayout = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#000000] to-[#1f2937] text-gray-300">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-900 text-gray-300 md:min-h-screen p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gradient">Admin Panel</h2>
            <Layout className="h-6 w-6 md:hidden" />
          </div>

          <nav>
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to="/admin/dashboard" 
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-blue-900/30 text-blue-400' 
                        : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                    }`
                  }
                >
                  <BarChart2 className="mr-3 h-5 w-5" />
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/users" 
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-blue-900/30 text-blue-400' 
                        : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                    }`
                  }
                >
                  <Users className="mr-3 h-5 w-5" />
                  <span>Users</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/blogs" 
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-blue-900/30 text-blue-400' 
                        : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                    }`
                  }
                >
                  <FileText className="mr-3 h-5 w-5" />
                  <span>Blog Posts</span>
                </NavLink>
              </li>
            </ul>

            <div className="mt-10 pt-6 border-t border-gray-700">
              <button 
                onClick={handleLogout} 
                className="flex items-center w-full p-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-all"
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              <NavLink 
                to="/" 
                className="text-sm flex items-center text-blue-400 hover:text-blue-300"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Site
              </NavLink>
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;