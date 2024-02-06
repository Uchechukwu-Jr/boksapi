const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3000;
const Data = require("./Data.json");
const fs = require("fs");
const Books = require("./db/BooksReverseCopy.json");

app.use(cors());
app.use(express.json());

//get all books with optional limit
app.get("/api/books", (req, res) => {
  const limit = parseInt(req.query.limit);
  if (!isNaN(limit) && limit > 0) {
    res.json(Books.slice(0, limit));
  } else {
    res.json(Books);
  }
});

// Add a new route for posting a new book
app.post("/api/books", (req, res) => {
  try {
    const newBook = req.body;

    if (!newBook.name || !newBook.author) {
      return res
        .status(400)
        .json({ error: "Name and Author are required fields." });
    }

    newBook.name = newBook.name.trim();
    newBook.author = newBook.author.trim();
    newBook.ISBN = newBook.ISBN.trim();
    newBook.ASIN = newBook.ASIN.trim();
    newBook.editionLanguage = newBook.editionLanguage.trim();
    newBook.imageUrl = newBook.imageUrl.trim();

    if (newBook.series) {
      newBook.series.seriesTitle = newBook.series.seriesTitle.trim();
      newBook.series.numberInSeries = newBook.series.numberInSeries.trim();
    }

    newBook.id = uuidv4();
    Books.push(newBook);
    fs.writeFileSync(
      "./db/BooksReverseCopy.json",
      JSON.stringify(Books, null, 2)
    );

    res.status(201).json(newBook);
    console.log("Added book and updated JSON file");
  } catch (error) {
    console.error("Error adding book:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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

// get genres
app.get("/api/genres", (req, res) => {
  // Extract genres from all books and flatten the array
  const allGenres = Books.reduce(
    (genres, book) => genres.concat(book.genre),
    []
  );
  // Get unique genres by converting the array to a Set and then back to an array
  const Genres = [...new Set(allGenres)];
  res.json(Genres);
});

// get authors
app.get("/api/authors", (req, res) => {
  // Extract authors from all books and flatten the array
  const allAuthors = Books.reduce(
    (author, book) => author.concat(book.author),
    []
  );
  // Get unique authors by converting the array to a Set and then back to an array
  const Authors = [...new Set(allAuthors)];
  res.json(Authors);
});

// get books by genre
app.get("/api/genres/:genre", (req, res) => {
  const requestedGenre = req.params.genre.toLowerCase();

  const filteredBooks = Books.filter((book) =>
    book.genre.some((genre) => genre.toLowerCase() === requestedGenre)
  );

  if (filteredBooks.length === 0) {
    res.status(404).json({
      message: `No books found for genre: ${requestedGenre}`,
    });
  } else {
    res.json(filteredBooks);
  }
});

// get books by author
app.get("/api/authors/:author", (req, res) => {
  const requestedAuthor = req.params.author.toLowerCase();

  const filteredBooks = Books.filter(
    (book) => book.author.toLowerCase() === requestedAuthor
  );

  if (filteredBooks.length === 0) {
    res.status(404).json({
      message: `No books found for genre: ${author}`,
    });
  } else {
    res.json(filteredBooks);
  }
});

app.get("/api/search", (req, res) => {
  const searchTerm = req.query.q;

  if (!searchTerm) {
    res.json(Books);
    return;
  }

  const trimmedSearchTerm = searchTerm.trim();
  const decodedSearchTerm = decodeURIComponent(trimmedSearchTerm);
  console.log(decodedSearchTerm);

  const searchQuery = decodedSearchTerm
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
    .replace(/'s/g, "")
    .replace(/&/g, "and")
    .replace(/\b(?:the|and|or)\b/g, "")
    .replace(/s$/g, "") // Remove trailing 's' for plural forms
    .replace(/\./g, " ") // Replace periods with spaces
    .split(/\s+/);

  const matchingBooks = Books.filter((book) => {
    // Exclude the 'description' property from the search
    const propertiesToSearch = Object.keys(book).filter(
      (prop) => prop !== "description"
    );

    return searchQuery.some((term) =>
      propertiesToSearch
        .map((prop) => String(book[prop]))
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  });

  if (matchingBooks.length > 0) {
    res.json(matchingBooks);
  } else {
    res.status(200).json({
      message: "Search successful, but no results found",
    });
  }
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
