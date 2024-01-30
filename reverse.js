const fs = require("fs");

// Read the JSON file
const filePath = "./db/Books.json";
const jsonData = fs.readFileSync(filePath, "utf8");

// Parse the JSON data
const originalArray = JSON.parse(jsonData);

// Reverse the array
const reversedArray = [...originalArray].reverse();

// Convert the reversed array back to JSON
const reversedJsonData = JSON.stringify(reversedArray, null, 2);

// Output the reversed data to a new file
const outputFilePath = "./db/BooksReverse.json";
fs.writeFileSync(outputFilePath, reversedJsonData, "utf8");

console.log("File reversed and saved:", outputFilePath);
