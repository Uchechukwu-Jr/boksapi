const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const books = require("./db/books");

app.use(cors());

//get all books with pagination
app.get("/api/books", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedBooks = books.slice(startIndex, endIndex);
  const totalBooks = books.length;

  res.json({
    totalBooks: totalBooks,
    totalPages: Math.ceil(totalBooks / pageSize),
    currentPage: page,
    pageSize: pageSize,
    books: paginatedBooks,
  });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
