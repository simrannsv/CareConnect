import Provider from '../models/Provider.js';
import { ONE_HOUR, isWithinSlots, hasBookingConflict } from './availabilityService.js';

// total = 100
export const WEIGHTS = { skills: 40, area: 25, availability: 20, rating: 15 };

const norm = (s) => String(s || '').trim().toLowerCase();

// loose text match; the shorter text must be 3+ chars to count as "contained in"
const similar = (a, b) => {
  if (!a || !b) return false;
  if (a === b) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  return short.length >= 3 && long.includes(short);
};

const round1 = (n) => Math.round(n * 10) / 10;

// pure scoring: no database access, so it is easy to test and explain
export const scoreProvider = (provider, request, { busyAtPreferred = false, now = new Date() } = {}) => {
  const reasons = [];
  const concerns = [];

  // 1. skills (40)
  const need = (request.aiSkills || []).map(norm);
  const have = (provider.skills || []).map(norm);
  let skillRatio = 0.5; // request has no skills yet: neutral
  if (need.length > 0) {
    const matched = need.filter((n) => have.some((h) => similar(n, h)));
    skillRatio = matched.length / need.length;
    if (matched.length > 0) {
      reasons.push(`Matches ${matched.length} of ${need.length} skills needed: ${matched.join(', ')}`);
    } else {
      concerns.push('No listed skills match this problem');
    }
  }

  // 2. service area (25)
  const location = norm(request.location);
  const area = (provider.serviceAreas || []).map(norm).find((a) => similar(location, a));
  let areaRatio = 0;
  if (area) {
    areaRatio = 1;
    reasons.push(`Serves ${area}`);
  } else {
    concerns.push(`Does not list ${request.location} as a service area`);
  }

  // 3. availability (20)
  const futureSlots = (provider.availability || []).filter((s) => s.end > now);
  let availRatio = 0;
  let nextSlot = null;
  if (futureSlots.length > 0) {
    nextSlot = [...futureSlots].sort((a, b) => a.start - b.start)[0].start;
  }
  if (request.preferredTime) {
    const start = new Date(request.preferredTime);
    const end = new Date(start.getTime() + ONE_HOUR);
    if (isWithinSlots(futureSlots, start, end) && !busyAtPreferred) {
      availRatio = 1;
      reasons.push('Free at your preferred time');
    } else if (futureSlots.length > 0) {
      availRatio = 0.4;
      concerns.push('Not free at your preferred time, but has other open slots');
    } else {
      concerns.push('No open slots');
    }
  } else if (futureSlots.length > 0) {
    availRatio = 1;
    reasons.push('Has open slots available');
  } else {
    concerns.push('No open slots');
  }

  // 4. rating (15)
  let ratingRatio;
  if (!provider.ratingCount) {
    ratingRatio = 0.6; // new providers are not punished too hard
    reasons.push('New provider, no ratings yet');
  } else {
    ratingRatio = provider.ratingAvg / 5;
    reasons.push(`Rated ${provider.ratingAvg} from ${provider.ratingCount} review${provider.ratingCount === 1 ? '' : 's'}`);
  }

  const breakdown = {
    skills: round1(WEIGHTS.skills * skillRatio),
    area: round1(WEIGHTS.area * areaRatio),
    availability: round1(WEIGHTS.availability * availRatio),
    rating: round1(WEIGHTS.rating * ratingRatio),
  };
  const score = Math.round(Object.values(breakdown).reduce((a, b) => a + b, 0));

  return { score, breakdown, reasons, concerns, nextSlot };
};

// verified providers for the request's category, best match first
export const rankProviders = async (request, limit = 10) => {
  const filter = { isVerified: true };
  if (request.aiCategory) filter.categories = request.aiCategory;

  const providers = await Provider.find(filter)
    .populate('user', 'name')
    .populate('categories', 'name');

  const ranked = [];
  for (const p of providers) {
    let busyAtPreferred = false;
    if (request.preferredTime) {
      const start = new Date(request.preferredTime);
      busyAtPreferred = await hasBookingConflict(p._id, start, new Date(start.getTime() + ONE_HOUR));
    }
    ranked.push({ provider: p, ...scoreProvider(p, request, { busyAtPreferred }) });
  }

  ranked.sort(
    (a, b) =>
      b.score - a.score ||
      b.provider.ratingAvg - a.provider.ratingAvg ||
      a.provider.basePrice - b.provider.basePrice
  );

  return ranked.slice(0, limit).map(({ provider: p, ...rest }) => ({
    provider: {
      _id: p._id,
      name: p.user?.name,
      categories: (p.categories || []).map((c) => ({ _id: c._id, name: c.name })),
      skills: p.skills,
      serviceAreas: p.serviceAreas,
      basePrice: p.basePrice,
      experienceYears: p.experienceYears,
      bio: p.bio,
      ratingAvg: p.ratingAvg,
      ratingCount: p.ratingCount,
    },
    ...rest,
  }));
};