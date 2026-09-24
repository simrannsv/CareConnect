// Pure data and helpers for the demo seed. No database access in this file.

export const DEMO_DOMAIN = 'demo.careconnect.com';
export const DEMO_PASSWORD = 'demo123';

export const categories = [
  { name: 'Plumbing', description: 'Leaks, pipes, taps and drainage' },
  { name: 'Electrical', description: 'Wiring, switches, fans and lighting' },
  { name: 'AC Repair', description: 'AC repair, servicing and installation' },
  { name: 'Cleaning', description: 'Home, kitchen and bathroom deep cleaning' },
  { name: 'Carpentry', description: 'Furniture repair, doors and fittings' },
  { name: 'Appliance Repair', description: 'Washing machine, fridge, geyser and more' },
];

export const customers = [
  { name: 'Priya Nair', email: `customer@${DEMO_DOMAIN}`, phone: '9100000001' },
  { name: 'Arjun Mehta', email: `customer2@${DEMO_DOMAIN}`, phone: '9100000002' },
  { name: 'Sneha Reddy', email: `customer3@${DEMO_DOMAIN}`, phone: '9100000003' },
];

// windows are [startHour, endHour] in server local time; days are offsets from today (1 = tomorrow)
const ALL_DAYS = [1, 2, 3, 4, 5, 6];
const WEEKDAYS = [1, 2, 4, 5];

// reviews are the ratings of past completed jobs; the provider's rating is computed from them
export const providers = [
  {
    key: 'ravi', name: 'Ravi Kumar', phone: '9000000001', categories: ['Plumbing'],
    skills: ['pipe repair', 'leak fixing', 'tap installation', 'drain cleaning', 'water tank repair'],
    serviceAreas: ['vanasthalipuram', 'lb nagar', 'hayathnagar'],
    basePrice: 500, experienceYears: 8, bio: 'Plumber with 8 years of home service experience. Quick with leaks and tap fittings.',
    verified: true, windows: [[9, 13], [14, 18]], days: ALL_DAYS, reviews: [5, 5, 4, 5],
  },
  {
    key: 'suresh', name: 'Suresh Reddy', phone: '9000000002', categories: ['Plumbing'],
    skills: ['pipe repair', 'bathroom fitting', 'water heater installation', 'geyser repair'],
    serviceAreas: ['dilsukhnagar', 'kukatpally', 'uppal'],
    basePrice: 450, experienceYears: 4, bio: 'Bathroom and water heater specialist.',
    verified: true, windows: [[9, 13]], days: WEEKDAYS, reviews: [4, 4, 5],
  },
  {
    key: 'anil', name: 'Anil Sharma', phone: '9000000003', categories: ['Electrical'],
    skills: ['wiring', 'switchboard repair', 'fan installation', 'short circuit repair', 'light fitting'],
    serviceAreas: ['vanasthalipuram', 'lb nagar', 'uppal'],
    basePrice: 600, experienceYears: 10, bio: 'Licensed electrician. Handles urgent electrical faults safely.',
    verified: true, windows: [[9, 13], [14, 19]], days: ALL_DAYS, reviews: [5, 5, 5, 4, 5],
  },
  {
    key: 'mohan', name: 'Mohan Rao', phone: '9000000004', categories: ['Electrical'],
    skills: ['inverter installation', 'wiring', 'mcb replacement', 'appliance wiring'],
    serviceAreas: ['kukatpally', 'madhapur'],
    basePrice: 550, experienceYears: 6, bio: 'Inverter and home wiring work.',
    verified: true, windows: [[14, 20]], days: WEEKDAYS, reviews: [4, 3, 4],
  },
  {
    key: 'imran', name: 'Imran Khan', phone: '9000000005', categories: ['AC Repair'],
    skills: ['ac repair', 'water leakage', 'ac servicing', 'gas refilling', 'drain pipe cleaning'],
    serviceAreas: ['vanasthalipuram', 'lb nagar', 'dilsukhnagar', 'hayathnagar'],
    basePrice: 700, experienceYears: 9, bio: 'AC technician for split and window units. Fixes water leakage and cooling problems.',
    verified: true, windows: [[9, 13], [14, 18]], days: ALL_DAYS, reviews: [5, 4, 5, 5],
  },
  {
    key: 'kiran', name: 'Kiran Kumar', phone: '9000000006', categories: ['AC Repair'],
    skills: ['ac installation', 'ac servicing', 'split ac repair'],
    serviceAreas: ['gachibowli', 'madhapur', 'kukatpally'],
    basePrice: 650, experienceYears: 5, bio: 'AC installation and yearly servicing.',
    verified: true, windows: [[9, 13], [14, 18]], days: ALL_DAYS, reviews: [4, 5],
  },
  {
    key: 'lakshmi', name: 'Lakshmi Devi', phone: '9000000007', categories: ['Cleaning'],
    skills: ['deep cleaning', 'kitchen cleaning', 'bathroom cleaning', 'sofa cleaning'],
    serviceAreas: ['vanasthalipuram', 'lb nagar', 'uppal', 'dilsukhnagar'],
    basePrice: 900, experienceYears: 7, bio: 'Deep cleaning team for homes and apartments.',
    verified: true, windows: [[9, 13]], days: ALL_DAYS, reviews: [5, 5, 5],
  },
  {
    key: 'prakash', name: 'Prakash Goud', phone: '9000000008', categories: ['Carpentry'],
    skills: ['furniture repair', 'door fitting', 'wardrobe installation', 'cabinet repair'],
    serviceAreas: ['uppal', 'hayathnagar', 'lb nagar'],
    basePrice: 500, experienceYears: 12, bio: 'Carpenter with 12 years of experience.',
    verified: true, windows: [[10, 14], [15, 19]], days: WEEKDAYS, reviews: [4, 4, 3, 4],
  },
  {
    key: 'farah', name: 'Farah Begum', phone: '9000000009', categories: ['Appliance Repair'],
    skills: ['washing machine repair', 'refrigerator repair', 'microwave repair', 'geyser repair'],
    serviceAreas: ['kukatpally', 'madhapur', 'gachibowli'],
    basePrice: 500, experienceYears: 6, bio: 'Home appliance repair. New on the platform.',
    verified: true, windows: [[9, 13], [14, 18]], days: ALL_DAYS, reviews: [],
  },
  {
    // not verified: use this one to demo the admin verify step
    key: 'naveen', name: 'Naveen Yadav', phone: '9000000010', categories: ['Plumbing'],
    skills: ['pipe repair', 'leak fixing'],
    serviceAreas: ['vanasthalipuram'],
    basePrice: 400, experienceYears: 2, bio: 'Waiting for verification.',
    verified: false, windows: [[9, 13]], days: ALL_DAYS, reviews: [],
  },
];

