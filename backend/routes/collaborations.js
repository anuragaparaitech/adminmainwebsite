const express = require('express');
const router = express.Router();
const Collaboration = require('../models/Collaboration');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const collaborations = await Collaboration.find().sort({ order: 1, createdAt: -1 });
    res.json(collaborations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id);
    if (!collaboration) return res.status(404).json({ message: 'Collaboration not found' });
    res.json(collaboration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const collaboration = new Collaboration(req.body);
    const saved = await collaboration.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Collaboration.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Collaboration not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const collaboration = await Collaboration.findByIdAndDelete(req.params.id);
    if (!collaboration) return res.status(404).json({ message: 'Collaboration not found' });
    res.json({ message: 'Collaboration deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
