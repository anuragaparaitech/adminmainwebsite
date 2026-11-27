const mongoose = require('mongoose');

const termsArticleSchema = new mongoose.Schema({
  number: { type: String, default: '' },
  title: { type: String, required: true },
  content: { type: String, default: '' },
});

const contactDetailsSchema = new mongoose.Schema(
  {
    companyLabel: { type: String, default: 'Aparaitech Software' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    phone: { type: String, default: '' },
    altPhone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    email: { type: String, default: '' },
    altEmail: { type: String, default: '' },
    supportEmail: { type: String, default: '' },
    hrEmail: { type: String, default: '' },
    website: { type: String, default: '' },
    businessHours: { type: String, default: '' },
    mapEmbedUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },

    termsTitle: { type: String, default: 'Terms & Conditions' },
    termsSubtitle: { type: String, default: '' },
    termsDocCode: { type: String, default: '' },
    termsEffectiveDate: { type: String, default: '' },
    termsJurisdiction: { type: String, default: '' },
    termsLegalEmail: { type: String, default: '' },
    termsArticles: [termsArticleSchema],
    termsContent: { type: String, default: '' },
    termsLastUpdated: { type: Date },

    privacyTitle: { type: String, default: 'Privacy Policy' },
    privacyContent: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactDetails', contactDetailsSchema);
