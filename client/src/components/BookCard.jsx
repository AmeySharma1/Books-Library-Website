import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function BookCard({ book, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    onDelete(book._id);
    setShowDeleteConfirm(false);
  };

  const statusColors = {
    'To Read': 'bg-pink-900/50 text-pink-200 border-pink-500/50',
    'Reading': 'bg-purple-900/50 text-purple-200 border-purple-500/50',
    'Read': 'bg-emerald-900/50 text-emerald-200 border-emerald-500/50'
  };

  return (
    <motion.div
      className="overflow-hidden group hover:scale-[1.02] transition-transform bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => {
        setIsHovered(false);
        setShowDeleteConfirm(false);
      }}
    >
      <div className="relative aspect-[2/3] mb-4">
        {book.coverImage ? (
          <img
            src={book.coverImage.startsWith('http') ? book.coverImage : `${import.meta.env.VITE_API_URL}${book.coverImage}`}
            alt={book.title}
            className="w-full h-full object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-purple-700/30 rounded-lg flex items-center justify-center border border-white/10">
            <span className="text-4xl">📚</span>
          </div>
        )}
        
        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center gap-3 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <Link
            to={`/edit/${book._id}`}
            className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors transform hover:scale-110"
          >
            <PencilIcon className="w-5 h-5 text-white" />
          </Link>
          <button
            onClick={handleDelete}
            className={`p-2 ${
              showDeleteConfirm 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-white/20 hover:bg-white/40'
            } rounded-full transition-all transform hover:scale-110`}
          >
            <TrashIcon className="w-5 h-5 text-white" />
          </button>
        </motion.div>
      </div>

      <div className="text-center">
        <h3 className="font-heading font-semibold text-lg line-clamp-1 group-hover:text-purple-300 text-white transition-colors" title={book.title}>
          {book.title}
        </h3>
        <p className="text-gray-300 text-sm mt-1 line-clamp-1" title={book.author}>
          {book.author}
        </p>
        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusColors[book.status]} border border-current border-opacity-20`}>
          {book.status}
        </span>
      </div>
    </motion.div>
  );
}
