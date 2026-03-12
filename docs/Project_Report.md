# Library Management System - Backend API

## MSE-1 Examination (Practical), Even Sem. 2025-26
### AI308B - AI Driven Full Stack Development

---

**Name:**  
**Roll No:**  
**Branch:** B.Tech (4th Semester)

---

## Table of Contents
1. Project Overview
2. Functional Requirements
3. Project Setup
4. Database Schema
5. REST API Endpoints
6. Source Code
7. Code Output
8. Postman API Testing
9. MongoDB Data Storage
10. GitHub Repository
11. Render Deployment

---

## 1. Project Overview

This project is a web-based Backend API to manage book records for a university library. The system allows the library administration to:
- Add new books to the library
- View all book records
- Update book details
- Delete book records
- Search books by title or author

**Tech Stack:** Node.js, Express.js, MongoDB (Mongoose), dotenv

---

## 2. Functional Requirements

### Book Fields
Each book record contains the following details:

| S.N. | Field | Description |
|------|-------|-------------|
| 1 | Book ID | Auto-generated (_id by MongoDB) |
| 2 | Title | Title of the book |
| 3 | Author | Author of the book |
| 4 | ISBN | Unique ISBN number |
| 5 | Genre / Category | Genre or category of the book |
| 6 | Publisher | Publisher name |
| 7 | Publication Year | Year of publication |
| 8 | Total Copies | Total number of copies (positive number) |
| 9 | Available Copies | Number of copies currently available |
| 10 | Shelf Location | Physical shelf location in library |
| 11 | Book Type | Reference / Circulating |
| 12 | Status | Available / Checked Out (Default: Available) |

---

## 3. Project Setup

### Dependencies Installed
- **express** — Web framework
- **mongoose** — MongoDB ODM
- **dotenv** — Environment variable management
- **nodemon** — Auto-restart server (dev dependency)

### Project Structure
```
library-management-system/
├── config/
│   └── db.js
├── controllers/
│   └── bookController.js
├── middleware/
│   └── errorHandler.js
├── models/
│   └── Book.js
├── routes/
│   └── bookRoutes.js
├── .env
├── .gitignore
├── package.json
├── render.yaml
├── README.md
└── server.js
```

---

## 4. Database Schema (models/Book.js)

### Validations Applied:
- Title → Required
- ISBN → Required and Unique
- Author → Required
- Total Copies → Must be a positive number (min: 1)
- Genre → Required
- Publisher → Required
- Status → Default value = "Available"

---

## 5. REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /books | Add a new book |
| GET | /books | Get all book records |
| GET | /books/:id | Get book by ID |
| PUT | /books/:id | Update book details |
| DELETE | /books/:id | Delete book record |
| GET | /books/search?title=xyz | Search book by title |

### HTTP Status Codes Used:
- **200** → Success
- **201** → Created
- **400** → Bad Request
- **404** → Not Found
- **500** → Server Error

---

## 6. Source Code

### server.js
```javascript
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use("/books", bookRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### config/db.js
```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### models/Book.js
```javascript
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
    },
    genre: {
      type: String,
      required: [true, "Genre / Category is required"],
    },
    publisher: {
      type: String,
      required: [true, "Publisher is required"],
    },
    publicationYear: {
      type: Number,
    },
    totalCopies: {
      type: Number,
      required: [true, "Total Copies is required"],
      min: [1, "Total Copies must be a positive number"],
    },
    availableCopies: {
      type: Number,
      default: function () {
        return this.totalCopies;
      },
    },
    shelfLocation: {
      type: String,
    },
    bookType: {
      type: String,
      enum: ["Reference", "Circulating"],
    },
    status: {
      type: String,
      enum: ["Available", "Checked Out"],
      default: "Available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
```

### controllers/bookController.js
```javascript
const Book = require("../models/Book");

// POST /books - Add a new book
const createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "ISBN already exists" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// GET /books - Get all book records
const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

// GET /books/search?title=xyz - Search book by title or author
const searchBooks = async (req, res, next) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ message: "Please provide a title to search" });
    }
    const books = await Book.find({
      $or: [
        { title: { $regex: title, $options: "i" } },
        { author: { $regex: title, $options: "i" } },
      ],
    });
    if (books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

// GET /books/:id - Get book by ID
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

// PUT /books/:id - Update book details
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// DELETE /books/:id - Delete book record
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  searchBooks,
};
```

### routes/bookRoutes.js
```javascript
const express = require("express");
const router = express.Router();
const {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  searchBooks,
} = require("../controllers/bookController");

router.get("/search", searchBooks);
router.post("/", createBook);
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;
```

### middleware/errorHandler.js
```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
```

---

## 7. Code Output

> **[INSERT SCREENSHOT: Terminal showing "Server running on port 5000" and "MongoDB Connected"]**

---

## 8. Postman API Testing

### 8.1 POST /books — Add a new book
> **[INSERT SCREENSHOT: Postman POST request with 201 Created response]**

### 8.2 GET /books — Get all books
> **[INSERT SCREENSHOT: Postman GET request with 200 OK response]**

### 8.3 GET /books/:id — Get book by ID
> **[INSERT SCREENSHOT: Postman GET by ID request with 200 OK response]**

### 8.4 PUT /books/:id — Update book
> **[INSERT SCREENSHOT: Postman PUT request with 200 OK response]**

### 8.5 DELETE /books/:id — Delete book
> **[INSERT SCREENSHOT: Postman DELETE request with 200 OK response]**

### 8.6 GET /books/search?title=xyz — Search by title
> **[INSERT SCREENSHOT: Postman Search request with 200 OK response]**

---

## 9. MongoDB Data Storage

> **[INSERT SCREENSHOT: MongoDB Atlas → Browse Collections → books collection showing stored data]**

---

## 10. GitHub Repository

**GitHub Link:** https://github.com/<your-username>/library-management-system

> **[INSERT SCREENSHOT: GitHub repository page]**

---

## 11. Render Deployment

**Render Live URL:** https://<your-app-name>.onrender.com

> **[INSERT SCREENSHOT: Render dashboard showing successful deployment]**

---

### Links

| Platform | URL |
|----------|-----|
| GitHub | https://github.com/<your-username>/library-management-system |
| Render | https://<your-app-name>.onrender.com |

---
