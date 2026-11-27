const express = require('express');
const router = express.Router();
const SiteContent = require('../models/SiteContent');
const { protect } = require('../middleware/auth');
const { DEFAULT_SITE_CONTENT } = require('../utils/seedDefaults');

router.get('/', async (req, res) => {
  try {
    let doc = await SiteContent.findOne();
    if (!doc) {
      doc = await SiteContent.create(DEFAULT_SITE_CONTENT);
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/', protect, async (req, res) => {
  try {
    let doc = await SiteContent.findOne();
    if (!doc) {
      doc = new SiteContent(req.body);
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
