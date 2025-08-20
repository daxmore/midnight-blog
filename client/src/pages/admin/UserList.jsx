import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, UserPlus, Filter } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { fas } from '@fortawesome/free-solid-svg-icons';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false); // New state for adding user
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user', // Default role for new users
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    // Fetch users from API
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // Password should not be pre-filled for security
      role: user.role,
    });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`/api/admin/users/${editingUser._id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;
      setUsers(users.map((user) => (user._id === editingUser._id ? data : user)));
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: '',
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleAddUserClick = () => {
    setAddingUser(true);
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user',
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/admin/users', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers([...users, res.data]);
      setAddingUser(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'user',
      });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Filter and search logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch;
    return matchesSearch && user.role === filter;
  });

  return (
    <div className="bg-gray-900 rounded-xl shadow-xl overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">User Management</h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
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
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none w-full sm:w-48"
              >
                <option value="all">All Users</option>
                <option value="admin">Admins</option>
                <option value="user">Regular Users</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>

            <button onClick={handleAddUserClick} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
              <UserPlus className="h-5 w-5" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 rounded-tl-lg">User</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3 rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="bg-gray-900 hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-4 flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-semibold mr-3">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-200">{user.username}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-400">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin'
                            ? 'bg-purple-900/30 text-purple-400'
                            : 'bg-blue-900/30 text-blue-400'
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            <button
                              className="text-gray-400 hover:text-blue-400"
                              onClick={() => handleEditClick(user)}
                            >
                              <Edit className="h-5 w-5" />
                            </button>

                            {user.role === 'user' && currentUser && currentUser.id !== user._id && (
                              <button
                                className="text-gray-400 hover:text-red-400"
                                onClick={() => handleDeleteUser(user._id)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                        No users found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {editingUser && (
              <div className="edit-form-container mt-6 p-6 bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-white mb-4">Edit User</h2>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2">Username:</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2">Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2">Password (leave blank to keep current):</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2">Role:</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex space-x-4">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Update User</button>
                    <button type="button" onClick={() => setEditingUser(null)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
              <div>Showing {filteredUsers.length} of {users.length} users</div>
              <div className="flex space-x-1">
                <button className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700">Previous</button>
                <button className="px-3 py-1 rounded bg-blue-600 text-white">1</button>
                <button className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700">2</button>
                <button className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700">Next</button>
              </div>
            </div>
          </>
        )}

        {addingUser && (
          <div className="add-form-container mt-6 p-6 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Add New User</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">Username:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">Role:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add User</button>
                <button type="button" onClick={() => setAddingUser(false)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div >
  );
};

export default UserList;