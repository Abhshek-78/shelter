# 🏡 Shelter — Property Listings Web App.

**Shelter** is a full-stack web application for managing property and room listings.  
Users can browse listings, view details, upload images, and authenticated users can create and manage their own listings.

🌐 **Live Demo:**  
https://shelter-rezc.onrender.com/listings

---

## 🚀 Features

- 🏠 View all property/room listings
- 🔍 Detailed listing pages with images and location
- 👤 User authentication (Passport.js)
- ➕ Create, edit, and delete listings (authorized users)
- ☁️ Image upload using **Cloudinary**
- 🗄️ MongoDB database with **Mongoose**
- 🎨 Server-side rendering with **EJS**
- 🔐 Sessions & flash messages
- 🌍 Map integration using **Mapbox**

---

## 🛠️ Tech Stack

**Frontend**
- EJS
- Bootstrap
- HTML / CSS

**Backend**
- Node.js
- Express.js (v5)
- MongoDB
- Mongoose
- Passport.js (Authentication)

**Other Tools**
- Cloudinary (image storage)
- Multer (file uploads)
- Mapbox SDK
- Render (deployment)

---

## install dependencies 
npm install
## create .env file 
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
MAPBOX_TOKEN=your_mapbox_token
DB_URL=your_mongodb_connection_string
SESSION_SECRET=your_secret
**##start the server**
npm start

npm start           # Start the server
npm run create-admin # Create admin user

🙌 **Contributors**

Abhishek – Backend & Full-Stack Development
⭐**Support**

If you like this project, please ⭐ the repository!
Feel free to fork, improve, and submit pull requests.
**deployed**
https://shelter-rezc.onrender.com/listings


