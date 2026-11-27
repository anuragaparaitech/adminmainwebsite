const express = require('express');
const router = express.Router();
const AboutCompany = require('../models/AboutCompany');
const { protect } = require('../middleware/auth');
const { DEFAULT_ABOUT_COMPANY } = require('../utils/seedDefaults');

router.get('/', async (req, res) => {
  try {
    let doc = await AboutCompany.findOne();
    if (!doc) {
      doc = await AboutCompany.create(DEFAULT_ABOUT_COMPANY);
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT – upsert the single document (protected)
router.put('/', protect, async (req, res) => {
  try {
    let doc = await AboutCompany.findOne();
    if (!doc) {
      doc = new AboutCompany(req.body);
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
