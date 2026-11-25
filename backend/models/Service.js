const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    slug: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    cardTitle: { type: String, default: '' },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    overview: { type: String, default: '' },
    icon: { type: String, default: 'cloud' },
    image: { type: String, default: '' },
    features: [{ type: String }],
    technologies: [{ type: String }],
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
