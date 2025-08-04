import { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';

// Fallback examples to show when page loads
const sampleBooks = [
  {
    key: 'SAMPLE1',
    title: 'Pride and Prejudice',
    author_name: ['Jane Austen'],
    first_publish_year: 1813,
    cover_i: 8231856,
  },
  {
    key: 'SAMPLE2',
    title: '1984',
    author_name: ['George Orwell'],
    first_publish_year: 1949,
    cover_i: 7222246,
  },
  {
    key: 'SAMPLE3',
    title: 'The Hobbit',
    author_name: ['J.R.R. Tolkien'],
    first_publish_year: 1937,
    cover_i: 6979861,
  },
  {
    key: 'SAMPLE4',
    title: 'To Kill a Mockingbird',
    author_name: ['Harper Lee'],
    first_publish_year: 1960,
    cover_i: 8228691,
  },
  {
    key: 'SAMPLE5',
    title: 'The Great Gatsby',
    author_name: ['F. Scott Fitzgerald'],
    first_publish_year: 1925,
    cover_i: 6517441,
  },
  {
    key: 'SAMPLE6',
    title: 'Moby Dick',
    author_name: ['Herman Melville'],
    first_publish_year: 1851,
    cover_i: 5552196,
  },
  {
    key: 'SAMPLE7',
    title: 'War and Peace',
    author_name: ['Leo Tolstoy'],
    first_publish_year: 1869,
    cover_i: 8233270,
  },
  {
    key: 'SAMPLE8',
    title: 'The Catcher in the Rye',
    author_name: ['J.D. Salinger'],
    first_publish_year: 1951,
    cover_i: 8232009,
  },
];
import api from '../services/api.js';
import Navbar from '../components/Navbar.jsx';
import AddStatusModal from '../components/AddStatusModal.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export default function Explore() {
  const { token } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(sampleBooks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const searchBooks = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.docs.slice(0, 20));
    } catch (err) {
      setError('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (status) => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    try {
      await api.post(
        '/books',
        {
          title: selectedBook.title,
          author: selectedBook.author_name?.[0] || 'Unknown',
          genre: selectedBook.subject?.[0] || '',
          status,
          coverImage: selectedBook.cover_i
            ? `https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-M.jpg`
            : undefined,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setModalOpen(false);
      alert('Added!');
    } catch (err) {
      alert('Failed to add');
    }
  };

  const isInLibrary = async (olid) => {
    // simple check by title+author
    const local = await api.get('/books');
    return local.data.some(
      (b) => b.title.toLowerCase() === olid.title.toLowerCase() && b.author === (olid.author_name?.[0] || 'Unknown')
    );
  };

  return (
    <div className="min-h-screen bg-black/90 text-white">
      <AnimatedBackground />
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto p-4 pt-24"
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Discover Books
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Search for your next great read from thousands of titles in our extensive catalog
          </p>
        </motion.div>

        <motion.form 
          onSubmit={searchBooks} 
          className="flex gap-3 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <input
            type="text"
            placeholder="Search by title, author, or subject"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border border-white/10 bg-white/5 backdrop-blur-md p-3 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            Search
          </motion.button>
        </motion.form>

        {loading && (
          <div className="flex justify-center my-10">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/30 border border-red-500/30 text-red-200 p-4 rounded-lg mb-6 max-w-2xl mx-auto"
          >
            {error}
          </motion.div>
        )}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {results.map((book) => (
            <motion.div 
              key={book.key} 
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                {book.cover_i ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-black flex items-center justify-center">
                    <span className="text-white/70 text-lg">No Cover</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-xs text-white/70">{book.first_publish_year}</p>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1 line-clamp-1">{book.title}</h3>
                <p className="text-sm text-gray-300 mb-3">{book.author_name?.[0] || 'Unknown Author'}</p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    if (await isInLibrary(book)) return;
                    setSelectedBook(book);
                    setModalOpen(true);
                  }}
                  className="w-full py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add to My Library
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {results.length === 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <p className="text-gray-400">No books found. Try a different search term.</p>
          </motion.div>
        )}
      </motion.div>
      
      <AddStatusModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addBook}
      />
    </div>
  );
}
