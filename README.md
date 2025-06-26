MirrorYou
MirrorYou is a YouTube-inspired video-sharing platform, built from scratch by KS-hitij. It offers core YouTube-like features including video upload, browsing, commenting, and user authentication, all powered by a modern React frontend and a Node.js/Express backend.

Features
Video upload with thumbnail support
Browse and search videos
User authentication (JWT-based)
User registration and profile management
Like, dislike, and view tracking
Commenting system with threaded replies
Responsive, YouTube-like UI using TailwindCSS and DaisyUI
State management with Redux
Tech Stack
Frontend:

React (with Vite)
Redux Toolkit
TailwindCSS & DaisyUI
Axios
Backend:

Node.js & Express.js
MongoDB (Mongoose)
JWT for authentication
Joi for schema validation
Multer for file uploads
Cloudinary (for video and image storage)
Getting Started
Prerequisites
Node.js (v16+ recommended)
npm or yarn
MongoDB instance (local or hosted)
Installation
Clone the repository:

bash
git clone https://github.com/KS-hitij/MirrorYou.git
Install frontend dependencies:

bash
cd MirrorYou/frontend
npm install
Install backend dependencies:

bash
cd ../backend
npm install
Configure environment variables:

Set up your .env file in /backend for MongoDB URI, JWT secret, and Cloudinary credentials.
Running the App
Start the backend server:

bash
npm start
Start the frontend app (in a separate terminal):

bash
cd ../frontend
npm start
Visit the app in your browser:
The default frontend URL is http://localhost:5173.

Project Structure
Code
MirrorYou/
├── backend/   # Express server, API routes, models, controllers
├── frontend/  # React app, components, Redux store
└── README.md
Example Features
Video interactions: Like, dislike, views, and search functionality.
Comments: Post new comments and replies, with live updates.
Authentication: Secure login and sign-up using JWT.
Profile & Subscriptions: User profiles, subscriber counts, and channels (expandable).
Author
KS-hitij

License
This project is licensed under the MIT License.