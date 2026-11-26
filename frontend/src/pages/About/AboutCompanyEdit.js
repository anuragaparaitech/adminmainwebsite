import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdAdd, MdClose, MdDragIndicator } from 'react-icons/md';
import PageHeader from '../../components/shared/PageHeader';
import '../Careers/Form.css';
import './About.css';

const EMPTY = {
  companyName: '',
  tagline: '',
  vision: '',
  mission: '',
  overview: '',
  foundedYear: '',
  headquartersLocation: '',
  logo: '',
  coverImage: '',
  principles: [],
};

const AboutCompanyEdit = () => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPrinciple, setNewPrinciple] = useState({ title: '', description: '' });

  useEffect(() => {
    axios.get('/api/about-company')
      .then((res) => setForm({ ...EMPTY, ...res.data }))
      .catch(() => toast.error('Failed to load company info'))
      .finally(() => setLoading(false));
  }, []);

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

  const addPrinciple = () => {
    if (!newPrinciple.title.trim()) return;
    setForm((prev) => ({
      ...prev,
      principles: [...prev.principles, { ...newPrinciple }],
    }));
    setNewPrinciple({ title: '', description: '' });
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
        subtitle="Edit company overview, vision, mission and foundational principles"
        showBack
      />

      <form onSubmit={handleSubmit} className="form-card">
        {/* Basic Info */}
        <div className="form-section">
          <h3>Company Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Company Name</label>
              <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Aparaitech" />
            </div>
            <div className="form-group">
              <label>Founded Year</label>
              <input name="foundedYear" value={form.foundedYear} onChange={handleChange} placeholder="e.g. 2021" />
            </div>
            <div className="form-group">
              <label>Headquarters Location</label>
              <input name="headquartersLocation" value={form.headquartersLocation} onChange={handleChange} placeholder="e.g. Pune, India" />
            </div>
            <div className="form-group full-width">
              <label>Tagline</label>
              <input name="tagline" value={form.tagline} onChange={handleChange} placeholder="Short marketing tagline" />
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
              <textarea name="overview" value={form.overview} onChange={handleChange} rows={5} placeholder="Detailed overview about the company..." />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="form-section">
          <h3>Images</h3>
          <div className="form-grid">
            {/* Logo */}
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
                <img src={form.logo} alt="Logo" style={{ marginTop: 10, maxHeight: 80, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              )}
            </div>

            {/* Cover */}
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
                <img src={form.coverImage} alt="Cover" style={{ marginTop: 10, maxHeight: 100, borderRadius: 8, border: '1px solid #e2e8f0', objectFit: 'cover', width: '100%' }} />
              )}
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className="form-section">
          <h3>Company Principles</h3>

          {/* Existing principles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {form.principles.map((p, i) => (
              <div key={i} className="principle-row">
                <MdDragIndicator style={{ color: '#94a3b8', fontSize: 20, flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <input
                    value={p.title}
                    onChange={(e) => updatePrinciple(i, 'title', e.target.value)}
                    placeholder="Principle title"
                    style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13.5, background: '#f8fafc', outline: 'none', color: '#0f172a' }}
                  />
                  <input
                    value={p.description}
                    onChange={(e) => updatePrinciple(i, 'description', e.target.value)}
                    placeholder="Short description (optional)"
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

          {/* Add new principle */}
          <div className="principle-add-row">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input
                value={newPrinciple.title}
                onChange={(e) => setNewPrinciple((p) => ({ ...p, title: e.target.value }))}
                placeholder="New principle title..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPrinciple())}
                style={{ padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13.5, background: '#f8fafc', outline: 'none', color: '#0f172a' }}
              />
              <input
                value={newPrinciple.description}
                onChange={(e) => setNewPrinciple((p) => ({ ...p, description: e.target.value }))}
                placeholder="Short description (optional)"
                style={{ padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, background: '#f8fafc', outline: 'none', color: '#0f172a' }}
              />
            </div>
            <button type="button" className="tag-add-btn" onClick={addPrinciple}>
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
