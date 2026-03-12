# Hospital Patient Management System - Backend API

## Description
A web-based backend API to manage patient records for a hospital. Built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**.

## Features
- Register new patients
- View all patient records
- View patient by ID
- Update patient details
- Delete patient records
- Search patients by name

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- dotenv

## Setup & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/hostel-management.git
   cd hostel-management
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

| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| POST   | /patients              | Register a new patient   |
| GET    | /patients              | Get all patient records  |
| GET    | /patients/:id          | Get patient by ID        |
| PUT    | /patients/:id          | Update patient details   |
| DELETE | /patients/:id          | Delete patient record    |
| GET    | /patients/search?name= | Search patient by name   |

## Deployment
Deployed on **Render**: [(https://hospital-management-ezws.onrender.com)]
