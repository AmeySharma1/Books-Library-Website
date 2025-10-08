import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import api from '../services/api.js';
import { BookOpenIcon, ArrowUpTrayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    status: 'To Read',
  });
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const res = await api.get(`/books/${id}`);
      const book = res.data;
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre || '',
        status: book.status,
      });
      if (book.coverImage) {
        setPreviewUrl(book.coverImage.startsWith('http') 
          ? book.coverImage 
          : `${import.meta.env.VITE_API_URL}${book.coverImage}`);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load book details. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (coverImage) {
        data.append('coverImage', coverImage);
      }

      await api.put(`/books/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update book. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const statusOptions = [
    { value: 'To Read', label: 'To Read', icon: BookOpenIcon, color: 'bg-pink-900/50 text-pink-200 border-pink-500/50' },
    { value: 'Reading', label: 'Currently Reading', icon: BookOpenIcon, color: 'bg-purple-900/50 text-purple-200 border-purple-500/50' },
    { value: 'Read', label: 'Completed', icon: CheckCircleIcon, color: 'bg-emerald-900/50 text-emerald-200 border-emerald-500/50' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <Navbar />
        <div className="container py-8 flex justify-center items-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white mb-2 drop-shadow-lg"
            >
              Edit Book
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-200"
            >
              Update your book details
            </motion.p>
          </div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/30 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/10"
          >
            {error && (
              <div className="bg-red-900/50 text-red-200 p-4 rounded-lg mb-6 text-sm border border-red-500/30">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-900/50 text-green-200 p-4 rounded-lg mb-6 flex items-center gap-2 border border-green-500/30">
                <CheckCircleIcon className="h-5 w-5" />
                <span>Book updated successfully! Redirecting...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Book Details */}
                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                      Book Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="form-input bg-white/10 text-white border-white/20 focus:border-purple-500 focus:ring focus:ring-purple-500/50 w-full"
                      placeholder="Enter book title"
                    />
                  </div>

                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-1">
                      Author <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      required
                      className="form-input bg-white/10 text-white border-white/20 focus:border-purple-500 focus:ring focus:ring-purple-500/50 w-full"
                      placeholder="Enter author name"
                    />
                  </div>

                  <div>
                    <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-1">
                      Genre
                    </label>
                    <input
                      type="text"
                      id="genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      className="form-input bg-white/10 text-white border-white/20 focus:border-purple-500 focus:ring focus:ring-purple-500/50 w-full"
                      placeholder="Fiction, Non-fiction, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                      Reading Status
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                      {statusOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = formData.status === option.value;
                        
                        return (
                          <label 
                            key={option.value}
                            className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all duration-200 ${option.color} ${isSelected ? 'ring-2 ring-offset-1 ring-offset-black' : 'opacity-70'}`}
                          >
                            <input 
                              type="radio" 
                              name="status" 
                              value={option.value} 
                              checked={formData.status === option.value}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <Icon className="h-5 w-5" />
                            <span>{option.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column - Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cover Image
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg h-[300px] flex flex-col items-center justify-center overflow-hidden relative">
                    {previewUrl ? (
                      <div className="w-full h-full relative group">
                        <img 
                          src={previewUrl} 
                          alt="Cover preview" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setCoverImage(null);
                              setPreviewUrl('');
                            }}
                            className="bg-red-500/80 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center hover:bg-white/5 transition-colors">
                        <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mb-2" />
                        <span className="text-gray-300">Click to upload cover image</span>
                        <span className="text-gray-400 text-sm mt-1">JPG, PNG or GIF</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center"
                >
                  {saving ? (
                    <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
