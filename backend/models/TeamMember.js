const mongoose = require('mongoose');

// Each document represents a team pod/group shown on the website
// e.g. "Executive Architecture Pod", "Cloud Infrastructure & DevOps Team"
const teamPodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },        // e.g. "Executive Architecture Pod"
    badge: { type: String, default: '' },                      // e.g. "PRINCIPAL SYSTEMS & ENTERPRISE AI ARCHITECTS"
    description: { type: String, required: true },             // paragraph under the card title
    coverImage: { type: String, default: '' },                 // wide cover photo (base64 or URL)
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TeamMember', teamPodSchema);
