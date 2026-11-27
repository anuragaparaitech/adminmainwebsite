const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema(
  {
    slug: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    homepageName: { type: String, default: '' },
    type: { type: String, default: '' },
    homepageTag: { type: String, default: '' },
    status: { type: String, default: 'OPERATIONAL' },
    icon: { type: String, default: 'hub' },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    problem: { type: String, default: '' },
    howWorks: { type: String, default: '' },
    users: { type: String, default: '' },
    technology: { type: String, default: '' },
    note: { type: String, default: '' },
    logo: { type: String, default: '' },
    image: { type: String, default: '' },
    url: { type: String, default: '' },
    techStack: [{ type: String }],
    features: [{ type: String }],
    benefits: [{ type: String }],
    useCases: [{ type: String }],
    showOnHomepage: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Platform', platformSchema);
