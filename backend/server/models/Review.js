import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

// keep the provider's rating in sync (feeds the ranking)
reviewSchema.statics.updateProviderRating = async function (providerId) {
  const [stats] = await this.aggregate([
    { $match: { provider: providerId } },
    { $group: { _id: '$provider', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await mongoose.model('Provider').findByIdAndUpdate(providerId, {
    ratingAvg: stats ? Math.round(stats.avg * 10) / 10 : 0,
    ratingCount: stats ? stats.count : 0,
  });
};

reviewSchema.post('save', function () {
  return this.constructor.updateProviderRating(this.provider);
});

export default mongoose.model('Review', reviewSchema);