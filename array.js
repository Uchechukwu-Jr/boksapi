const fs = require("fs");
const books = require("./db/books");

const jsonString = JSON.stringify(books, null, 2); // The third parameter (2) is optional and adds indentation for better readability

// Specify the file path
const filePath = "./db/Books.json";

// Write the JSON string to the file
fs.writeFileSync(filePath, jsonString);

console.log(`JSON data has been written to ${filePath}`);
