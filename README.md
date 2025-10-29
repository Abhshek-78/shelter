# shelter
it is hotel booking website 
# Shelter — Listings app

Brief: Shelter is a small Express + EJS + Mongoose app for managing property/room listings. It supports create/read/update/delete operations, server-side rendering with EJS (using ejs-mate), and a seed script to populate sample listings.

---

## Tech stack
- Node.js (>= 18 recommended)
- Express
- EJS + ejs-mate
- MongoDB (local)
- Mongoose
- Bootstrap (front-end)
- Font Awesome (icons)

---

## Prerequisites
- Git installed
- Node.js and npm
- MongoDB running locally (default at `mongodb://127.0.0.1:27017`)
- (Optional) GitHub account if pushing repo

---

## Quick setup (Windows / PowerShell)
1. Open PowerShell and go to project folder:
2. Install dependencies
3. Start local MongoDB (if not running). Example (for installed service):
- Run `mongod` or ensure MongoDB service is started via Services.

4. Seed the database (if you have `init/index.js` or `init/index1.js`):- The seed script should connect to MongoDB, normalize `Img` to a string and insert sample listings. Check console logs for success.

5. Start the app from project root:- Visit http://localhost:3000

---

## Environment/configuration
- MongoDB URL is configured in `app.js` / `init/index.js`:
  ```js
  const Mongo_url = 'mongodb://127.0.0.1:27017/rooms';
