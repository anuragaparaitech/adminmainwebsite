const mongoose = require('mongoose');

const contactDetailsSchema = new mongoose.Schema(
  {
    // Contact Details
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    phone: { type: String, default: '' },
    altPhone: { type: String, default: '' },
    email: { type: String, default: '' },
    supportEmail: { type: String, default: '' },
    website: { type: String, default: '' },
    mapEmbedUrl: { type: String, default: '' },

    // Terms & Conditions
    termsTitle: { type: String, default: 'Terms & Conditions' },
    termsContent: { type: String, default: '' },
    termsLastUpdated: { type: Date },

    // Privacy Policy (bonus, common need)
    privacyTitle: { type: String, default: 'Privacy Policy' },
    privacyContent: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactDetails', contactDetailsSchema);