export const providerEmail = (p) => `${p.key}@${DEMO_DOMAIN}`;

export const JOBS = {
  Plumbing: ['Leaking pipe under the kitchen sink', 'Bathroom tap dripping and needs replacing', 'Blocked drain in the wash area', 'Water tank overflow valve not working'],
  Electrical: ['Fan not working and switch feels warm', 'Need two new light fittings in the hall', 'Switchboard tripping again and again', 'Wiring check after power fluctuations'],
  'AC Repair': ['AC is not cooling properly', 'Split AC leaking water indoors', 'Yearly AC servicing before summer', 'AC making a loud noise'],
  Cleaning: ['Full home deep cleaning before a festival', 'Kitchen deep cleaning with chimney', 'Bathroom cleaning and descaling', 'Sofa and carpet cleaning'],
  Carpentry: ['Wardrobe door hinge is broken', 'Need a main door lock and frame fixed', 'Kitchen cabinet drawer stuck', 'Bed frame is loose and creaking'],
  'Appliance Repair': ['Washing machine not draining', 'Refrigerator not cooling', 'Microwave stopped heating', 'Geyser not heating water'],
};

const COMMENTS = {
  5: ['Fixed quickly and cleaned up after', 'Very professional and on time', 'Excellent work, would hire again'],
  4: ['Good work, arrived slightly late', 'Solved the problem at a fair price'],
  3: ['Job done but took longer than expected'],
};
export const commentFor = (rating, i) => COMMENTS[rating][i % COMMENTS[rating].length];

export const jobDescription = (categoryName, i) => JOBS[categoryName][i % JOBS[categoryName].length];

// open slots for the next days, relative to `from`
export const buildSlots = (p, from = new Date()) => {
  const slots = [];
  for (const d of p.days) {
    for (const [h1, h2] of p.windows) {
      const start = new Date(from);
      start.setDate(start.getDate() + d);
      start.setHours(h1, 0, 0, 0);
      const end = new Date(start);
      end.setHours(h2, 0, 0, 0);
      slots.push({ start, end });
    }
  }
  return slots;
};

export const ratingStats = (p) => {
  if (p.reviews.length === 0) return { ratingAvg: 0, ratingCount: 0 };
  const avg = p.reviews.reduce((a, b) => a + b, 0) / p.reviews.length;
  return { ratingAvg: Math.round(avg * 10) / 10, ratingCount: p.reviews.length };
};

// fields for the Provider document (the seed adds `user`)
export const providerFields = (p, categoryIdByName, from = new Date()) => ({
  categories: p.categories.map((name) => categoryIdByName[name]),
  skills: p.skills,
  serviceAreas: p.serviceAreas,
  basePrice: p.basePrice,
  experienceYears: p.experienceYears,
  bio: p.bio,
  availability: buildSlots(p, from),
  isVerified: p.verified,
});

// one job that is already booked tomorrow at 10:00, so the ranking shows a busy provider
export const scheduledJob = {
  providerKey: 'imran',
  customerIndex: 1,
  category: 'AC Repair',
  description: 'Split AC leaking water indoors',
  location: 'vanasthalipuram',
  dayOffset: 1,
  hour: 10,
  hours: 1,
};

// requests waiting for quotes, or already quoted
export const sampleRequests = [
  {
    customerIndex: 0, category: 'AC Repair', location: 'Vanasthalipuram',
    description: 'My AC is leaking water inside the room and is not cooling properly',
    aiSkills: ['ac repair', 'water leakage'], urgency: 'medium', status: 'open', quotes: [],
  },
  {
    customerIndex: 0, category: 'Electrical', location: 'LB Nagar',
    description: 'Sparks and a burning smell coming from the main switchboard',
    aiSkills: ['switchboard repair', 'short circuit repair'], urgency: 'high', status: 'open', quotes: [],
  },
  {
    customerIndex: 2, category: 'Cleaning', location: 'Uppal',
    description: 'Need full deep cleaning of a 2BHK flat before guests arrive this weekend',
    aiSkills: ['deep cleaning', 'kitchen cleaning', 'bathroom cleaning'], urgency: 'low', status: 'open', quotes: [],
  },
  {
    customerIndex: 0, category: 'Plumbing', location: 'Vanasthalipuram',
    description: 'Kitchen tap is leaking water all day and the pipe below is wet',
    aiSkills: ['pipe repair', 'leak fixing'], urgency: 'medium', status: 'quoted',
    quotes: [
      { providerKey: 'ravi', price: 600, message: 'Can fix it tomorrow morning' },
      { providerKey: 'suresh', price: 500, message: 'Available in two days' },
    ],
  },
];