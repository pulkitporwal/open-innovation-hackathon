import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'image'],
    required: true,
  },
  content: {
    title: String,
    body: String,
    src: String,
    alt: String,
    caption: String,
    theme: {
      type: String,
      default: 'Default'
    },
    layout: {
      type: String,
      default: 'Centered'
    }
  },
  order: {
    type: Number,
    required: true,
  },
});

const presentationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  slides: [slideSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
presentationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Presentation = mongoose.models.Presentation || mongoose.model('Presentation', presentationSchema); 