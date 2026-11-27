import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdAdd, MdClose } from 'react-icons/md';
import PageHeader from '../../components/shared/PageHeader';
import { resolveImageUrl } from '../../utils/imageUrl';
import '../Careers/Form.css';
import '../About/About.css';

const TABS = [
  { id: 'hero', label: 'Hero & Stats' },
  { id: 'philosophy', label: 'Our Philosophy Cards' },
  { id: 'ticker', label: 'Live News Ticker' },
  { id: 'careers', label: 'Careers Culture Cards' },
  { id: 'footer', label: 'Footer & Compliance' },
];

const EMPTY = {
  heroTitle: '',
  heroSubtitle: '',
  heroPrimaryCtaText: '',
  heroPrimaryCtaLink: '',
  heroSecondaryCtaText: '',
  heroStats: [],
  philosophyLabel: '',
  philosophyHeading: '',
  philosophyPillars: [],
  newsHeadlines: [],
  careersHeroEyebrow: '',
  careersHeroTitle: '',
  careersHeroSubtitle: '',
  careersHeroBadges: [],
  careersCultureEyebrow: '',
  careersCultureHeading: '',
  careersCulturePillars: [],
  footerTagline: '',
  footerHeadline: '',
  footerDescription: '',
  complianceStandards: [],
};

