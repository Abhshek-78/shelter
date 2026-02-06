🏡 Shelter — Listings App

Shelter is a full-stack property/room listing web application built with Node.js, Express, MongoDB, and EJS. Users can create and manage listings, leave reviews, and explore properties on an interactive map. Admins have extended management controls.

🚀 Features
👤 Users

Sign up / Login / Logout (Passport authentication)

Create, edit, and delete their own listings

Upload listing images (Cloudinary)

Add reviews with ratings (1–5)

🏠 Listings

Full CRUD functionality

Image upload & storage

Location-based listings with Mapbox

Server-side filtering:

Price range (after discount)

Minimum rating

Minimum discount

Category

⭐ Reviews

Add and delete reviews

Average rating used in filtering

🗺 Maps

Mapbox integration on listing detail pages

Geocoded coordinates for seeded data

🔐 Admin Panel

Admins can:

View and manage all listings

Edit or delete any listing

View and manage all users

Shelter/
│
├── app.js                  # Main Express configuration
├── index.js                # Optional entry entry point
├── models/                 # Mongoose models
│   ├── listen.js
│   ├── review.js
│   └── user.js
│
├── routes/                 # Route definitions
│   ├── listings.js
│   ├── users.js
│   └── review.js
│
├── controllers/            # Business logic
├── views/                  # EJS templates
├── public/                 # Static assets (CSS, JS, map.js)
│
├── init/
│   ├── data.js             # Seed data
│   └── index.js            # Seeder script with geocoding
│
├── scripts/
│   └── create-admin.js     # CLI admin creator
└── .env                    # Environment variables
💻 Installation & Setup
1️⃣ Install dependencies
npm install

2️⃣ Start MongoDB

Make sure MongoDB is running locally or update MONGO_URL.

3️⃣ Seed sample data (optional)

⚠ This deletes existing listings.

node init/index.js

4️⃣ Create an admin user
node scripts/create-admin.js username email password

5️⃣ Start the server
node app.js


Or with nodemon:

nodemon app.js


Visit 👉 http://localhost:3000/listings

credentials
🔮 Future Improvements

Pagination for listings

Full-text search

Store computed fields (avgRating, effectivePrice)

API version for mobile clients

Unit & integration tests

🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first to discuss what you would like to change.
