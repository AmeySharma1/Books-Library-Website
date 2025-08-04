import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import Book from '../models/Book.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer for image uploads (store locally in /uploads)
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const parseForm = (req, res, next) => {
  const type = req.headers['content-type'] || '';
  if (type.startsWith('multipart/form-data')) {
    return upload.single('coverImage')(req, res, next);
  }
  return next();
};

// GET /books → fetch all books for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /books/:id → fetch single book
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findOne({ _id: id, userId: req.user.id });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /books → add a book
router.post('/', auth, parseForm, async (req, res) => {
  const { title, author, genre, status } = req.body;
  if (!title || !author) return res.status(400).json({ message: 'Title and author are required' });
  try {
    const newBook = new Book({
      title,
      author,
      genre,
      status,
      coverImage: req.file ? `/uploads/${req.file.filename}` : req.body.coverImage || undefined,
      userId: req.user.id,
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /books/:id → update book details
router.put('/:id', auth, parseForm, async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findOne({ _id: id, userId: req.user.id });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const {
      title = book.title,
      author = book.author,
      genre = book.genre,
      status = book.status,
    } = req.body;

    book.title = title;
    book.author = author;
    book.genre = genre;
    book.status = status;
    if (req.file) {
      book.coverImage = `/uploads/${req.file.filename}`;
    } else if (req.body.coverImage) {
      book.coverImage = req.body.coverImage;
    }
    await book.save();
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /books/:id → delete a book
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
