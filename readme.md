# WanderLust

A full stack web application built using Node.js, Express.js, MongoDB, and EJS.

## Features
- CRUD operations for listings
- Review system with validation
- MVC architecture
- Error handling
- image uploading using cloudnary

## 🆕 Recent Updates

- Fixed listing image validation using Joi
- Improved flash messages UI
- Enhanced error handling and validation flow
- ADDED cookie sessions
-  added image upload feature

## How to Run
```bash
npm install
npm start

🚀 Added Features
🔐 Authentication System

User signup with encrypted password storage

User login & logout using Passport.js

Session-based authentication

Flash messages for success & error handling

👤 Authorization (Security)

Only logged-in users can create listings

Only listing owners can edit or delete their listings

Only logged-in users can post reviews

Only review authors can delete their reviews

🏠 Listings Module

Create new listings

View all listings

View detailed listing page

Edit & delete listing (owner only)

Each listing is linked to its creator

⭐ Reviews System

Logged-in users can add reviews

Reviews include rating + comment

Reviewer name automatically displayed

Users can delete only their own reviews

🎨 UI Features

Bootstrap responsive design

Flash alerts for actions

Clean listing cards layout

Dynamic show page with owner & reviewer info

🧠 Backend Features

MongoDB database with Mongoose models

JOI validation for listings & reviews

Express error handling middleware

Method-override for PUT & DELETE routes



NEW FEATURES

📸 Image Upload & Update Feature

This project supports image upload from local system when creating and editing listings using Cloudinary.

🚀 Features

Users can upload images directly from their computer.

Images are stored securely on Cloudinary.

The image URL and filename are saved in MongoDB.

While editing a listing:

If a new image is uploaded → the old image is automatically deleted from Cloudinary.

If no image is uploaded → the existing image remains unchanged.

🛠 Technologies Used

Multer – Handles file uploads

Cloudinary – Cloud image storage

multer-storage-cloudinary – Connects multer with Cloudinary

dotenv – Secures API credentials