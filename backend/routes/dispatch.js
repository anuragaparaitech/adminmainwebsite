const express = require('express');
const router = express.Router();
const Dispatch = require('../models/Dispatch');
const { protect } = require('../middleware/auth');

// GET all dispatch entries (public – used by main website)
router.get('/', async (req, res) => {
  try {
    const items = await Dispatch.find().sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single dispatch entry
router.get('/:id', async (req, res) => {
  try {
    const item = await Dispatch.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Dispatch item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create (protected)
router.post('/', protect, async (req, res) => {
  try {
    const item = new Dispatch(req.body);
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Dispatch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Dispatch item not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Dispatch.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Dispatch item not found' });
    res.json({ message: 'Dispatch item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
