import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
    quote: { type: mongoose.Schema.Types.ObjectId, ref: 'Quote', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },

    start: { type: Date, required: true },
    end: { type: Date, required: true },

    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    notes: { type: String, trim: true },
    customerConfirmed: { type: Boolean, default: false },

    disputeStatus: { type: String, enum: ['none', 'open', 'resolved'], default: 'none' },
    disputeReason: { type: String, trim: true },
    disputeResolution: { type: String, trim: true },
  },
  { timestamps: true }
);

bookingSchema.pre('validate', function () {
  if (this.start && this.end && this.end <= this.start) {
    this.invalidate('end', 'end must be after start');
  }
});

// used by the overlap check
bookingSchema.index({ provider: 1, start: 1, end: 1 });

export default mongoose.model('Booking', bookingSchema);