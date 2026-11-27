import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdAdd, MdClose } from 'react-icons/md';
import PageHeader from '../../components/shared/PageHeader';
import { resolveImageUrl } from '../../utils/imageUrl';
import '../Careers/Form.css';

const CollaborationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    partnerName: '',
    institution: '',
    category: 'Academic MoU',
    type: 'Research',
    date: '',
    description: '',
    highlights: [],
    logo: '',
    image: '',
    website: '',
    startDate: '',
    isActive: true,
    order: 0,
  });
  const [newHighlight, setNewHighlight] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/collaborations/${id}`).then((res) => {
        const d = res.data;
        setForm((prev) => ({
          ...prev,
          ...d,
          highlights: d.highlights || [],
          startDate: d.startDate ? d.startDate.split('T')[0] : '',
        }));
      }).catch(() => toast.error('Failed to load collaboration'));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setForm((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), newHighlight.trim()],
    }));
    setNewHighlight('');
  };

  const removeHighlight = (index) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`/api/collaborations/${id}`, form);
        toast.success('Collaboration updated!');
      } else {
        await axios.post('/api/collaborations', form);
        toast.success('Collaboration added!');
      }
      navigate('/collaborations');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Collaboration' : 'Add New Collaboration'}
        subtitle="Manage institutional MoUs, academic partnerships, and enterprise alliances"
        showBack
      />
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-section">
          <h3>Partner Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Partner Short Name *</label>
              <input name="partnerName" value={form.partnerName} onChange={handleChange} required placeholder="e.g. VPKBIET Baramati" />
            </div>
            <div className="form-group">
              <label>Full Institution / Organization Name</label>
              <input name="institution" value={form.institution} onChange={handleChange} placeholder="e.g. Vidya Pratishthan's Institute of Engineering..." />
            </div>
            <div className="form-group">
              <label>Category Badge</label>
              <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Academic MoU, International Technology Alliance" />
            </div>
            <div className="form-group">
              <label>Partnership Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                {['Technology', 'Business', 'Research', 'NGO', 'Government', 'Other'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Agreement Date / Term Label</label>
              <input name="date" value={form.date} onChange={handleChange} placeholder="e.g. Academic Year 2025-2026 or 16 December 2025" />
            </div>
            <div className="form-group">
              <label>Start Date (Calendar)</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input name="website" value={form.website} onChange={handleChange} placeholder="https://partner.edu.in" />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input type="number" name="order" value={form.order} onChange={handleChange} min="0" />
            </div>

            <div className="form-group full-width">
              <label>Partner Image</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
                <input
                  type="file"
                  id="collab-file-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="collab-file-upload"
                  className="btn-secondary"
                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
                >
                  Choose Image File
                </label>
                {(form.image || form.logo) && (
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, image: '', logo: '' }))}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Remove Image
                  </button>
                )}
              </div>
              {(form.image || form.logo) && (
                <div style={{ marginTop: '12px' }}>
                  <img
                    src={resolveImageUrl(form.image || form.logo)}
                    alt="Preview"
                    style={{ maxHeight: '160px', borderRadius: '8px', border: '1px solid #cbd5e1', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            <div className="form-group full-width">
              <label>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Describe the partnership and MoU scope..." />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Scope Highlights / Deliverables</h3>
          <div className="tag-input-wrapper">
            <input
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              placeholder="Add deliverable or highlight and press +"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
            />
            <button type="button" className="tag-add-btn" onClick={addHighlight}>
              <MdAdd />
            </button>
          </div>
          <div className="tags-list">
            {(form.highlights || []).map((h, i) => (
              <span key={i} className="tag">
                {h} <button type="button" onClick={() => removeHighlight(i)}><MdClose /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-section">
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
              <span>Active (visible on website)</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/collaborations')}>Cancel</button>
          <button type="submit" className="btn-primary-form" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Partner' : 'Add Partner'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollaborationForm;
