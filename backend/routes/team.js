const express = require('express');
const router = express.Router();
const TeamPod = require('../models/TeamMember');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const pods = await TeamPod.find().sort({ order: 1, createdAt: 1 });
    res.json(pods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pod = await TeamPod.findById(req.params.id);
    if (!pod) return res.status(404).json({ message: 'Team pod not found' });
    res.json(pod);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const pod = new TeamPod(req.body);
    const saved = await pod.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await TeamPod.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Team pod not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const pod = await TeamPod.findByIdAndDelete(req.params.id);
    if (!pod) return res.status(404).json({ message: 'Team pod not found' });
    res.json({ message: 'Team pod deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
