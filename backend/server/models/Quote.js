import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    price: { type: Number, required: true, min: 0 },
    message: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

// one quote per provider per request
quoteSchema.index({ request: 1, provider: 1 }, { unique: true });

export default mongoose.model('Quote', quoteSchema);