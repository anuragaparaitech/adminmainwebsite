const mongoose = require('mongoose');

const dispatchSchema = new mongoose.Schema(
  {
    // Which tab this entry belongs to in the popup
    tab: {
      type: String,
      enum: ['launch', 'careers', 'consultation'],
      required: true,
    },
    // Label shown in the popup tab bar (e.g. "Launch", "Careers", "Consultation")
    tabLabel: { type: String, required: true, trim: true },

    // Left-side card (the icon tile on the dark panel)
    cardIcon: { type: String, default: '' },        // emoji or image URL
    cardLabel: { type: String, default: '' },        // e.g. "Product launch"

    // Right-side popup content
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    // Optional CTA button at the bottom
    ctaText: { type: String, default: '' },
    ctaUrl: { type: String, default: '' },

    // Badge / chip shown on the left panel (e.g. "DISPATCH 2026.Q2")
    badge: { type: String, default: '' },

    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dispatch', dispatchSchema);
