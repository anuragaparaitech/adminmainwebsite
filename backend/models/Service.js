const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    slug: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    cardTitle: { type: String, default: '' },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    heroDescription: { type: String, default: '' },
    overview: { type: String, default: '' },
    icon: { type: String, default: 'cloud' },
    image: { type: String, default: '' },
    imageAlt: { type: String, default: '' },
    features: [{ type: String }],
    technologies: [{ type: String }],
    process: [[{ type: String }]],
    benefits: [[{ type: String }]],
    useCases: [{ type: String }],
    industryUseCases: [
      {
        industry: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
    faqs: [[{ type: String }]],
    showOnHomepage: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
