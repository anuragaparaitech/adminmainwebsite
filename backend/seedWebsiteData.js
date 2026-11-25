const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const Service = require('./models/Service');
const Platform = require('./models/Platform');
const Career = require('./models/Career');

const mainwebsitePath = path.resolve(__dirname, '../../../mainwebsite/src');
const { services: rawServices } = require(path.join(mainwebsitePath, 'services/serviceDetails.js'));
const { platforms: rawPlatforms } = require(path.join(mainwebsitePath, 'data/platforms.js'));
const { JOB_OPENINGS: rawCareers } = require(path.join(mainwebsitePath, 'config/careersConfig.js'));

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Services
    await Service.deleteMany({});
    const servicesToInsert = rawServices.map((s, idx) => ({
      slug: s.slug || '',
      title: s.title || s.cardTitle || '',
      shortDescription: s.shortDescription || '',
      description: s.overview || s.heroDescription || s.shortDescription || '',
      icon: s.icon || 'star',
      image: s.image || '',
      features: s.features || [],
      isActive: true,
      order: idx + 1,
    }));
    await Service.insertMany(servicesToInsert);
    console.log(`Services seeded: ${servicesToInsert.length}`);

    // Platforms
    await Platform.deleteMany({});
    const platformsToInsert = rawPlatforms.map((p, idx) => ({
      slug: p.slug || '',
      name: p.name || '',
      shortDescription: p.tagline || p.description || '',
      description: p.purpose || p.description || '',
      logo: p.image || '',
      url: p.domain || '',
      techStack: p.technology ? [p.technology] : [],
      features: p.features || [],
      isActive: true,
      order: idx + 1,
    }));
    await Platform.insertMany(platformsToInsert);
    console.log(`Platforms seeded: ${platformsToInsert.length}`);

    // Careers
    await Career.deleteMany({});
    const careersToInsert = rawCareers.map((c) => ({
      title: c.title || '',
      department: c.department || '',
      location: c.location || '',
      type: c.type || 'Full-time',
      experience: c.experience || '',
      tags: c.tags || [],
      description: c.description || '',
      requirements: c.requirements || [],
      responsibilities: c.responsibilities || [],
      salaryRange: '',
      isActive: true,
    }));
    await Career.insertMany(careersToInsert);
    console.log(`Careers seeded: ${careersToInsert.length}`);

    console.log('Initial data seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedData();
