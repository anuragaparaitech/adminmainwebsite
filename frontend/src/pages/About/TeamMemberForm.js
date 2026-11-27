import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdOutlineImage, MdClose, MdAdd } from 'react-icons/md';
import PageHeader from '../../components/shared/PageHeader';
import { resolveImageUrl } from '../../utils/imageUrl';
import '../Careers/Form.css';
import './TeamMemberForm.css';

const EMPTY = {
  name: '',
  badge: '',
  description: '',
  coverImage: '',
  tags: [],
  isActive: true,
  order: 0,
};

const TeamMemberForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/team/${id}`)
        .then((res) => setForm({ ...EMPTY, ...res.data, tags: res.data.tags || [] }))
        .catch(() => toast.error('Failed to load team pod'));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setForm((prev) => ({ ...prev, coverImage: reader.result }));
    reader.readAsDataURL(file);
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    setForm((prev) => ({ ...prev, tags: [...(prev.tags || []), newTag.trim()] }));
    setNewTag('');
  };

  const removeTag = (idx) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`/api/team/${id}`, form);
        toast.success('Team pod updated!');
      } else {
        await axios.post('/api/team', form);
        toast.success('Team pod added!');
      }
      navigate('/about/team');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Team Pod' : 'Add Team Pod'}
        subtitle="Configure the team group card shown on the website"
        showBack
      />
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-section">
          <h3>Cover Image</h3>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 14, marginTop: -8 }}>
            Wide photo shown on the team card. Landscape ratio works best.
          </p>

          {form.coverImage ? (
            <div className="cover-preview-wrap">
              <img src={resolveImageUrl(form.coverImage)} alt="Cover preview" className="cover-preview-img" />
              <div className="cover-preview-badge">{form.badge || 'BADGE LABEL'}</div>
              <button
                type="button"
                className="cover-remove-btn"
                onClick={() => setForm((p) => ({ ...p, coverImage: '' }))}
              >
                <MdClose /> Remove
              </button>
            </div>
          ) : (
            <label htmlFor="cover-upload" className="cover-upload-zone">
              <MdOutlineImage className="cover-upload-icon" />
              <span className="cover-upload-title">Click to upload cover image</span>
              <span className="cover-upload-hint">JPG, PNG or WebP · Max 5 MB · Landscape (16:9) recommended</span>
            </label>
          )}
          <input
            type="file"
            id="cover-upload"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          {form.coverImage && (
            <label htmlFor="cover-upload" className="btn-secondary"
              style={{ display: 'inline-block', cursor: 'pointer', marginTop: 10, fontSize: 12.5, padding: '7px 16px' }}>
              Change Image
            </label>
          )}
        </div>

        <div className="form-section">
          <h3>Pod / Team Details</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Team / Pod Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Executive Architecture Pod"
              />
            </div>
            <div className="form-group full-width">
              <label>Badge Label (Designation)</label>
              <input
                name="badge"
                value={form.badge}
                onChange={handleChange}
                placeholder="e.g. Principal Systems & Enterprise AI Architects"
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
                placeholder="e.g. Spearheading enterprise AI pipelines, distributed SaaS frameworks..."
              />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input type="number" name="order" value={form.order} onChange={handleChange} min="0" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Focus Tags</h3>
          <div className="tag-input-wrapper">
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag (e.g. Enterprise AI) and press +"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <button type="button" className="tag-add-btn" onClick={addTag}><MdAdd /></button>
          </div>
          <div className="tags-list">
            {(form.tags || []).map((t, i) => (
              <span key={i} className="tag">
                {t} <button type="button" onClick={() => removeTag(i)}><MdClose /></button>
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
          <button type="button" className="btn-secondary" onClick={() => navigate('/about/team')}>
            Cancel
          </button>
          <button type="submit" className="btn-primary-form" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Pod' : 'Add Pod'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeamMemberForm;
