const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema(
  {
    slug: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, default: '' },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    logo: { type: String, default: '' },
    image: { type: String, default: '' },
    url: { type: String, default: '' },
    techStack: [{ type: String }],
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Platform', platformSchema);
