Wanderlust - Travel Listing Web Application

Wanderlust is a full-stack travel listing platform where users can explore destinations, add their own places, leave reviews, and discover trips based on travel preferences. This project simulates real-world travel platforms and includes features focused on usability, search, and structured backend design.

------------------------------------------------------------

Live Demo  
https://wanderlust-iawk.onrender.com

------------------------------------------------------------

Features

Authentication and Users
- User signup and login
- Secure session handling
- Only listing owners can edit or delete their listings

Listings System
- Create, update, and delete listings
- Image upload using cloud storage
- Location-based listings with stored coordinates

Reviews
- Users can add and delete reviews
- Reviews linked to both users and listings

Search Functionality
- Search listings by title or location
- Case-insensitive filtering

Mood-Based Travel Discovery
- Listings are categorized by travel mood:
  Relax, Adventure, Romantic, Party, Nature
- Users can filter destinations based on travel intent

Dynamic Price Toggle
- Users can view price with or without tax

Geolocation Support
- Listings store geographic coordinates for map integration

Cloud Image Storage
- Images managed through cloud-based storage

Deployment
- Application deployed on a cloud hosting platform
- Uses environment variables for configuration

------------------------------------------------------------

Technology Stack

Frontend
HTML  
CSS  
Bootstrap  
EJS Templates  

Backend
Node.js  
Express.js  

Database
MongoDB  
Mongoose  

Authentication
Passport.js  

Other Integrations
Cloud image storage  
Geocoding API  

------------------------------------------------------------

Project Structure

models      - Database schemas  
routes      - Express route definitions  
controllers - Application logic  
views       - EJS templates  
public      - Static files  

------------------------------------------------------------

Installation (Local Setup)

1. Clone the repository
git clone https://github.com/shaikmansur122/wanderlust.git

2. Install dependencies
npm install

3. Create a .env file with:
MONGO_URI=your_mongodb_connection_string  
SESSION_SECRET=your_secret_key  
CLOUDINARY_CLOUD_NAME=your_cloud_name  
CLOUDINARY_KEY=your_api_key  
CLOUDINARY_SECRET=your_api_secret  

4. Start the server
nodemon app.js

5. Open in browser
http://localhost:8080

------------------------------------------------------------

Learning Outcomes

- RESTful backend architecture  
- Database relationships and modeling  
- Authentication and session handling  
- Cloud deployment  
- Environment variable management  
- Real-world feature implementation  

------------------------------------------------------------

Future Improvements

- Booking system  
- Admin dashboard  
- Email notifications  
- Pagination  
- Advanced filtering  

------------------------------------------------------------

Author  
Shaik mansur
