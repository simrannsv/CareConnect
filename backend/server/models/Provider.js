import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    skills: [{ type: String, lowercase: true, trim: true }],
    serviceAreas: [{ type: String, lowercase: true, trim: true }],
    basePrice: { type: Number, min: 0, default: 0 },
    experienceYears: { type: Number, min: 0, default: 0 },
    bio: { type: String, trim: true },
    // open slots the provider offers; bookings must fall inside these
    availability: [
      {
        start: { type: Date, required: true },
        end: { type: Date, required: true },
      },
    ],
    isVerified: { type: Boolean, default: false },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Provider', providerSchema);