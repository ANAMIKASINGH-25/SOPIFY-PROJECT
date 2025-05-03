const { Schema, model } = require('../connection');

const feedbackSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  sopId: {
    type: Schema.Types.ObjectId,
    ref: 'SOP', 
    required: false
  },
  comment: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('Feedback', feedbackSchema);