const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
//const books = require("./db/books");
const Data = require("./Data.json");
const Books = require("./db/BooksReverse.json");

app.use(cors());

//get all books with pagination
app.get("/api/books", (req, res) => {
  const limit = parseInt(req.query.limit);
  if (!isNaN(limit) && limit > 0) {
    res.json(Books.slice(0, limit));
  } else {
    res.json(Books);
  }
});

/*app.get("/api/books", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 3;

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedBooks = Books.slice(startIndex, endIndex);
  const totalBooks = Books.length;

  res.json({
    totalBooks: totalBooks,
    totalPages: Math.ceil(totalBooks / pageSize),
    currentPage: page,
    pageSize: pageSize,
    books: paginatedBooks,
  });
});*/

app.get("/api/emails", (req, res) => {
  res.json(Data);
});

//get a single books by ID
app.get("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  console.log(bookId);
  const book = Books.find((book) => book.id === bookId);

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

app.get("/api/search", (req, res) => {
  const searchTerm = req.query.q;

  if (!searchTerm) {
  }

  const decodedSearchTerm = decodeURIComponent(searchTerm);
  console.log(decodedSearchTerm);
  const searchWords = decodedSearchTerm.toLowerCase().split(/\s+/);

  const matchingBooks = Books.filter((book) => {
    return searchWords.every((word) => book.name.toLowerCase().includes(word));
  });

  if (matchingBooks.length > 0) {
    res.json(matchingBooks);
  } else {
    res
      .status(200)
      .json({ message: "Search successful, but no results found" });
  }
});

app.listen(port, () => {});
