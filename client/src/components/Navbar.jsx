import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
      <div className="container">
        <div className="flex justify-between items-center py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="font-heading text-xl font-bold tracking-wide flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                BookShelf
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6 text-white" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4"
          >
            <div className="flex flex-col space-y-4">
              <NavLinks mobile />
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

function NavLinks({ mobile }) {
  const { logout } = useContext(AuthContext);
  const linkClass = `font-medium transition-colors ${
    mobile 
      ? 'block py-2 text-gray-300 hover:text-purple-300' 
      : 'text-gray-300 hover:text-purple-300 hover:bg-white/5 px-4 py-2 rounded-lg'
  }`;

  return (
    <>
      <Link to="/add" className={linkClass}>
        Add Book
      </Link>
      <Link to="/explore" className={linkClass}>
        Explore
      </Link>
      <Link to="/profile" className={linkClass}>
        Profile
      </Link>
      <button 
        onClick={logout} 
        className={`${linkClass} ${
          mobile 
            ? 'text-red-400 hover:text-red-300' 
            : 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
        }`}
      >
        Logout
      </button>
    </>
  );
}

