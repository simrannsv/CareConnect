import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Provider from '../models/Provider.js';
import ServiceRequest from '../models/Servicerequest.js';
import Quote from '../models/Quote.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import {
  DEMO_DOMAIN,
  DEMO_PASSWORD,
  categories,
  customers as customerData,
  providers as providerData,
  providerEmail,
  providerFields,
  commentFor,
  jobDescription,
  scheduledJob,
  sampleRequests,
} from './demoData.js';

const NOW = new Date();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@careconnect.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

await mongoose.connect(process.env.MONGO_URI);

// 1. remove the previous demo data (only records tied to demo accounts)
const demoUsers = await User.find({
  email: new RegExp(`@${DEMO_DOMAIN.replace(/\./g, '\\.')}$`, 'i'),
}).select('_id');
const userIds = demoUsers.map((u) => u._id);
const providerIds = (await Provider.find({ user: { $in: userIds } }).select('_id')).map((p) => p._id);
const requestIds = (await ServiceRequest.find({ customer: { $in: userIds } }).select('_id')).map((r) => r._id);

await Review.deleteMany({ $or: [{ customer: { $in: userIds } }, { provider: { $in: providerIds } }] });
await Booking.deleteMany({
  $or: [{ customer: { $in: userIds } }, { provider: { $in: providerIds } }, { request: { $in: requestIds } }],
});
await Quote.deleteMany({ $or: [{ provider: { $in: providerIds } }, { request: { $in: requestIds } }] });
await ServiceRequest.deleteMany({ customer: { $in: userIds } });
await Provider.deleteMany({ user: { $in: userIds } });
await User.deleteMany({ _id: { $in: userIds } });

// 2. admin (only if missing)
if (!(await User.findOne({ email: ADMIN_EMAIL }))) {
  await User.create({ name: 'Admin', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' });
}

// 3. categories (kept if they already exist)
const catId = {};
for (const c of categories) {
  const doc = await Category.findOneAndUpdate(
    { name: c.name },
    { ...c, isActive: true },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  catId[c.name] = doc._id;
}

// 4. customers
const customers = [];
for (const c of customerData) {
  customers.push(await User.create({ ...c, password: DEMO_PASSWORD, role: 'customer' }));
}

// 5. providers
const prov = {};
for (const p of providerData) {
  const user = await User.create({
    name: p.name,
    email: providerEmail(p),
    password: DEMO_PASSWORD,
    role: 'provider',
    phone: p.phone,
  });
  const profile = await Provider.create({ user: user._id, ...providerFields(p, catId, NOW) });
  prov[p.key] = { user, profile, data: p };
}

// 6. past completed jobs with reviews (this is where the ratings come from)
let jobCount = 0;
for (const { profile, data: p } of Object.values(prov)) {
  for (let i = 0; i < p.reviews.length; i++) {
    const rating = p.reviews[i];
    const customer = customers[i % customers.length];
    const category = p.categories[0];
    const start = new Date(NOW);
    start.setDate(start.getDate() - (5 + i * 7));
    start.setHours(10, 0, 0, 0);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    const request = await ServiceRequest.create({
      customer: customer._id,
      description: jobDescription(category, i),
      location: p.serviceAreas[0],
      aiCategory: catId[category],
      aiSkills: p.skills.slice(0, 2),
      status: 'closed',
    });
    const quote = await Quote.create({
      request: request._id, provider: profile._id, price: p.basePrice, status: 'accepted',
    });
    const booking = await Booking.create({
      request: request._id, quote: quote._id, customer: customer._id, provider: profile._id,
      start, end, status: 'completed', customerConfirmed: true,
    });
    await Review.create({
      booking: booking._id, customer: customer._id, provider: profile._id,
      rating, comment: commentFor(rating, i), createdAt: end,
    });
    jobCount++;
  }
  await Review.updateProviderRating(profile._id); // make sure the rating is up to date
}

// 7. one scheduled job tomorrow at 10:00 (shows a busy provider in the ranking)
{
  const p = prov[scheduledJob.providerKey];
  const customer = customers[scheduledJob.customerIndex];
  const start = new Date(NOW);
  start.setDate(start.getDate() + scheduledJob.dayOffset);
  start.setHours(scheduledJob.hour, 0, 0, 0);
  const end = new Date(start.getTime() + scheduledJob.hours * 60 * 60 * 1000);

  const request = await ServiceRequest.create({
    customer: customer._id,
    description: scheduledJob.description,
    location: scheduledJob.location,
    aiCategory: catId[scheduledJob.category],
    aiSkills: ['ac repair', 'water leakage'],
    status: 'booked',
  });
  const quote = await Quote.create({
    request: request._id, provider: p.profile._id, price: p.data.basePrice, status: 'accepted',
  });
  await Booking.create({
    request: request._id, quote: quote._id, customer: customer._id, provider: p.profile._id,
    start, end, status: 'scheduled',
  });
}

// 8. requests waiting for quotes, and one with quotes
for (const r of sampleRequests) {
  const request = await ServiceRequest.create({
    customer: customers[r.customerIndex]._id,
    description: r.description,
    location: r.location,
    aiCategory: catId[r.category],
    aiSkills: r.aiSkills,
    urgency: r.urgency,
    status: r.status,
  });
  for (const q of r.quotes) {
    await Quote.create({
      request: request._id, provider: prov[q.providerKey].profile._id, price: q.price, message: q.message,
    });
  }
}

// 9. summary
console.log('\nDemo data ready.\n');
console.log('Role       Email                                   Password');
console.log('-----------------------------------------------------------------');
console.log(`admin      ${ADMIN_EMAIL.padEnd(38)}  ${ADMIN_PASSWORD} (only if it was missing)`);
for (const c of customerData) console.log(`customer   ${c.email.padEnd(38)}  ${DEMO_PASSWORD}`);
for (const p of providerData) {
  const note = p.verified ? '' : '  <- not verified yet (admin verify demo)';
  console.log(`provider   ${providerEmail(p).padEnd(38)}  ${DEMO_PASSWORD}${note}`);
}
console.log(
  `\n${categories.length} categories, ${providerData.length} providers, ${customerData.length} customers, ` +
    `${jobCount} past jobs with reviews, 1 scheduled job, ${sampleRequests.length} sample requests.`
);
console.log('Availability slots start tomorrow, so run this again before your demo.\n');

await mongoose.disconnect();
