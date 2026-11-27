const express = require('express');
const router = express.Router();
const ContactDetails = require('../models/ContactDetails');
const { protect } = require('../middleware/auth');
const { DEFAULT_CONTACT_DETAILS } = require('../utils/seedDefaults');

router.get('/', async (req, res) => {
  try {
    let doc = await ContactDetails.findOne();
    if (!doc) {
      doc = await ContactDetails.create(DEFAULT_CONTACT_DETAILS);
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT – upsert (protected)
router.put('/', protect, async (req, res) => {
  try {
    let doc = await ContactDetails.findOne();
    if (!doc) {
      doc = new ContactDetails(req.body);
    } else {
      Object.assign(doc, req.body);
    }
    const saved = await doc.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
