# URL Shortener with Analytics Dashboard

A full-stack URL shortener application similar to Bitly that allows users to create shortened links and track their performance through an analytics dashboard.

---

## Features

- User authentication with JWT
- Create short links with optional custom aliases and expiration dates
- Analytics dashboard showing clicks, devices, and browsers
- QR code generation for each shortened URL
- Pagination and search functionality for the dashboard

---

## Tech Stack

- **Frontend**: React.js, Redux Toolkit, Recharts, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

---

## Installation and Setup

### Prerequisites

- Node.js (v14+)
- MongoDB

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory and add the following environment variables:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/url-shortener
   JWT_SECRET=dacoid_jwt_secret_key
   BASE_URL=http://localhost:5000
   CLIENT_URL=http://localhost:3000
   ```

4. Seed the database:

   ```bash
   npm run seed
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

   The server will run on [http://localhost:5000](http://localhost:5000).

### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the client application:

   ```bash
   npm start
   ```

   The application will run on [http://localhost:3000](http://localhost:3000).

---

## Usage

1. Login using the following credentials:

   - **Email**: intern@dacoid.com
   - **Password**: Test123

2. Create a shortened URL by clicking the "Create New URL" button.

3. View analytics for any URL by clicking the "Analytics" button.

### Optional Features:

- Use custom aliases for your shortened URLs.
- Set expiration dates for your links.
- Download QR codes for easy sharing.
- Search and filter your URLs in the dashboard.

---

## Deployment

### Backend Deployment

The backend can be deployed to services like:

- Heroku
- Railway
- Render
- Digital Ocean

### Frontend Deployment

The frontend can be deployed to:

- Netlify
- Vercel
- GitHub Pages

---

## API Documentation

### Authentication

- **POST** `/api/users/login` - Login with email and password
- **GET** `/api/users/profile` - Get user profile (protected)

### URLs

- **POST** `/api/urls` - Create a new short URL (protected)
- **GET** `/api/urls` - Get all URLs for the current user (protected)
- **GET** `/api/urls/:id/analytics` - Get analytics for a URL (protected)
- **DELETE** `/api/urls/:id` - Delete a URL (protected)

### Redirects

- **GET** `/:code` - Redirect to the original URL and track analytics
