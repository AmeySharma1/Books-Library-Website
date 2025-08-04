import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import api from '../services/api.js';
import Navbar from '../components/Navbar.jsx';
import BookCard from '../components/BookCard.jsx';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import CircularProgress from '../components/CircularProgress.jsx';

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/books');
      setBooks(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const deleteBook = async (id) => {
    try {
      await api.delete(`/books/${id}`);
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesFilter = filter === 'All' || book.status === filter;
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const bookStats = {
    total: books.length,
    toRead: books.filter(b => b.status === 'To Read').length,
    reading: books.filter(b => b.status === 'Reading').length,
    read: books.filter(b => b.status === 'Read').length
  };

  // Calculate completion percentage
  const completionPercentage = books.length > 0 
    ? Math.round((bookStats.read / books.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container py-8"
      >
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Your Digital Library
          </h1>
          <p className="text-gray-200 text-lg">
            Track your reading journey and discover new books
          </p>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Reading Progress */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="col-span-1 md:col-span-2 lg:col-span-1 bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 flex flex-col items-center"
          >
            <h3 className="text-white text-xl font-semibold mb-4">Reading Progress</h3>
            <CircularProgress 
              percentage={completionPercentage} 
              label="Completion" 
              size={180}
              color="#9c27b0"
            />
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <StatCard title="Total Books" value={bookStats.total} color="primary" />
            <StatCard title="To Read" value={bookStats.toRead} color="secondary" />
            <StatCard title="Reading" value={bookStats.reading} color="yellow" />
            <StatCard title="Completed" value={bookStats.read} color="green" />
          </motion.div>
        </div>

        {/* Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black/30 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/10"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input pl-10 w-full bg-white/10 text-white border-white/20 focus:border-purple-500 focus:ring focus:ring-purple-500/50"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="form-select w-full md:w-48 bg-white/10 text-white border-white/20 focus:border-purple-500 focus:ring focus:ring-purple-500/50"
            >
              <option value="All">All Books</option>
              <option value="To Read">To Read</option>
              <option value="Reading">Reading</option>
              <option value="Read">Read</option>
            </select>
          </div>
        </motion.div>

        {/* Books Grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="animate-pulse bg-black/30 backdrop-blur-md rounded-xl h-72 border border-white/10"
              ></motion.div>
            ))
          ) : filteredBooks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="col-span-full text-center py-12 bg-black/30 backdrop-blur-md rounded-xl border border-white/10"
            >
              <p className="text-white text-lg">No books found. Try adjusting your filters.</p>
            </motion.div>
          ) : (
            filteredBooks.map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <BookCard book={book} onDelete={deleteBook} />
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colorClasses = {
    primary: 'bg-purple-900/30 text-purple-200 border-purple-500/30',
    secondary: 'bg-pink-900/30 text-pink-200 border-pink-500/30',
    yellow: 'bg-amber-900/30 text-amber-200 border-amber-500/30',
    green: 'bg-emerald-900/30 text-emerald-200 border-emerald-500/30'
  };

  return (
    <div className={`card hover:scale-105 transition-transform duration-300 border ${colorClasses[color]} bg-black/30 backdrop-blur-md`}>
      <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2 text-white">{value}</p>
      <div className={`mt-2 inline-block px-2 py-1 rounded-full text-xs font-medium ${colorClasses[color]}`}>
        {title}
      </div>
    </div>
  );
}
