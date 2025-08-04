import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import CircularProgress from '../components/CircularProgress.jsx';
import { UserIcon, BookOpenIcon, ChartBarIcon, ClockIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function Profile() {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalBooks: 0,
    booksRead: 0,
    booksReading: 0,
    booksToRead: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/books');
      const books = res.data;
      
      // Calculate stats
      const totalBooks = books.length;
      const booksRead = books.filter(book => book.status === 'Read').length;
      const booksReading = books.filter(book => book.status === 'Reading').length;
      const booksToRead = books.filter(book => book.status === 'To Read').length;
      
      setStats({
        totalBooks,
        booksRead,
        booksReading,
        booksToRead,
      });
      
      // Get recent activity (last 5 books)
      const sortedBooks = [...books].sort((a, b) => 
        new Date(b.updatedAt) - new Date(a.updatedAt)
      ).slice(0, 5);
      
      setRecentActivity(sortedBooks);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess(false);
    
    try {
      // Mocked update - in a real app, you would call an API endpoint
      // await api.patch('/users/profile', profileData);
      
      // Simulate successful update
      setTimeout(() => {
        setUpdateSuccess(true);
        setIsEditing(false);
      }, 800);
    } catch (err) {
      setUpdateError('Failed to update profile. Please try again.');
    }
  };

  // Calculate reading completion percentage
  const completionPercentage = stats.totalBooks > 0 
    ? Math.round((stats.booksRead / stats.totalBooks) * 100) 
    : 0;

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white mb-2 drop-shadow-lg"
            >
              Your Profile
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-200"
            >
              Manage your account and view your reading stats
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - User Profile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-1"
            >
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Account Info</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>

                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-purple-900/50 border-2 border-purple-500/50 flex items-center justify-center">
                    <UserIcon className="h-12 w-12 text-white/70" />
                  </div>
                </div>

                {updateSuccess && (
                  <div className="bg-green-900/50 text-green-200 p-3 rounded-lg mb-4 text-sm border border-green-500/30 text-center">
                    Profile updated successfully!
                  </div>
                )}

                {updateError && (
                  <div className="bg-red-900/50 text-red-200 p-3 rounded-lg mb-4 text-sm border border-red-500/30 text-center">
                    {updateError}
                  </div>
                )}

                {isEditing ? (
                  <form onSubmit={handleProfileSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="form-input bg-white/10 text-white border-white/20 focus:border-purple-500 focus:ring focus:ring-purple-500/50 w-full"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="form-input bg-white/10 text-white border-white/20 focus:border-purple-500 focus:ring focus:ring-purple-500/50 w-full"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                    >
                      Save Changes
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm text-gray-400">Name</h3>
                      <p className="text-white">{profileData.name || 'Not set'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400">Email</h3>
                      <p className="text-white">{profileData.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400">Member Since</h3>
                      <p className="text-white">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Reading Progress */}
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Reading Progress</h2>
                <div className="flex justify-center">
                  <CircularProgress 
                    percentage={completionPercentage} 
                    label="Completion" 
                    size={150}
                    color="#9c27b0"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Column - Stats and Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2"
            >
              {/* Reading Stats */}
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5" />
                  Reading Stats
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard 
                    title="Total Books" 
                    value={stats.totalBooks} 
                    color="bg-purple-900/30 text-purple-200 border-purple-500/30" 
                    icon={<BookOpenIcon className="h-5 w-5" />}
                  />
                  <StatCard 
                    title="Completed" 
                    value={stats.booksRead} 
                    color="bg-emerald-900/30 text-emerald-200 border-emerald-500/30" 
                    icon={<BookOpenIcon className="h-5 w-5" />}
                  />
                  <StatCard 
                    title="Reading" 
                    value={stats.booksReading} 
                    color="bg-blue-900/30 text-blue-200 border-blue-500/30" 
                    icon={<BookOpenIcon className="h-5 w-5" />}
                  />
                  <StatCard 
                    title="To Read" 
                    value={stats.booksToRead} 
                    color="bg-pink-900/30 text-pink-200 border-pink-500/30" 
                    icon={<BookOpenIcon className="h-5 w-5" />}
                  />
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  Recent Activity
                </h2>
                
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-white/10 rounded-lg"></div>
                    ))}
                  </div>
                ) : recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map(book => (
                      <div 
                        key={book._id} 
                        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 bg-purple-900/30 rounded flex items-center justify-center">
                            <BookOpenIcon className="h-6 w-6 text-purple-300" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{book.title}</h3>
                            <p className="text-gray-400 text-sm">{book.author}</p>
                          </div>
                          <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium
                              ${book.status === 'Read' ? 'bg-emerald-900/50 text-emerald-200 border-emerald-500/50' : 
                                book.status === 'Reading' ? 'bg-purple-900/50 text-purple-200 border-purple-500/50' :
                                'bg-pink-900/50 text-pink-200 border-pink-500/50'} border border-current border-opacity-20`}>
                              {book.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No recent activity found.</p>
                    <p className="text-sm mt-1">Add some books to your library!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <div className={`p-4 rounded-lg ${color} flex flex-col items-center justify-center text-center`}>
      <div className="mb-2">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs opacity-80">{title}</p>
    </div>
  );
}
