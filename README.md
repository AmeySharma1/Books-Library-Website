# Personal Library Tracker

A full-stack web application that allows users to track books they have read, are reading, or want to read.

## Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Image Upload:** Multer (stored locally in `/server/uploads`)

## Folder Structure

```
client/   # React frontend
server/   # Express backend
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm
- MongoDB Atlas account or local MongoDB server

### Backend Setup

1. Navigate to `server` folder and install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your environment variables:

```
PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_secret>
CLIENT_URL=http://localhost:3000
```

3. Start the backend server:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to `client` folder and install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and adjust the API URL if necessary:

```
VITE_API_URL=https://books-library-website-2.onrender.com
```

3. Start the React dev server:

```bash
npm run dev
```

The app should now be running at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint        | Description                 |
| ------ | --------------- | --------------------------- |
| POST   | /auth/signup    | Register a new user         |
| POST   | /auth/login     | Login and receive JWT token |
| GET    | /books          | Fetch all books             |
| GET    | /books/:id      | Fetch single book           |
| POST   | /books          | Add a new book              |
| PUT    | /books/:id      | Update book                 |
| DELETE | /books/:id      | Delete book                 |

## Sample Data

Use the Signup page to create an account and start adding books.
