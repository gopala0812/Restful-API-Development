const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const filePath = path.join(__dirname, 'books.json');

// Helper: Load books from books.json
function loadBooks() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];  // If file doesn't exist or is empty
    }
}

// Helper: Save books to books.json
function saveBooks(books) {
    fs.writeFileSync(filePath, JSON.stringify(books, null, 2), 'utf8');
}

// Create a new book (POST /books)
router.post('/', (req, res) => {
    const books = loadBooks();
    const newBook = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn,
        publishedYear: req.body.publishedYear
    };
    books.push(newBook);
    saveBooks(books);
    res.status(201).json({
        message: 'Book added successfully',
        data: newBook
    });
});

// Get all books (GET /books)
router.get('/', (req, res) => {
    const books = loadBooks();
    res.json({
        message: 'Books fetched successfully',
        data: books
    });
});

// Get a single book by ID (GET /books/:id)
router.get('/:id', (req, res) => {
    const books = loadBooks();
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    res.json({
        message: 'Book fetched successfully',
        data: book
    });
});

// Update a book by ID (PUT /books/:id)
router.put('/:id', (req, res) => {
    const books = loadBooks();
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.isbn = req.body.isbn || book.isbn;
    book.publishedYear = req.body.publishedYear || book.publishedYear;

    saveBooks(books);
    res.json({
        message: 'Book updated successfully',
        data: book
    });
});

// Delete a book by ID (DELETE /books/:id)
router.delete('/:id', (req, res) => {
    let books = loadBooks();
    const bookId = parseInt(req.params.id);
    const index = books.findIndex(b => b.id === bookId);
    if (index === -1) {
        return res.status(404).json({ message: 'Book not found' });
    }

    books.splice(index, 1);
    saveBooks(books);
    res.json({
        message: 'Book deleted successfully'
    });
});

module.exports = router;
