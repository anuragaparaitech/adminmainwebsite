const mongoose = require('mongoose');

const collaborationSchema = new mongoose.Schema(
  {
    partnerName: { type: String, required: true, trim: true },
    institution: { type: String, default: '', trim: true },
    category: { type: String, default: 'Academic MoU', trim: true },
    date: { type: String, default: '' },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    logo: { type: String, default: '' },
    image: { type: String, default: '' },
    website: { type: String, default: '' },
    type: {
      type: String,
      default: 'Business',
    },
    startDate: { type: Date },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Collaboration', collaborationSchema);
