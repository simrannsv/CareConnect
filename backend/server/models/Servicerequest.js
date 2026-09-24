import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true, lowercase: true },
    preferredTime: { type: Date },

    // filled by the AI classifier
    aiCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    aiSkills: [{ type: String, lowercase: true, trim: true }],
    urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },

    status: {
      type: String,
      enum: ['open', 'quoted', 'booked', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

export default mongoose.model('ServiceRequest', serviceRequestSchema);