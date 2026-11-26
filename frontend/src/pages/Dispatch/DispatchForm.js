import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import PageHeader from '../../components/shared/PageHeader';
import '../Careers/Form.css';
import './DispatchForm.css';

const TAB_OPTIONS = [
  { value: 'launch',       label: 'Launch',       defaultTabLabel: 'Launch' },
  { value: 'careers',      label: 'Careers',      defaultTabLabel: 'Careers' },
  { value: 'consultation', label: 'Consultation', defaultTabLabel: 'Consultation' },
];

const EMPTY_FORM = {
  tab: 'launch',
  tabLabel: 'Launch',
  cardIcon: '🚀',
  cardLabel: '',
  badge: '',
  title: '',
  description: '',
  ctaText: '',
  ctaUrl: '',
  isActive: true,
  order: 0,
};

const DispatchForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      axios
        .get(`/api/dispatch/${id}`)
        .then((res) => setForm((prev) => ({ ...prev, ...res.data })))
        .catch(() => toast.error('Failed to load dispatch item'));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      // Auto-fill tabLabel when tab type changes (only if user hasn't customised it)
      if (name === 'tab') {
        const opt = TAB_OPTIONS.find((o) => o.value === value);
        if (opt && (prev.tabLabel === '' || TAB_OPTIONS.some((o) => o.defaultTabLabel === prev.tabLabel))) {
          updated.tabLabel = opt.defaultTabLabel;
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`/api/dispatch/${id}`, form);
        toast.success('Dispatch item updated!');
      } else {
        await axios.post('/api/dispatch', form);
        toast.success('Dispatch item created!');
      }
      navigate('/dispatch');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Popup Tab' : 'Add New Popup Tab'}
        subtitle="Configure the content shown inside the Dispatch popup on the main website"
        showBack
      />

      {/* Live preview */}
      <div className="dispatch-preview-wrap">
        <p className="dispatch-preview-label">Live Preview</p>
        <div className="dispatch-preview">
          {/* Left dark panel */}
          <div className="dp-left">
            {form.badge && <div className="dp-badge">● {form.badge}</div>}
            <div className="dp-card-icon">{form.cardIcon || '🚀'}</div>
            <div className="dp-card-label">{form.cardLabel || 'Card Label'}</div>
          </div>
          {/* Right popup panel */}
          <div className="dp-right">
            {/* Tabs */}
            <div className="dp-tabs">
              {TAB_OPTIONS.map((opt) => (
                <span
                  key={opt.value}
                  className={`dp-tab ${form.tab === opt.value ? 'active' : ''}`}
                >
                  {form.tab === opt.value ? form.tabLabel || opt.defaultTabLabel : opt.defaultTabLabel}
                </span>
              ))}
            </div>
            <div className="dp-content">
              <h3 className="dp-title">{form.title || 'Popup Title'}</h3>
              <p className="dp-desc">{form.description || 'Description text will appear here...'}</p>
              {form.ctaText && (
                <div className="dp-cta">{form.ctaText}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-card" style={{ marginTop: '24px' }}>
        {/* Tab Settings */}
        <div className="form-section">
          <h3>Tab Settings</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Tab Type *</label>
              <select name="tab" value={form.tab} onChange={handleChange} required>
                {TAB_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Tab Label (shown in tab bar)</label>
              <input
                name="tabLabel"
                value={form.tabLabel}
                onChange={handleChange}
                placeholder="e.g. Launch"
              />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                name="order"
                value={form.order}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Left Card (dark panel) */}
        <div className="form-section">
          <h3>Left Panel Card</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Card Icon (emoji or URL)</label>
              <input
                name="cardIcon"
                value={form.cardIcon}
                onChange={handleChange}
                placeholder="e.g. 🚀 or https://..."
              />
            </div>
            <div className="form-group">
              <label>Card Label</label>
              <input
                name="cardLabel"
                value={form.cardLabel}
                onChange={handleChange}
                placeholder="e.g. Product launch"
              />
            </div>
            <div className="form-group">
              <label>Badge Text (top-left chip)</label>
              <input
                name="badge"
                value={form.badge}
                onChange={handleChange}
                placeholder="e.g. DISPATCH 2026.Q2"
              />
            </div>
          </div>
        </div>

        {/* Popup Content */}
        <div className="form-section">
          <h3>Popup Content</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Aparaitech platform catalogue"
              />
            </div>
            <div className="form-group full-width">
              <label>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="e.g. Explore Aparaitech product and solution briefs..."
              />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="form-section">
          <h3>CTA Button (optional)</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Button Text</label>
              <input
                name="ctaText"
                value={form.ctaText}
                onChange={handleChange}
                placeholder="e.g. Explore Platforms"
              />
            </div>
            <div className="form-group">
              <label>Button URL</label>
              <input
                name="ctaUrl"
                value={form.ctaUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Active toggle */}
        <div className="form-section">
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              <span>Active (visible on website popup)</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/dispatch')}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary-form" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Tab' : 'Add Tab'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DispatchForm;
