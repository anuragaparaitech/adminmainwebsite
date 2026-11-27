const mongoose = require('mongoose');

const heroStatSchema = new mongoose.Schema({
  target: { type: Number, default: 0 },
  suffix: { type: String, default: '+' },
  label: { type: String, default: '' },
});

const philosophyPillarSchema = new mongoose.Schema({
  number: { type: String, default: '01' },
  image: { type: String, default: '' },
  alt: { type: String, default: '' },
  icon: { type: String, default: 'group_work' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  footer: { type: String, default: '' },
  highlight: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

const newsHeadlineSchema = new mongoose.Schema({
  text: { type: String, required: true },
  link: { type: String, default: '/' },
  tag: { type: String, default: 'UPDATES' },
  isActive: { type: Boolean, default: true },
});

const careerCulturePillarSchema = new mongoose.Schema({
  number: { type: String, default: '01' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  footer: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
});

const siteContentSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: 'Navigate Your Digital Future.' },
    heroSubtitle: {
      type: String,
      default: 'From custom software to scalable SaaS platforms, we build the digital infrastructure that powers global businesses.',
    },
    heroPrimaryCtaText: { type: String, default: 'Explore Our Platforms' },
    heroPrimaryCtaLink: { type: String, default: '/platforms' },
    heroSecondaryCtaText: { type: String, default: 'Customer Enquiry' },
    heroStats: [heroStatSchema],

    philosophyLabel: { type: String, default: 'OUR PHILOSOPHY' },
    philosophyHeading: {
      type: String,
      default: 'We Believe Technology Should Drive Your Business, Not Slow It Down.',
    },
    philosophyPillars: [philosophyPillarSchema],

    newsHeadlines: [newsHeadlineSchema],

    careersHeroEyebrow: { type: String, default: 'CAREERS AT APARAITECH' },
    careersHeroTitle: {
      type: String,
      default: 'Engineering the Core Systems That Power Enterprise Software.',
    },
    careersHeroSubtitle: {
      type: String,
      default: 'Join a high-assurance team of engineers, researchers, and system designers building proprietary enterprise SaaS, distributed cloud backbones, and applied AI inference engines.',
    },
    careersHeroBadges: [{ type: String }],
    careersCultureEyebrow: { type: String, default: 'OUR ENGINEERING PRINCIPLES' },
    careersCultureHeading: {
      type: String,
      default: 'Why Build Your Career at AparaiTech?',
    },
    careersCulturePillars: [careerCulturePillarSchema],

    footerTagline: { type: String, default: 'Enterprise Technology Partner' },
    footerHeadline: {
      type: String,
      default: 'Enterprise AI Systems • Cloud Platforms • Mission-Critical Software Engineering',
    },
    footerDescription: {
      type: String,
      default: 'Global enterprise engineering partner. Architecting scalable AI-native software platforms, autonomous agents, and resilient cloud architectures.',
    },
    complianceStandards: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteContent', siteContentSchema);
