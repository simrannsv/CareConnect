import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const email = process.env.ADMIN_EMAIL || 'admin@careconnect.com';
const password = process.env.ADMIN_PASSWORD || 'admin123';

await mongoose.connect(process.env.MONGO_URI);

if (await User.findOne({ email })) {
  console.log(`Admin already exists: ${email}`);
} else {
  await User.create({ name: 'Admin', email, password, role: 'admin' });
  console.log(`Admin created: ${email}`);
}

await mongoose.disconnect();