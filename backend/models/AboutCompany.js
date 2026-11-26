const mongoose = require('mongoose');

const principleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
});

const aboutCompanySchema = new mongoose.Schema(
  {
    // About Company section
    companyName: { type: String, default: 'Aparaitech' },
    tagline: { type: String, default: '' },
    vision: { type: String, default: '' },
    mission: { type: String, default: '' },
    overview: { type: String, default: '' },
    foundedYear: { type: String, default: '' },
    headquartersLocation: { type: String, default: '' },
    logo: { type: String, default: '' },
    coverImage: { type: String, default: '' },

    // Company Principles section
    principles: [principleSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('AboutCompany', aboutCompanySchema);
