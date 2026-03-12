# Library Management System - Backend API

## Description
A web-based backend API to manage book records for a university library. Built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**.

## Features
- Add new books to the library
- View all book records
- View book by ID
- Update book details
- Delete book records
- Search books by title or author

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- dotenv

## Setup & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/library-management-system.git
   cd library-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| POST   | /books                  | Add a new book        |
| GET    | /books                  | Get all book records  |
| GET    | /books/:id              | Get book by ID        |
| PUT    | /books/:id              | Update book details   |
| DELETE | /books/:id              | Delete book record    |
| GET    | /books/search?title=xyz | Search book by title  |

## Deployment
Deployed on **Render**: [Live URL]
