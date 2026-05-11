# Backend Task Assignment

This project is a full-stack demo for a backend developer internship assignment.
It includes:

- A Node.js + Express REST API
- MongoDB for data storage
- JWT-based authentication
- Role-based access control (`user` and `admin`)
- CRUD APIs for notes
- A React frontend to test the APIs visually
- A Postman collection for API testing

The backend is the main focus, and the frontend is included to make the API easy to test and demonstrate.

## Tech Stack

- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JWT
- Password Security: bcryptjs
- Validation: express-validator
- Frontend: React + Vite
- API Testing: Postman

## Features

### Authentication

- Register a new user
- Login with email and password
- Passwords are hashed before saving
- JWT token is returned after successful login/register

### Authorization

- `user` can manage only their own notes
- `admin` can view and manage all notes

### Notes CRUD

- Create a note
- Read notes
- Update a note
- Delete a note

### Frontend

- Register and login forms
- Protected dashboard
- Full notes CRUD UI
- Error and success messages

## Project Structure

```text
backendtask/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
├── frontend/
│   ├── src/
│   └── package.json
├── postman_collection.json
└── README.md
```

## How It Works

1. A user registers or logs in.
2. The backend verifies the credentials.
3. A JWT token is returned.
4. The frontend stores the token and sends it with protected requests.
5. The notes API checks the token before allowing access.
6. Role-based logic controls what each user can access.

## Getting Started

### Prerequisites

Make sure you have these installed:

- Node.js
- npm
- MongoDB local server or MongoDB Atlas

## Backend Setup

1. Go to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create your environment file:

- Copy `backend/.env.example`
- Create a new file named `backend/.env`

Example:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/backendtask
JWT_SECRET=ChangeThisSecret
JWT_EXPIRES_IN=1d
```

4. Start the backend server:

```bash
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

## Frontend Setup

1. Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

## Environment Variables

The backend uses these environment variables:

| Variable | Description |
| --- | --- |
| `PORT` | Port for the backend server |
| `CLIENT_URL` | Allowed frontend origin for CORS |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry time, for example `1d` |

Note:
The sample project currently uses `MONGO_URI` in `backend/.env.example`. Keep the same variable name in your local `.env`.

## API Base URL

All versioned API routes start with:

```text
http://localhost:5000/api/v1
```

## Main API Endpoints

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Notes

- `GET /api/v1/notes`
- `POST /api/v1/notes`
- `GET /api/v1/notes/:id`
- `PUT /api/v1/notes/:id`
- `DELETE /api/v1/notes/:id`

## Demo Credentials

### Regular User

You can create a normal user from the frontend or Postman using:

- Email: `user@example.com`
- Password: `password123`

### Admin User

The backend creates a default admin automatically when the server starts.

Default admin credentials:

- Email: `admin@example.com`
- Password: `admin123`

You can change these values from `backend/.env` using:

- `DEFAULT_ADMIN_NAME`
- `DEFAULT_ADMIN_EMAIL`
- `DEFAULT_ADMIN_PASSWORD`

## How To Test the Project

### Option 1: Use the Frontend

1. Register a user
2. Login
3. Open the dashboard
4. Create, edit, and delete notes
5. Logout and test another account if needed

### Option 2: Use Postman

The project includes:

`postman_collection.json`

You can import it into Postman and test the API directly.

Suggested flow:

1. Register a user
2. Login
3. Copy the returned JWT token
4. Use the token in the `Authorization` header:

```text
Bearer <your_token>
```

5. Test create, read, update, and delete note endpoints

## Security Features

- Password hashing with `bcryptjs`
- JWT-based authentication
- Protected routes using middleware
- Role-based authorization
- Request validation using `express-validator`
- Centralized error handling

## Scalability Notes

This project is small, but the structure is ready to grow. A production version could be improved with:

- Separate modules for auth, users, and notes
- Redis caching for frequently accessed data
- Load balancing for multiple server instances
- Docker for consistent deployment
- API rate limiting
- Logging and monitoring
- Refresh token strategy for larger applications

## Beginner Notes

If you are new to backend development, here is the simplest way to understand the project:

- `routes/` contains API endpoints
- `models/` contains MongoDB schemas
- `middleware/` contains reusable logic like auth and error handling
- `index.js` starts the Express server and connects everything together
- The frontend just sends requests to the backend and displays the responses

## Deliverables Covered

- User registration and login
- JWT authentication
- Role-based access control
- Notes CRUD APIs
- Basic frontend integration
- Postman collection
- Scalable backend folder structure

## Final Note

This project is designed to be easy to review, easy to run locally, and clear enough for both beginners and recruiters/interviewers.
