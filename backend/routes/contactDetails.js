const express = require('express');
const router = express.Router();
const ContactDetails = require('../models/ContactDetails');
const { protect } = require('../middleware/auth');

// GET – returns the single document (creates default if none exists)
router.get('/', async (req, res) => {
  try {
    let doc = await ContactDetails.findOne();
    if (!doc) {
      doc = await ContactDetails.create({});
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
