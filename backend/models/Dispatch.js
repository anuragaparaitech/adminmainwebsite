const mongoose = require('mongoose');

const dispatchRoleSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  meta: { type: String, default: '' },
  badge: { type: String, default: '' },
});

const dispatchSchema = new mongoose.Schema(
  {
    tab: {
      type: String,
      required: true,
      trim: true,
    },
    tabLabel: { type: String, required: true, trim: true },
    cardIcon: { type: String, default: '' },
    cardLabel: { type: String, default: '' },
    footerTag: { type: String, default: 'PRODUCT BRIEFS' },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    roles: [dispatchRoleSchema],
    pointsTitle: { type: String, default: '' },
    points: [{ type: String }],
    ctaText: { type: String, default: '' },
    ctaUrl: { type: String, default: '' },
    dismissLabel: { type: String, default: 'Close' },
    badge: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dispatch', dispatchSchema);
