import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdAdd, MdClose, MdDragIndicator } from 'react-icons/md';
import PageHeader from '../../components/shared/PageHeader';
import { resolveImageUrl } from '../../utils/imageUrl';
import '../Careers/Form.css';
import './About.css';

const EMPTY = {
  companyName: '',
  tagline: '',
  heroTitle: '',
  heroSubtitle: '',
  vision: '',
  mission: '',
  overview: '',
  foundedYear: '',
  headquartersLocation: '',
  logo: '',
  coverImage: '',
  capabilities: [],
  gallerySlides: [],
  principles: [],
};

const AboutCompanyEdit = () => {
  const location = useLocation();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newCap, setNewCap] = useState('');
  const [newPrinciple, setNewPrinciple] = useState({ title: '', icon: 'verified', description: '' });
  const [newSlide, setNewSlide] = useState({ src: '', tag: '', title: '', description: '' });

  useEffect(() => {
    axios.get('/api/about-company')
      .then((res) => setForm({
        ...EMPTY,
        ...res.data,
        capabilities: res.data.capabilities || [],
        gallerySlides: res.data.gallerySlides || [],
        principles: res.data.principles || [],
      }))
      .catch(() => toast.error('Failed to load company info'))
      .finally(() => {
        setLoading(false);
        if (location.pathname.includes('principles')) {
          setTimeout(() => {
            document.getElementById('principles-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 120);
        }
      });
  }, [location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (field) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setForm((prev) => ({ ...prev, [field]: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSlideImageUpload = (idx) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (idx === 'new') {
        setNewSlide((prev) => ({ ...prev, src: reader.result }));
      } else {
        setForm((prev) => {
          const updated = [...prev.gallerySlides];
          updated[idx] = { ...updated[idx], src: reader.result };
          return { ...prev, gallerySlides: updated };
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const addCap = () => {
    if (!newCap.trim()) return;
    setForm((prev) => ({ ...prev, capabilities: [...prev.capabilities, newCap.trim()] }));
    setNewCap('');
  };

  const removeCap = (idx) => {
    setForm((prev) => ({ ...prev, capabilities: prev.capabilities.filter((_, i) => i !== idx) }));
  };

  const addPrinciple = () => {
    if (!newPrinciple.title.trim()) return;
    setForm((prev) => ({
      ...prev,
      principles: [...prev.principles, { ...newPrinciple }],
    }));
    setNewPrinciple({ title: '', icon: 'verified', description: '' });
  };

  const removePrinciple = (i) => {
    setForm((prev) => ({
      ...prev,
      principles: prev.principles.filter((_, idx) => idx !== i),
    }));
  };

  const updatePrinciple = (i, field, value) => {
    setForm((prev) => {
      const updated = [...prev.principles];
      updated[i] = { ...updated[i], [field]: value };
      return { ...prev, principles: updated };
    });
  };

  const addSlide = () => {
    if (!newSlide.title.trim()) return;
    setForm((prev) => ({ ...prev, gallerySlides: [...prev.gallerySlides, { ...newSlide }] }));
    setNewSlide({ src: '', tag: '', title: '', description: '' });
  };

  const removeSlide = (i) => {
    setForm((prev) => ({ ...prev, gallerySlides: prev.gallerySlides.filter((_, idx) => idx !== i) }));
  };

  const updateSlide = (i, field, value) => {
    setForm((prev) => {
      const updated = [...prev.gallerySlides];
      updated[i] = { ...updated[i], [field]: value };
      return { ...prev, gallerySlides: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/about-company', form);
      toast.success('Company info saved!');
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
        title="About Company & Principles"
        subtitle="Edit About Aparaitech hero, overview, vision, mission, capabilities, gallery, and principles"
        showBack
      />

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-section">
          <h3>Company Information & Hero</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Company Name</label>
              <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Aparaitech Software" />
            </div>
            <div className="form-group">
              <label>Founded Year</label>
              <input name="foundedYear" value={form.foundedYear} onChange={handleChange} placeholder="e.g. 2021" />
            </div>
            <div className="form-group">
              <label>Headquarters Location</label>
              <input name="headquartersLocation" value={form.headquartersLocation} onChange={handleChange} placeholder="e.g. Pune, Maharashtra, India" />
            </div>
            <div className="form-group">
              <label>Tagline</label>
              <input name="tagline" value={form.tagline} onChange={handleChange} placeholder="Short marketing tagline" />
            </div>
            <div className="form-group full-width">
              <label>About Page Hero Title</label>
              <input name="heroTitle" value={form.heroTitle} onChange={handleChange} placeholder="Enterprise Engineering for Modern Operations." />
            </div>
            <div className="form-group full-width">
              <label>About Page Hero Subtitle</label>
              <textarea name="heroSubtitle" value={form.heroSubtitle} onChange={handleChange} rows={2} placeholder="Introductory banner description..." />
            </div>
            <div className="form-group full-width">
              <label>Vision</label>
              <textarea name="vision" value={form.vision} onChange={handleChange} rows={3} placeholder="Long-term company vision..." />
            </div>
            <div className="form-group full-width">
              <label>Mission</label>
              <textarea name="mission" value={form.mission} onChange={handleChange} rows={3} placeholder="Core mission statement..." />
            </div>
            <div className="form-group full-width">
              <label>Company Overview</label>
              <textarea name="overview" value={form.overview} onChange={handleChange} rows={5} placeholder="Detailed overview paragraphs about the company..." />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Core Engineering Capabilities</h3>
          <div className="tag-input-wrapper">
            <input
              value={newCap}
              onChange={(e) => setNewCap(e.target.value)}
              placeholder="Add engineering capability and press +"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCap())}
            />
            <button type="button" className="tag-add-btn" onClick={addCap}><MdAdd /></button>
          </div>
          <div className="tags-list">
            {form.capabilities.map((cap, i) => (
              <span key={i} className="tag">
                {cap} <button type="button" onClick={() => removeCap(i)}><MdClose /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Images</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Company Logo</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
                <input type="file" id="logo-upload" accept="image/*" onChange={handleImageUpload('logo')} style={{ display: 'none' }} />
                <label htmlFor="logo-upload" className="btn-secondary" style={{ cursor: 'pointer', padding: '8px 14px', fontSize: 12.5 }}>
                  Choose Logo
                </label>
                {form.logo && (
                  <button type="button" onClick={() => setForm((p) => ({ ...p, logo: '' }))}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 13, cursor: 'pointer' }}>
                    Remove
                  </button>
                )}
              </div>
              {form.logo && (
                <img src={resolveImageUrl(form.logo)} alt="Logo" style={{ marginTop: 10, maxHeight: 80, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              )}
            </div>

            <div className="form-group">
              <label>Cover / Banner Image</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
                <input type="file" id="cover-upload" accept="image/*" onChange={handleImageUpload('coverImage')} style={{ display: 'none' }} />
                <label htmlFor="cover-upload" className="btn-secondary" style={{ cursor: 'pointer', padding: '8px 14px', fontSize: 12.5 }}>
                  Choose Cover
                </label>
                {form.coverImage && (
                  <button type="button" onClick={() => setForm((p) => ({ ...p, coverImage: '' }))}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 13, cursor: 'pointer' }}>
                    Remove
                  </button>
                )}
              </div>
              {form.coverImage && (
                <img src={resolveImageUrl(form.coverImage)} alt="Cover" style={{ marginTop: 10, maxHeight: 100, borderRadius: 8, border: '1px solid #e2e8f0', objectFit: 'cover', width: '100%' }} />
              )}
            </div>
          </div>
        </div>

        <div className="form-section" id="principles-section">
          <h3>Company Principles ({form.principles.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {form.principles.map((p, i) => (
              <div key={i} className="principle-row">
                <MdDragIndicator style={{ color: '#94a3b8', fontSize: 20, flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      value={p.title}
                      onChange={(e) => updatePrinciple(i, 'title', e.target.value)}
                      placeholder="Principle title"
                      style={{ flex: 2, padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13.5, background: '#f8fafc', outline: 'none', color: '#0f172a' }}
                    />
                    <input
                      value={p.icon || ''}
                      onChange={(e) => updatePrinciple(i, 'icon', e.target.value)}
                      placeholder="Icon (e.g. lightbulb)"
                      style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, background: '#f8fafc', outline: 'none', color: '#0f172a' }}
                    />
                  </div>
                  <input
                    value={p.description}
                    onChange={(e) => updatePrinciple(i, 'description', e.target.value)}
                    placeholder="Principle description"
                    style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, background: '#f8fafc', outline: 'none', color: '#0f172a' }}
                  />
                </div>
                <button type="button" onClick={() => removePrinciple(i)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 20, cursor: 'pointer', flexShrink: 0 }}>
                  <MdClose />
                </button>
              </div>
            ))}
          </div>

          <div className="principle-add-row">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={newPrinciple.title}
                  onChange={(e) => setNewPrinciple((p) => ({ ...p, title: e.target.value }))}
                  placeholder="New principle title..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPrinciple())}
                  style={{ flex: 2, padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13.5, background: '#f8fafc', outline: 'none', color: '#0f172a' }}
                />
                <input
                  value={newPrinciple.icon}
                  onChange={(e) => setNewPrinciple((p) => ({ ...p, icon: e.target.value }))}
                  placeholder="Icon (e.g. verified)"
                  style={{ flex: 1, padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, background: '#f8fafc', outline: 'none', color: '#0f172a' }}
                />
              </div>
              <input
                value={newPrinciple.description}
                onChange={(e) => setNewPrinciple((p) => ({ ...p, description: e.target.value }))}
                placeholder="Description"
                style={{ padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, background: '#f8fafc', outline: 'none', color: '#0f172a' }}
              />
            </div>
            <button type="button" className="tag-add-btn" onClick={addPrinciple}>
              <MdAdd />
            </button>
          </div>
        </div>

        <div className="form-section">
          <h3>Operations Gallery Slides ({form.gallerySlides.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {form.gallerySlides.map((slide, i) => (
              <div key={i} className="principle-row" style={{ alignItems: 'flex-start' }}>
                {slide.src && (
                  <img src={resolveImageUrl(slide.src)} alt={slide.title} style={{ width: 84, height: 56, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      value={slide.title}
                      onChange={(e) => updateSlide(i, 'title', e.target.value)}
                      placeholder="Slide Title"
                      style={{ flex: 2, padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                    />
                    <input
                      value={slide.tag}
                      onChange={(e) => updateSlide(i, 'tag', e.target.value)}
                      placeholder="Tag (e.g. ENGINEERING PODS)"
                      style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                    />
                  </div>
                  <input
                    value={slide.description}
                    onChange={(e) => updateSlide(i, 'description', e.target.value)}
                    placeholder="Slide caption"
                    style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                  />
                  <div>
                    <input type="file" id={`slide-img-${i}`} accept="image/*" onChange={handleSlideImageUpload(i)} style={{ display: 'none' }} />
                    <label htmlFor={`slide-img-${i}`} style={{ fontSize: 12, color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}>
                      Replace Slide Image
                    </label>
                  </div>
                </div>
                <button type="button" onClick={() => removeSlide(i)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 20, cursor: 'pointer', flexShrink: 0 }}>
                  <MdClose />
                </button>
              </div>
            ))}
          </div>

          <div className="principle-add-row">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={newSlide.title}
                  onChange={(e) => setNewSlide((p) => ({ ...p, title: e.target.value }))}
                  placeholder="New slide title..."
                  style={{ flex: 2, padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                />
                <input
                  value={newSlide.tag}
                  onChange={(e) => setNewSlide((p) => ({ ...p, tag: e.target.value }))}
                  placeholder="Tag (e.g. INNOVATION)"
                  style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                />
              </div>
              <input
                value={newSlide.description}
                onChange={(e) => setNewSlide((p) => ({ ...p, description: e.target.value }))}
                placeholder="Slide description..."
                style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
              />
              <div>
                <input type="file" id="slide-img-new" accept="image/*" onChange={handleSlideImageUpload('new')} style={{ display: 'none' }} />
                <label htmlFor="slide-img-new" style={{ fontSize: 12, color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}>
                  {newSlide.src ? 'Image Attached (Change)' : 'Upload Slide Image'}
                </label>
              </div>
            </div>
            <button type="button" className="tag-add-btn" onClick={addSlide}>
              <MdAdd />
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary-form" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutCompanyEdit;
