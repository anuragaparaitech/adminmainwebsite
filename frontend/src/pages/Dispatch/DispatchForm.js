import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdAdd, MdClose } from 'react-icons/md';
import PageHeader from '../../components/shared/PageHeader';
import '../Careers/Form.css';
import './DispatchForm.css';

const TAB_OPTIONS = [
  { value: 'launch', label: 'Launch', defaultTabLabel: 'Launch' },
  { value: 'careers', label: 'Careers', defaultTabLabel: 'Careers' },
  { value: 'consultation', label: 'Consultation', defaultTabLabel: 'Consultation' },
];

const EMPTY_FORM = {
  tab: 'launch',
  tabLabel: 'Launch',
  cardIcon: 'rocket_launch',
  cardLabel: '',
  footerTag: 'PRODUCT BRIEFS',
  badge: 'DISPATCH 2026.Q2',
  title: '',
  description: '',
  roles: [],
  pointsTitle: '',
  points: [],
  ctaText: '',
  ctaUrl: '',
  dismissLabel: 'Close',
  isActive: true,
  order: 0,
};

const DispatchForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [newRole, setNewRole] = useState({ title: '', meta: '', badge: '' });
  const [newPoint, setNewPoint] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      axios
        .get(`/api/dispatch/${id}`)
        .then((res) =>
          setForm((prev) => ({
            ...prev,
            ...res.data,
            roles: res.data.roles || [],
            points: res.data.points || [],
          }))
        )
        .catch(() => toast.error('Failed to load dispatch item'));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'tab') {
        const opt = TAB_OPTIONS.find((o) => o.value === value);
        if (opt && (prev.tabLabel === '' || TAB_OPTIONS.some((o) => o.defaultTabLabel === prev.tabLabel))) {
          updated.tabLabel = opt.defaultTabLabel;
        }
      }
      return updated;
    });
  };

  const addRole = () => {
    if (!newRole.title.trim()) return;
    setForm((prev) => ({ ...prev, roles: [...(prev.roles || []), { ...newRole }] }));
    setNewRole({ title: '', meta: '', badge: '' });
  };

  const removeRole = (idx) => {
    setForm((prev) => ({ ...prev, roles: prev.roles.filter((_, i) => i !== idx) }));
  };

  const addPoint = () => {
    if (!newPoint.trim()) return;
    setForm((prev) => ({ ...prev, points: [...(prev.points || []), newPoint.trim()] }));
    setNewPoint('');
  };

  const removePoint = (idx) => {
    setForm((prev) => ({ ...prev, points: prev.points.filter((_, i) => i !== idx) }));
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

      <div className="dispatch-preview-wrap">
        <p className="dispatch-preview-label">Live Preview</p>
        <div className="dispatch-preview">
          <div className="dp-left">
            {form.badge && <div className="dp-badge">{form.badge}</div>}
            <div className="dp-card-icon">{form.cardIcon || 'rocket_launch'}</div>
            <div className="dp-card-label">{form.cardLabel || 'Card Label'}</div>
          </div>
          <div className="dp-right">
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
              {form.ctaText && <div className="dp-cta">{form.ctaText}</div>}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-card" style={{ marginTop: '24px' }}>
        <div className="form-section">
          <h3>Tab Settings</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Tab Key *</label>
              <input name="tab" value={form.tab} onChange={handleChange} required placeholder="e.g. launch, careers, consultation" />
            </div>
            <div className="form-group">
              <label>Tab Label (shown in tab bar) *</label>
              <input name="tabLabel" value={form.tabLabel} onChange={handleChange} required placeholder="e.g. Launch" />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input type="number" name="order" value={form.order} onChange={handleChange} min="0" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Left Panel Card</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Card Icon (Material Icon Name or URL)</label>
              <input name="cardIcon" value={form.cardIcon} onChange={handleChange} placeholder="e.g. rocket_launch, groups, event_available" />
            </div>
            <div className="form-group">
              <label>Card Label</label>
              <input name="cardLabel" value={form.cardLabel} onChange={handleChange} placeholder="e.g. Product launch" />
            </div>
            <div className="form-group">
              <label>Badge Text (top-left chip)</label>
              <input name="badge" value={form.badge} onChange={handleChange} placeholder="e.g. DISPATCH 2026.Q2" />
            </div>
            <div className="form-group">
              <label>Bottom Panel Tag</label>
              <input name="footerTag" value={form.footerTag} onChange={handleChange} placeholder="e.g. PRODUCT BRIEFS" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Popup Content</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Aparaitech platform catalogue" />
            </div>
            <div className="form-group full-width">
              <label>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Popup body description..." />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Highlighted Roles List (optional, for Careers tab)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {(form.roles || []).map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '13px', display: 'block' }}>{r.title}</strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{r.meta} {r.badge ? `(${r.badge})` : ''}</span>
                </div>
                <button type="button" onClick={() => removeRole(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px' }}>
                  <MdClose />
                </button>
              </div>
            ))}
          </div>
          <div className="form-grid">
            <div className="form-group">
              <input value={newRole.title} onChange={(e) => setNewRole((p) => ({ ...p, title: e.target.value }))} placeholder="Role Title" />
            </div>
            <div className="form-group">
              <input value={newRole.meta} onChange={(e) => setNewRole((p) => ({ ...p, meta: e.target.value }))} placeholder="Meta (e.g. Go • Rust • Pune / Hybrid)" />
            </div>
            <div className="form-group">
              <input value={newRole.badge} onChange={(e) => setNewRole((p) => ({ ...p, badge: e.target.value }))} placeholder="Badge (e.g. P1 PRIORITY)" />
            </div>
            <div className="form-group" style={{ justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={addRole} style={{ width: 'fit-content' }}>
                <MdAdd /> Add Role Highlight
              </button>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Highlight Points Box (optional, for Consultation tab)</h3>
          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label>Points Section Title</label>
            <input name="pointsTitle" value={form.pointsTitle} onChange={handleChange} placeholder="e.g. Standard SLA guarantees" />
          </div>
          <div className="tag-input-wrapper">
            <input
              value={newPoint}
              onChange={(e) => setNewPoint(e.target.value)}
              placeholder="Add bullet point and press +"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPoint())}
            />
            <button type="button" className="tag-add-btn" onClick={addPoint}><MdAdd /></button>
          </div>
          <div className="tags-list">
            {(form.points || []).map((pt, i) => (
              <span key={i} className="tag">
                {pt} <button type="button" onClick={() => removePoint(i)}><MdClose /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>CTA & Dismiss Buttons</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>CTA Button Text</label>
              <input name="ctaText" value={form.ctaText} onChange={handleChange} placeholder="e.g. Explore platforms" />
            </div>
            <div className="form-group">
              <label>CTA Button URL</label>
              <input name="ctaUrl" value={form.ctaUrl} onChange={handleChange} placeholder="e.g. /platforms or /careers" />
            </div>
            <div className="form-group">
              <label>Dismiss Button Label</label>
              <input name="dismissLabel" value={form.dismissLabel} onChange={handleChange} placeholder="e.g. Acknowledge, Close, Later" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
              <span>Active (visible on website popup)</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/dispatch')}>Cancel</button>
          <button type="submit" className="btn-primary-form" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Tab' : 'Add Tab'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DispatchForm;
