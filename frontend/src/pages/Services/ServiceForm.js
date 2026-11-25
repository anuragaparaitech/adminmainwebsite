import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdAdd, MdClose } from 'react-icons/md';
import PageHeader from '../../components/shared/PageHeader';
import '../Careers/Form.css';

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    cardTitle: '',
    slug: '',
    description: '',
    shortDescription: '',
    icon: 'cloud',
    image: '',
    features: [],
    technologies: [],
    isActive: true,
    order: 0,
  });

  const [newFeature, setNewFeature] = useState('');
  const [newTech, setNewTech] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/services/${id}`).then((res) => {
        setForm((prev) => ({ ...prev, ...res.data }));
      }).catch(() => toast.error('Failed to load service'));
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
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const addItem = (field, value, setter) => {
    if (!value.trim()) return;
    setForm((prev) => ({ ...prev, [field]: [...(prev[field] || []), value.trim()] }));
    setter('');
  };

  const removeItem = (field, index) => {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`/api/services/${id}`, form);
        toast.success('Service updated!');
      } else {
        await axios.post('/api/services', form);
        toast.success('Service created!');
      }
      navigate('/services');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Service' : 'Add New Service'}
        subtitle="Configure service details and upload images"
        showBack
      />
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-section">
          <h3>Service Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Service Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Cloud Solutions (AWS/Azure)" />
            </div>
            <div className="form-group">
              <label>Card Title</label>
              <input name="cardTitle" value={form.cardTitle} onChange={handleChange} placeholder="e.g. Cloud Solutions" />
            </div>
            <div className="form-group">
              <label>Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} placeholder="e.g. cloud-solutions" />
            </div>
            <div className="form-group">
              <label>Icon</label>
              <input name="icon" value={form.icon} onChange={handleChange} placeholder="e.g. cloud, terminal, psychology" />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input type="number" name="order" value={form.order} onChange={handleChange} min="0" />
            </div>

            <div className="form-group full-width">
              <label>Service Image</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
                <input
                  type="file"
                  id="service-file-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="service-file-upload"
                  className="btn-secondary"
                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
                >
                  Choose Image File
                </label>
                {form.image && (
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, image: '' }))}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Remove Image
                  </button>
                )}
              </div>
              {form.image && (
                <div style={{ marginTop: '12px' }}>
                  <img
                    src={form.image}
                    alt="Preview"
                    style={{ maxHeight: '180px', borderRadius: '8px', border: '1px solid #cbd5e1', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            <div className="form-group full-width">
              <label>Short Description</label>
              <input name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Brief summary shown on cards" />
            </div>
            <div className="form-group full-width">
              <label>Full Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Full service description" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Technologies</h3>
          <div className="tag-input-wrapper">
            <input
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              placeholder="Add technology..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('technologies', newTech, setNewTech))}
            />
            <button type="button" className="tag-add-btn" onClick={() => addItem('technologies', newTech, setNewTech)}>
              <MdAdd />
            </button>
          </div>
          <div className="tags-list">
            {(form.technologies || []).map((t, i) => (
              <span key={i} className="tag">
                {t} <button type="button" onClick={() => removeItem('technologies', i)}><MdClose /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Features</h3>
          <div className="tag-input-wrapper">
            <input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('features', newFeature, setNewFeature))}
            />
            <button type="button" className="tag-add-btn" onClick={() => addItem('features', newFeature, setNewFeature)}>
              <MdAdd />
            </button>
          </div>
          <div className="tags-list">
            {(form.features || []).map((f, i) => (
              <span key={i} className="tag">
                {f} <button type="button" onClick={() => removeItem('features', i)}><MdClose /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-section">
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
              <span>Active (Visible on website)</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/services')}>Cancel</button>
          <button type="submit" className="btn-primary-form" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Service' : 'Add Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
