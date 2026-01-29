WanderLust is a full-stack web application inspired by Airbnb, built using Node.js, Express.js, MongoDB, and EJS.
It allows users to discover travel stays, create their own listings, upload images, and leave reviews — all with secure authentication and location mapping.

 Key Features
 Authentication System

User registration with encrypted password hashing

Login & logout using Passport.js

Session-based authentication

Flash messages for success & error feedback

   Authorization (Security)

Only logged-in users can create listings

Only listing owners can edit or delete their listings

Only logged-in users can post reviews

Only review authors can delete their reviews

   Listings Module

Create, edit, and delete travel listings

View all listings in responsive card layout

Individual listing detail page with:

Owner information

Price and location details

Map preview

Search listings by location

   Reviews System

Users can add ratings (1–5 stars) and comments

Reviewer name displayed automatically

Review deletion restricted to author

🗺 Location & Map Integration

Address-based geocoding using OpenStreetMap (Nominatim API)

Geographic coordinates stored in MongoDB

Interactive maps displayed using Leaflet.js

Automatic recovery if older listings lack coordinates

    Image Upload & Management

Listings support image uploads directly from a user’s device.

Features

Images stored securely on Cloudinary

Image URL and filename saved in MongoDB

While editing a listing:

Old image is deleted from Cloudinary

New image replaces it

If no new upload is made, the existing image remains

Technologies Used

Multer – File upload handling

Cloudinary – Cloud image storage

multer-storage-cloudinary – Multer–Cloudinary integration

dotenv – Secure credential management

   UI/UX Enhancements

Responsive UI using Bootstrap

Airbnb-style listing cards

Search bar on homepage

Filter UI section

Tax price toggle (dynamic price calculation)

Flash alerts for actions and errors

 Backend Architecture

MVC project structure

MongoDB database with Mongoose models

JOI validation for listings & reviews

Centralized Express error handling

Method-override for PUT & DELETE routes

 Tech Stack
Layer	Technology
Frontend	EJS, Bootstrap, CSS
Backend	Node.js, Express.js
Database	MongoDB + Mongoose
Authentication	Passport.js
Image Storage	Cloudinary
Maps	Leaflet.js + OpenStreetMap
Validation	JOI
     How to Run Locally
npm install
npm start