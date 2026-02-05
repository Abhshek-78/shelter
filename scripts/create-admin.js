require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/rooms';

async function main() {
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  const username = process.argv[2] || process.env.ADMIN_USER || 'admin';
  const email = process.argv[3] || process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.argv[4] || process.env.ADMIN_PASS || 'password';

  const existing = await User.findOne({ username });
  if (existing) {
    console.log(`User ${username} already exists.`);
    process.exit(0);
  }

  const admin = new User({ username, email, isAdmin: true });
  await User.register(admin, password);
  console.log(`Admin user '${username}' created.`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});