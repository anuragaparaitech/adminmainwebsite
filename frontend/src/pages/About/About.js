import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdApartment,
  MdVerifiedUser,
  MdDescription,
  MdGroups,
  MdContactPhone,
  MdChevronRight,
} from 'react-icons/md';
import './About.css';

const sections = [
  {
    path: '/about/company',
    icon: <MdApartment />,
    color: '#2563eb',
    title: 'About Company',
    subtitle: 'Vision, mission & institutional background',
  },
  {
    path: '/about/principles',
    icon: <MdVerifiedUser />,
    color: '#7c3aed',
    title: 'Company Principles',
    subtitle: 'Foundational engineering & delivery tenets',
  },
  {
    path: '/about/terms',
    icon: <MdDescription />,
    color: '#0891b2',
    title: 'Terms & Conditions',
    subtitle: 'Commercial SLAs, governance & policies',
  },
  {
    path: '/about/team',
    icon: <MdGroups />,
    color: '#059669',
    title: 'Our Team',
    subtitle: 'Cross-functional architecture & engineering pods',
  },
  {
    path: '/about/contact',
    icon: <MdContactPhone />,
    color: '#d97706',
    title: 'Contact Details',
    subtitle: 'Official headquarters, phone & emails',
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-hub">
      <div className="about-hub-header">
        <h1>About Aparaitech</h1>
        <p>Manage all public-facing company information from one place.</p>
        <span className="about-hub-badge">{sections.length} Sections</span>
      </div>

      <div className="about-hub-grid">
        {sections.map((s) => (
          <button key={s.path} className="about-hub-card" onClick={() => navigate(s.path)}>
            <div className="ahc-icon" style={{ background: s.color + '18', color: s.color }}>
              {s.icon}
            </div>
            <div className="ahc-text">
              <h3>{s.title}</h3>
              <p>{s.subtitle}</p>
            </div>
            <MdChevronRight className="ahc-arrow" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default About;