const SiteContent = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newBadge, setNewBadge] = useState('');
  const [newCompliance, setNewCompliance] = useState('');
  const [newHeadline, setNewHeadline] = useState({ tag: 'UPDATES', text: '', link: '/services', isActive: true });
  const [newPillar, setNewPillar] = useState({
    number: '',
    title: '',
    description: '',
    icon: 'group_work',
    footer: '',
    image: '',
    highlight: false,
    isActive: true,
  });
  const [newCareerCard, setNewCareerCard] = useState({
    number: '',
    title: '',
    description: '',
    footer: '',
    isActive: true,
  });

  useEffect(() => {
    axios.get('/api/site-content')
      .then((res) => setForm({ ...EMPTY, ...res.data }))
      .catch(() => toast.error('Failed to load site content'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, idx, key, value) => {
    setForm((prev) => {
      const updated = [...(prev[field] || [])];
      updated[idx] = { ...updated[idx], [key]: value };
      return { ...prev, [field]: updated };
    });
  };

  const removeFromArray = (field, idx) => {
    setForm((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== idx),
    }));
  };

  const handlePillarImageUpload = (idx) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (idx === 'new') {
        setNewPillar((prev) => ({ ...prev, image: reader.result }));
      } else {
        handleArrayChange('philosophyPillars', idx, 'image', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/site-content', form);
      toast.success('Site content saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;

  return (
    <div>
      <PageHeader
        title="Homepage & Static Sections"
        subtitle="Edit Hero metrics, Philosophy cards, News Ticker announcements, Careers Culture cards, and Footer details"
        showBack
      />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '9px 16px',
              borderRadius: 10,
              border: activeTab === t.id ? '1.5px solid #2563eb' : '1.5px solid #e2e8f0',
              background: activeTab === t.id ? '#eff6ff' : '#fff',
              color: activeTab === t.id ? '#1d4ed8' : '#475569',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        {activeTab === 'hero' && (
          <>
            <div className="form-section">
              <h3>Homepage Hero Banner</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Main Hero Title</label>
                  <input name="heroTitle" value={form.heroTitle} onChange={handleChange} placeholder="Navigate Your Digital Future." />
                </div>
                <div className="form-group full-width">
                  <label>Hero Subtitle</label>
                  <textarea name="heroSubtitle" value={form.heroSubtitle} onChange={handleChange} rows={2} />
                </div>
                <div className="form-group">
                  <label>Primary CTA Text</label>
                  <input name="heroPrimaryCtaText" value={form.heroPrimaryCtaText} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Primary CTA Link</label>
                  <input name="heroPrimaryCtaLink" value={form.heroPrimaryCtaLink} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Secondary CTA Text</label>
                  <input name="heroSecondaryCtaText" value={form.heroSecondaryCtaText} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Hero Metric Counters</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(form.heroStats || []).map((st, i) => (
                  <div key={i} className="principle-row">
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 90px 2fr', gap: 10 }}>
                      <input
                        type="number"
                        value={st.target}
                        onChange={(e) => handleArrayChange('heroStats', i, 'target', Number(e.target.value))}
                        placeholder="Number (e.g. 500)"
                        style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                      />
                      <input
                        value={st.suffix}
                        onChange={(e) => handleArrayChange('heroStats', i, 'suffix', e.target.value)}
                        placeholder="Suffix (+ / %)"
                        style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                      />
                      <input
                        value={st.label}
                        onChange={(e) => handleArrayChange('heroStats', i, 'label', e.target.value)}
                        placeholder="Label (e.g. PROJECTS)"
                        style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                    <button type="button" onClick={() => removeFromArray('heroStats', i)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 20, cursor: 'pointer' }}>
                      <MdClose />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'philosophy' && (
          <>
            <div className="form-section">
              <h3>Section Heading</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Eyebrow Label</label>
                  <input name="philosophyLabel" value={form.philosophyLabel} onChange={handleChange} />
                </div>
                <div className="form-group full-width">
                  <label>Section Heading</label>
                  <input name="philosophyHeading" value={form.philosophyHeading} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Philosophy Pillar Cards ({(form.philosophyPillars || []).length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 18 }}>
                {(form.philosophyPillars || []).map((p, i) => (
                  <div key={i} className="principle-row" style={{ alignItems: 'flex-start', padding: 14 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 110, flexShrink: 0 }}>
                      {p.image && (
                        <img src={resolveImageUrl(p.image)} alt={p.title} style={{ width: '100%', height: 68, objectFit: 'cover', borderRadius: 6 }} />
                      )}
                      <input type="file" id={`phil-img-${i}`} accept="image/*" onChange={handlePillarImageUpload(i)} style={{ display: 'none' }} />
                      <label htmlFor={`phil-img-${i}`} style={{ fontSize: 11.5, color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>
                        {p.image ? 'Change Photo' : 'Upload Photo'}
                      </label>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 130px', gap: 8 }}>
                        <input
                          value={p.number}
                          onChange={(e) => handleArrayChange('philosophyPillars', i, 'number', e.target.value)}
                          placeholder="01"
                          style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                        />
                        <input
                          value={p.title}
                          onChange={(e) => handleArrayChange('philosophyPillars', i, 'title', e.target.value)}
                          placeholder="Card Title"
                          style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13.5, fontWeight: 600 }}
                        />
                        <input
                          value={p.icon}
                          onChange={(e) => handleArrayChange('philosophyPillars', i, 'icon', e.target.value)}
                          placeholder="Icon name"
                          style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                        />
                      </div>
                      <textarea
                        value={p.description}
                        onChange={(e) => handleArrayChange('philosophyPillars', i, 'description', e.target.value)}
                        rows={2}
                        style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                      />
                      <div style={{ display: 'flex', gap: 18, alignItems: 'center', fontSize: 12.5 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input
                            type="checkbox"
                            checked={p.isActive !== false}
                            onChange={(e) => handleArrayChange('philosophyPillars', i, 'isActive', e.target.checked)}
                          />
                          Active
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input
                            type="checkbox"
                            checked={Boolean(p.highlight)}
                            onChange={(e) => handleArrayChange('philosophyPillars', i, 'highlight', e.target.checked)}
                          />
                          Highlight Card
                        </label>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeFromArray('philosophyPillars', i)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 20, cursor: 'pointer' }}>
                      <MdClose />
                    </button>
                  </div>
                ))}
              </div>

              <div className="principle-add-row" style={{ alignItems: 'flex-start' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 130px', gap: 8 }}>
                    <input
                      value={newPillar.number}
                      onChange={(e) => setNewPillar((p) => ({ ...p, number: e.target.value }))}
                      placeholder={`0${(form.philosophyPillars || []).length + 1}`}
                      style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                    />
                    <input
                      value={newPillar.title}
                      onChange={(e) => setNewPillar((p) => ({ ...p, title: e.target.value }))}
                      placeholder="New Philosophy Card Title..."
                      style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                    />
                    <input
                      value={newPillar.icon}
                      onChange={(e) => setNewPillar((p) => ({ ...p, icon: e.target.value }))}
                      placeholder="group_work"
                      style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                    />
                  </div>
                  <textarea
                    value={newPillar.description}
                    onChange={(e) => setNewPillar((p) => ({ ...p, description: e.target.value }))}
                    rows={2}
                    placeholder="Description..."
                    style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                  />
                  <div>
                    <input type="file" id="phil-img-new" accept="image/*" onChange={handlePillarImageUpload('new')} style={{ display: 'none' }} />
                    <label htmlFor="phil-img-new" style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>
                      {newPillar.image ? 'Image Selected (Change)' : 'Upload Card Image'}
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  className="tag-add-btn"
                  onClick={() => {
                    if (!newPillar.title.trim()) return;
                    const item = {
                      ...newPillar,
                      number: newPillar.number || `0${(form.philosophyPillars || []).length + 1}`,
                    };
                    setForm((prev) => ({ ...prev, philosophyPillars: [...(prev.philosophyPillars || []), item] }));
                    setNewPillar({ number: '', title: '', description: '', icon: 'group_work', footer: '', image: '', highlight: false, isActive: true });
                  }}
                >
                  <MdAdd />
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'ticker' && (
          <div className="form-section">
            <h3>Live Ticker Announcements ({(form.newsHeadlines || []).length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {(form.newsHeadlines || []).map((h, i) => (
                <div key={i} className="principle-row">
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '110px 1fr 180px 70px', gap: 8, alignItems: 'center' }}>
                    <input
                      value={h.tag}
                      onChange={(e) => handleArrayChange('newsHeadlines', i, 'tag', e.target.value)}
                      placeholder="TAG"
                      style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 12.5 }}
                    />
                    <input
                      value={h.text}
                      onChange={(e) => handleArrayChange('newsHeadlines', i, 'text', e.target.value)}
                      placeholder="Headline text"
                      style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                    />
                    <input
                      value={h.link}
                      onChange={(e) => handleArrayChange('newsHeadlines', i, 'link', e.target.value)}
                      placeholder="/services"
                      style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 12.5 }}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                      <input
                        type="checkbox"
                        checked={h.isActive !== false}
                        onChange={(e) => handleArrayChange('newsHeadlines', i, 'isActive', e.target.checked)}
                      />
                      Active
                    </label>
                  </div>
                  <button type="button" onClick={() => removeFromArray('newsHeadlines', i)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 20, cursor: 'pointer' }}>
                    <MdClose />
                  </button>
                </div>
              ))}
            </div>

            <div className="principle-add-row">
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '110px 1fr 180px', gap: 8 }}>
                <input
                  value={newHeadline.tag}
                  onChange={(e) => setNewHeadline((p) => ({ ...p, tag: e.target.value }))}
                  placeholder="TAG"
                  style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 12.5 }}
                />
                <input
                  value={newHeadline.text}
                  onChange={(e) => setNewHeadline((p) => ({ ...p, text: e.target.value }))}
                  placeholder="New ticker headline..."
                  style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                />
                <input
                  value={newHeadline.link}
                  onChange={(e) => setNewHeadline((p) => ({ ...p, link: e.target.value }))}
                  placeholder="/platforms"
                  style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 12.5 }}
                />
              </div>
              <button
                type="button"
                className="tag-add-btn"
                onClick={() => {
                  if (!newHeadline.text.trim()) return;
                  setForm((prev) => ({ ...prev, newsHeadlines: [...(prev.newsHeadlines || []), { ...newHeadline }] }));
                  setNewHeadline({ tag: 'UPDATES', text: '', link: '/services', isActive: true });
                }}
              >
                <MdAdd />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'careers' && (
          <>
            <div className="form-section">
              <h3>Careers Hero & Section Text</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Hero Eyebrow</label>
                  <input name="careersHeroEyebrow" value={form.careersHeroEyebrow} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Culture Section Heading</label>
                  <input name="careersCultureHeading" value={form.careersCultureHeading} onChange={handleChange} />
                </div>
                <div className="form-group full-width">
                  <label>Hero Headline</label>
                  <input name="careersHeroTitle" value={form.careersHeroTitle} onChange={handleChange} />
                </div>
                <div className="form-group full-width">
                  <label>Hero Subtitle</label>
                  <textarea name="careersHeroSubtitle" value={form.careersHeroSubtitle} onChange={handleChange} rows={2} />
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 6 }}>Hero Status Badges</label>
                <div className="tag-input-wrapper">
                  <input
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    placeholder="Add badge text..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (!newBadge.trim()) return;
                        setForm((p) => ({ ...p, careersHeroBadges: [...(p.careersHeroBadges || []), newBadge.trim()] }));
                        setNewBadge('');
                      }
                    }}
                  />
                  <button type="button" className="tag-add-btn" onClick={() => {
                    if (!newBadge.trim()) return;
                    setForm((p) => ({ ...p, careersHeroBadges: [...(p.careersHeroBadges || []), newBadge.trim()] }));
                    setNewBadge('');
                  }}>
                    <MdAdd />
                  </button>
                </div>
                <div className="tags-list">
                  {(form.careersHeroBadges || []).map((b, i) => (
                    <span key={i} className="tag">
                      {b} <button type="button" onClick={() => removeFromArray('careersHeroBadges', i)}><MdClose /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Culture Pillar Cards ({(form.careersCulturePillars || []).length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                {(form.careersCulturePillars || []).map((c, i) => (
                  <div key={i} className="principle-row" style={{ alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr', gap: 8 }}>
                        <input
                          value={c.number}
                          onChange={(e) => handleArrayChange('careersCulturePillars', i, 'number', e.target.value)}
                          placeholder="01"
                          style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                        />
                        <input
                          value={c.title}
                          onChange={(e) => handleArrayChange('careersCulturePillars', i, 'title', e.target.value)}
                          placeholder="Card Title"
                          style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13.5, fontWeight: 600 }}
                        />
                        <input
                          value={c.footer}
                          onChange={(e) => handleArrayChange('careersCulturePillars', i, 'footer', e.target.value)}
                          placeholder="Footer tag"
                          style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                        />
                      </div>
                      <textarea
                        value={c.description}
                        onChange={(e) => handleArrayChange('careersCulturePillars', i, 'description', e.target.value)}
                        rows={2}
                        style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                    <button type="button" onClick={() => removeFromArray('careersCulturePillars', i)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 20, cursor: 'pointer' }}>
                      <MdClose />
                    </button>
                  </div>
                ))}
              </div>

              <div className="principle-add-row" style={{ alignItems: 'flex-start' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr', gap: 8 }}>
                    <input
                      value={newCareerCard.number}
                      onChange={(e) => setNewCareerCard((p) => ({ ...p, number: e.target.value }))}
                      placeholder={`0${(form.careersCulturePillars || []).length + 1}`}
                      style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                    />
                    <input
                      value={newCareerCard.title}
                      onChange={(e) => setNewCareerCard((p) => ({ ...p, title: e.target.value }))}
                      placeholder="New Culture Card Title..."
                      style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                    />
                    <input
                      value={newCareerCard.footer}
                      onChange={(e) => setNewCareerCard((p) => ({ ...p, footer: e.target.value }))}
                      placeholder="Footer label"
                      style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                    />
                  </div>
                  <textarea
                    value={newCareerCard.description}
                    onChange={(e) => setNewCareerCard((p) => ({ ...p, description: e.target.value }))}
                    rows={2}
                    placeholder="Description..."
                    style={{ padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                  />
                </div>
                <button
                  type="button"
                  className="tag-add-btn"
                  onClick={() => {
                    if (!newCareerCard.title.trim()) return;
                    const item = {
                      ...newCareerCard,
                      number: newCareerCard.number || `0${(form.careersCulturePillars || []).length + 1}`,
                    };
                    setForm((prev) => ({ ...prev, careersCulturePillars: [...(prev.careersCulturePillars || []), item] }));
                    setNewCareerCard({ number: '', title: '', description: '', footer: '', isActive: true });
                  }}
                >
                  <MdAdd />
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'footer' && (
          <div className="form-section">
            <h3>Footer Messaging & Compliance Badges</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Brand Tagline</label>
                <input name="footerTagline" value={form.footerTagline} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Headquarters Subheadline</label>
                <input name="footerHeadline" value={form.footerHeadline} onChange={handleChange} />
              </div>
              <div className="form-group full-width">
                <label>Brand Description</label>
                <textarea name="footerDescription" value={form.footerDescription} onChange={handleChange} rows={3} />
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 6 }}>Standards & Compliance List</label>
              <div className="tag-input-wrapper">
                <input
                  value={newCompliance}
                  onChange={(e) => setNewCompliance(e.target.value)}
                  placeholder="Add compliance certification item..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (!newCompliance.trim()) return;
                      setForm((p) => ({ ...p, complianceStandards: [...(p.complianceStandards || []), newCompliance.trim()] }));
                      setNewCompliance('');
                    }
                  }}
                />
                <button type="button" className="tag-add-btn" onClick={() => {
                  if (!newCompliance.trim()) return;
                  setForm((p) => ({ ...p, complianceStandards: [...(p.complianceStandards || []), newCompliance.trim()] }));
                  setNewCompliance('');
                }}>
                  <MdAdd />
                </button>
              </div>
              <div className="tags-list">
                {(form.complianceStandards || []).map((c, i) => (
                  <span key={i} className="tag">
                    {c} <button type="button" onClick={() => removeFromArray('complianceStandards', i)}><MdClose /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary-form" disabled={saving}>
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteContent;
