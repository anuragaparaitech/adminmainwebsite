const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });

const Service = require('./models/Service');
const Platform = require('./models/Platform');
const Career = require('./models/Career');
const Collaboration = require('./models/Collaboration');
const TeamMember = require('./models/TeamMember');
const Dispatch = require('./models/Dispatch');
const AboutCompany = require('./models/AboutCompany');
const ContactDetails = require('./models/ContactDetails');
const SiteContent = require('./models/SiteContent');

const {
  DEFAULT_COLLABORATIONS,
  DEFAULT_TEAM_PODS,
  DEFAULT_ABOUT_COMPANY,
  DEFAULT_CONTACT_DETAILS,
  DEFAULT_DISPATCH_ITEMS,
  DEFAULT_SITE_CONTENT,
  HOMEPAGE_PLATFORM_META,
  HOMEPAGE_SERVICE_SLUGS,
} = require('./utils/seedDefaults');

function loadStaticWebsiteModules() {
  const candidates = [
    path.resolve(__dirname, '../../mainwebsite/src'),
    path.resolve(__dirname, '../../../mainwebsite/src'),
  ];
  const mainSrc = candidates.find((p) => fs.existsSync(p));
  if (!mainSrc) {
    return { rawServices: [], rawPlatforms: [], rawCareers: [] };
  }

  const { services: rawServices } = require(path.join(mainSrc, 'services/serviceDetails.js'));
  const { platforms: rawPlatforms } = require(path.join(mainSrc, 'data/platforms.js'));
  const { JOB_OPENINGS: rawCareers } = require(path.join(mainSrc, 'config/careersConfig.js'));
  return { rawServices, rawPlatforms, rawCareers };
}

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const { rawServices, rawPlatforms, rawCareers } = loadStaticWebsiteModules();

    // 1. Backfill / Seed Services without resetting user toggles or custom edits
    let servicesUpserted = 0;
    for (let idx = 0; idx < rawServices.length; idx++) {
      const s = rawServices[idx];
      const existing = await Service.findOne({ slug: s.slug });
      const showOnHomepage = HOMEPAGE_SERVICE_SLUGS.includes(s.slug);

      if (!existing) {
        await Service.create({
          slug: s.slug,
          title: s.title || s.cardTitle || '',
          cardTitle: s.cardTitle || s.title || '',
          shortDescription: s.shortDescription || '',
          heroDescription: s.heroDescription || '',
          description: s.overview || s.heroDescription || s.shortDescription || '',
          overview: s.overview || '',
          icon: s.icon || 'star',
          image: s.image || '',
          imageAlt: s.imageAlt || '',
          features: s.features || [],
          technologies: s.technologies || [],
          process: s.process || [],
          benefits: s.benefits || [],
          useCases: s.useCases || [],
          industryUseCases: s.industryUseCases || [],
          faqs: s.faqs || [],
          showOnHomepage,
          isActive: true,
          order: idx + 1,
        });
        servicesUpserted++;
      } else {
        let changed = false;
        const fill = (key, val) => {
          const cur = existing[key];
          const isEmpty =
            cur === undefined ||
            cur === null ||
            cur === '' ||
            (Array.isArray(cur) && cur.length === 0);
          if (isEmpty && val !== undefined) {
            existing[key] = val;
            changed = true;
          }
        };
        fill('cardTitle', s.cardTitle || s.title);
        fill('heroDescription', s.heroDescription);
        fill('overview', s.overview);
        fill('imageAlt', s.imageAlt);
        fill('technologies', s.technologies || []);
        fill('process', s.process || []);
        fill('benefits', s.benefits || []);
        fill('useCases', s.useCases || []);
        fill('industryUseCases', s.industryUseCases || []);
        fill('faqs', s.faqs || []);
        if (existing.showOnHomepage === undefined || existing.showOnHomepage === false) {
          if (showOnHomepage) {
            existing.showOnHomepage = true;
            changed = true;
          }
        }
        if (changed) {
          await existing.save();
          servicesUpserted++;
        }
      }
    }
    console.log(`Services synced (${servicesUpserted} updated/created)`);

    // 2. Backfill / Seed Platforms without resetting user toggles or custom edits
    let platformsUpserted = 0;
    for (let idx = 0; idx < rawPlatforms.length; idx++) {
      const p = rawPlatforms[idx];
      const existing = await Platform.findOne({ slug: p.slug });
      const meta = HOMEPAGE_PLATFORM_META[p.slug] || {};

      if (!existing) {
        await Platform.create({
          slug: p.slug,
          name: p.name || '',
          homepageName: meta.homepageName || '',
          type: p.type || '',
          homepageTag: meta.homepageTag || '',
          status: meta.status || 'OPERATIONAL',
          icon: p.icon || 'hub',
          tagline: p.tagline || '',
          shortDescription: meta.homepageDescription || p.tagline || p.description || '',
          description: p.purpose || p.description || '',
          problem: p.problem || '',
          howWorks: p.howWorks || '',
          users: p.users || '',
          technology: p.technology || '',
          note: p.note || '',
          logo: p.image || '',
          image: meta.localImage || p.image || '',
          url: p.domain || '',
          techStack: p.technology ? [p.technology] : [],
          features: p.features || [],
          benefits: p.benefits || [],
          useCases: p.useCases || [],
          showOnHomepage: Boolean(meta.showOnHomepage),
          isActive: true,
          order: idx + 1,
        });
        platformsUpserted++;
      } else {
        let changed = false;
        const fill = (key, val) => {
          const cur = existing[key];
          const isEmpty =
            cur === undefined ||
            cur === null ||
            cur === '' ||
            (Array.isArray(cur) && cur.length === 0);
          if (isEmpty && val !== undefined) {
            existing[key] = val;
            changed = true;
          }
        };
        fill('type', p.type);
        fill('tagline', p.tagline);
        fill('icon', p.icon);
        fill('homepageName', meta.homepageName);
        fill('homepageTag', meta.homepageTag);
        fill('status', meta.status || 'OPERATIONAL');
        fill('problem', p.problem);
        fill('howWorks', p.howWorks);
        fill('users', p.users);
        fill('technology', p.technology);
        fill('note', p.note);
        fill('benefits', p.benefits || []);
        fill('useCases', p.useCases || []);
        fill('image', existing.logo || meta.localImage || p.image);
        if (!existing.showOnHomepage && meta.showOnHomepage) {
          existing.showOnHomepage = true;
          changed = true;
        }
        if (changed) {
          await existing.save();
          platformsUpserted++;
        }
      }
    }
    console.log(`Platforms synced (${platformsUpserted} updated/created)`);

    // 3. Seed missing Careers by title
    let careersAdded = 0;
    for (const c of rawCareers) {
      const existing = await Career.findOne({ title: c.title });
      if (!existing) {
        await Career.create({
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
        });
        careersAdded++;
      }
    }
    console.log(`Careers synced (${careersAdded} added)`);

    // 4. Seed Collaborations by partnerName
    let collabsAdded = 0;
    for (const col of DEFAULT_COLLABORATIONS) {
      const existing = await Collaboration.findOne({ partnerName: col.partnerName });
      if (!existing) {
        await Collaboration.create(col);
        collabsAdded++;
      }
    }
    console.log(`Collaborations synced (${collabsAdded} added)`);

    // 5. Seed Team Pods by name
    let teamsAdded = 0;
    for (const pod of DEFAULT_TEAM_PODS) {
      const existing = await TeamMember.findOne({ name: pod.name });
      if (!existing) {
        await TeamMember.create(pod);
        teamsAdded++;
      }
    }
    console.log(`Team pods synced (${teamsAdded} added)`);

    // 6. Seed Dispatch Popup Tabs by tab key
    let dispatchAdded = 0;
    for (const item of DEFAULT_DISPATCH_ITEMS) {
      const existing = await Dispatch.findOne({ tab: item.tab });
      if (!existing) {
        await Dispatch.create(item);
        dispatchAdded++;
      }
    }
    console.log(`Dispatch tabs synced (${dispatchAdded} added)`);

    // 7. Fill empty fields in AboutCompany singleton
    let about = await AboutCompany.findOne();
    if (!about) {
      about = await AboutCompany.create(DEFAULT_ABOUT_COMPANY);
      console.log('AboutCompany created with defaults');
    } else {
      let changed = false;
      for (const [key, val] of Object.entries(DEFAULT_ABOUT_COMPANY)) {
        const cur = about[key];
        const isEmpty =
          cur === undefined ||
          cur === null ||
          cur === '' ||
          (key === 'companyName' && cur === 'Aparaitech') ||
          (Array.isArray(cur) && cur.length === 0);
        if (isEmpty) {
          about[key] = val;
          changed = true;
        }
      }
      if (changed) {
        await about.save();
        console.log('AboutCompany empty fields backfilled');
      }
    }

    // 8. Fill empty fields in ContactDetails singleton
    let contact = await ContactDetails.findOne();
    if (!contact) {
      contact = await ContactDetails.create(DEFAULT_CONTACT_DETAILS);
      console.log('ContactDetails created with defaults');
    } else {
      let changed = false;
      for (const [key, val] of Object.entries(DEFAULT_CONTACT_DETAILS)) {
        const cur = contact[key];
        const isEmpty =
          cur === undefined ||
          cur === null ||
          cur === '' ||
          (Array.isArray(cur) && cur.length === 0);
        if (isEmpty) {
          contact[key] = val;
          changed = true;
        }
      }
      if (changed) {
        await contact.save();
        console.log('ContactDetails empty fields backfilled');
      }
    }

    // 9. Fill/create SiteContent singleton
    let siteContent = await SiteContent.findOne();
    if (!siteContent) {
      siteContent = await SiteContent.create(DEFAULT_SITE_CONTENT);
      console.log('SiteContent created with defaults');
    } else {
      let changed = false;
      for (const [key, val] of Object.entries(DEFAULT_SITE_CONTENT)) {
        const cur = siteContent[key];
        const isEmpty =
          cur === undefined ||
          cur === null ||
          cur === '' ||
          (Array.isArray(cur) && cur.length === 0);
        if (isEmpty) {
          siteContent[key] = val;
          changed = true;
        }
      }
      if (changed) {
        await siteContent.save();
        console.log('SiteContent empty fields backfilled');
      }
    }

    console.log('Website seed sync finished successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedData();
