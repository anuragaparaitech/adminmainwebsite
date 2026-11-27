const mongoose = require('mongoose');

const principleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, default: 'verified' },
  description: { type: String, default: '' },
});

const gallerySlideSchema = new mongoose.Schema({
  src: { type: String, default: '' },
  tag: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
});

const aboutCompanySchema = new mongoose.Schema(
  {
    companyName: { type: String, default: 'Aparaitech Software' },
    tagline: { type: String, default: '' },
    heroTitle: { type: String, default: '' },
    heroSubtitle: { type: String, default: '' },
    vision: { type: String, default: '' },
    mission: { type: String, default: '' },
    overview: { type: String, default: '' },
    foundedYear: { type: String, default: '' },
    headquartersLocation: { type: String, default: '' },
    logo: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    capabilities: [{ type: String }],
    gallerySlides: [gallerySlideSchema],
    principles: [principleSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('AboutCompany', aboutCompanySchema);
