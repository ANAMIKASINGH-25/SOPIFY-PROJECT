const { Schema, model } = require('../connection');

const reviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  targetId: { type: Schema.Types.ObjectId, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('reviews', reviewSchema);