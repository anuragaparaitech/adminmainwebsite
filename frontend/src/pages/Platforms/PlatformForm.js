import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdAdd, MdClose } from 'react-icons/md';
import PageHeader from '../../components/shared/PageHeader';
import { resolveImageUrl } from '../../utils/imageUrl';
import '../Careers/Form.css';

const PlatformForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    homepageName: '',
    slug: '',
    type: 'ENTERPRISE SAAS',
    homepageTag: '',
    status: 'OPERATIONAL',
    icon: 'hub',
    tagline: '',
    description: '',
    shortDescription: '',
    problem: '',
    howWorks: '',
    logo: '',
    image: '',
    url: '',
    techStack: [],
    features: [],
    benefits: [],
    useCases: [],
    showOnHomepage: false,
    isActive: true,
    order: 0,
  });

  const [newTech, setNewTech] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newUseCase, setNewUseCase] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/platforms/${id}`).then((res) => {
        setForm((prev) => ({ ...prev, ...res.data }));
      }).catch(() => toast.error('Failed to load platform'));
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
        await axios.put(`/api/platforms/${id}`, form);
        toast.success('Platform updated!');
      } else {
        await axios.post('/api/platforms', form);
        toast.success('Platform created!');
      }
      navigate('/platforms');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Platform' : 'Add New Platform'}
        subtitle="Configure platform details and upload images"
        showBack
      />
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-section">
          <h3>Platform Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Platform Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. NOVATAX" />
            </div>
            <div className="form-group">
              <label>Homepage Card Title (optional override)</label>
              <input name="homepageName" value={form.homepageName} onChange={handleChange} placeholder="e.g. NovaTax" />
            </div>
            <div className="form-group">
              <label>Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} placeholder="e.g. novatax" />
            </div>
            <div className="form-group">
              <label>Category / Type</label>
              <input name="type" value={form.type} onChange={handleChange} placeholder="e.g. B2B Legal & Financial Compliance" />
            </div>
            <div className="form-group">
              <label>Homepage Tag Pill</label>
              <input name="homepageTag" value={form.homepageTag} onChange={handleChange} placeholder="e.g. ENTERPRISE SAAS" />
            </div>
            <div className="form-group">
              <label>Status Chip</label>
              <input name="status" value={form.status} onChange={handleChange} placeholder="e.g. OPERATIONAL or v4.2.0 STABLE" />
            </div>
            <div className="form-group">
              <label>Icon (Material Symbol name)</label>
              <input name="icon" value={form.icon} onChange={handleChange} placeholder="e.g. account_balance, campaign" />
            </div>
            <div className="form-group">
              <label>Platform URL</label>
              <input name="url" value={form.url} onChange={handleChange} placeholder="https://novatax.aparaitech.org/" />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input type="number" name="order" value={form.order} onChange={handleChange} min="0" />
            </div>

            <div className="form-group full-width">
              <label>Platform Image</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
                <input
                  type="file"
                  id="platform-file-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="platform-file-upload"
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
                    style={{ maxHeight: '180px', borderRadius: '8px', border: '1px solid #cbd5e1', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            <div className="form-group full-width">
              <label>Tagline</label>
              <input name="tagline" value={form.tagline} onChange={handleChange} placeholder="Brief marketing tagline" />
            </div>
            <div className="form-group full-width">
              <label>Short Description (shown on homepage card)</label>
              <input name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="One-line summary for cards" />
            </div>
            <div className="form-group full-width">
              <label>Full Overview / Purpose *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Detailed platform description" />
            </div>
            <div className="form-group">
              <label>What It Solves</label>
              <textarea name="problem" value={form.problem} onChange={handleChange} rows={3} placeholder="Operational problem this platform solves..." />
            </div>
            <div className="form-group">
              <label>How It Works</label>
              <textarea name="howWorks" value={form.howWorks} onChange={handleChange} rows={3} placeholder="How users and teams operate the platform..." />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Tech Stack</h3>
          <div className="tag-input-wrapper">
            <input
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              placeholder="Add technology..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('techStack', newTech, setNewTech))}
            />
            <button type="button" className="tag-add-btn" onClick={() => addItem('techStack', newTech, setNewTech)}>
              <MdAdd />
            </button>
          </div>
          <div className="tags-list">
            {(form.techStack || []).map((t, i) => (
              <span key={i} className="tag">
                {t} <button type="button" onClick={() => removeItem('techStack', i)}><MdClose /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Key Capabilities / Features</h3>
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
          <h3>Business Benefits</h3>
          <div className="tag-input-wrapper">
            <input
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              placeholder="Add a benefit..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('benefits', newBenefit, setNewBenefit))}
            />
            <button type="button" className="tag-add-btn" onClick={() => addItem('benefits', newBenefit, setNewBenefit)}>
              <MdAdd />
            </button>
          </div>
          <div className="tags-list">
            {(form.benefits || []).map((b, i) => (
              <span key={i} className="tag">
                {b} <button type="button" onClick={() => removeItem('benefits', i)}><MdClose /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Target Use Cases</h3>
          <div className="tag-input-wrapper">
            <input
              value={newUseCase}
              onChange={(e) => setNewUseCase(e.target.value)}
              placeholder="Add a use case..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('useCases', newUseCase, setNewUseCase))}
            />
            <button type="button" className="tag-add-btn" onClick={() => addItem('useCases', newUseCase, setNewUseCase)}>
              <MdAdd />
            </button>
          </div>
          <div className="tags-list">
            {(form.useCases || []).map((u, i) => (
              <span key={i} className="tag">
                {u} <button type="button" onClick={() => removeItem('useCases', i)}><MdClose /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-section">
          <div className="form-group checkbox-group" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <label className="checkbox-label">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
              <span>Active (Visible on website)</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="showOnHomepage" checked={Boolean(form.showOnHomepage)} onChange={handleChange} />
              <span>Show on Homepage Platforms Grid</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/platforms')}>Cancel</button>
          <button type="submit" className="btn-primary-form" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Platform' : 'Add Platform'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlatformForm;
