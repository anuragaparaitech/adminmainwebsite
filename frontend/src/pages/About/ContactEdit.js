import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PageHeader from '../../components/shared/PageHeader';
import '../Careers/Form.css';

const EMPTY = {
  companyLabel: 'Aparaitech Software',
  address: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  phone: '',
  altPhone: '',
  whatsapp: '',
  email: '',
  altEmail: '',
  hrEmail: '',
  supportEmail: '',
  website: '',
  businessHours: '',
  mapEmbedUrl: '',
  linkedinUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
};

const ContactEdit = () => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get('/api/contact-details')
      .then((res) => setForm({ ...EMPTY, ...res.data }))
      .catch(() => toast.error('Failed to load contact details'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/contact-details', form);
      toast.success('Contact details saved!');
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
        title="Contact Details"
        subtitle="Edit official headquarters address, phone numbers, email desks, business hours, and social links"
        showBack
      />
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-section">
          <h3>Office Address</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Office Header / Company Label</label>
              <input name="companyLabel" value={form.companyLabel} onChange={handleChange} placeholder="Aparaitech Software" />
            </div>
            <div className="form-group full-width">
              <label>Street Address</label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="Office 122, Gera Imperium, Opposite Wipro Circle, Hinjawadi Phase 2" />
            </div>
            <div className="form-group">
              <label>City</label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="Pune" />
            </div>
            <div className="form-group">
              <label>State / Province</label>
              <input name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input name="country" value={form.country} onChange={handleChange} placeholder="India" />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="411057" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Phone, Email & Hours</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Primary Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 8261840199" />
            </div>
            <div className="form-group">
              <label>WhatsApp Number</label>
              <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+91 8261840199" />
            </div>
            <div className="form-group">
              <label>Alternate Phone</label>
              <input name="altPhone" value={form.altPhone} onChange={handleChange} placeholder="+91 ..." />
            </div>
            <div className="form-group">
              <label>General Inquiries Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="info@aparaitech.org" />
            </div>
            <div className="form-group">
              <label>Footer Inquiries Email</label>
              <input type="email" name="altEmail" value={form.altEmail} onChange={handleChange} placeholder="info@ai.aparaitech.org" />
            </div>
            <div className="form-group">
              <label>HR / Careers Email</label>
              <input type="email" name="hrEmail" value={form.hrEmail} onChange={handleChange} placeholder="hr@info.aparaitech.org" />
            </div>
            <div className="form-group">
              <label>Support Email</label>
              <input type="email" name="supportEmail" value={form.supportEmail} onChange={handleChange} placeholder="hr@info.aparaitech.org" />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input name="website" value={form.website} onChange={handleChange} placeholder="https://aparaitech.org" />
            </div>
            <div className="form-group full-width">
              <label>Business Hours</label>
              <input name="businessHours" value={form.businessHours} onChange={handleChange} placeholder="Monday - Friday, 9:30 AM - 6:30 PM IST (Indian Standard Time)" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Social Links</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>LinkedIn URL</label>
              <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} placeholder="https://www.linkedin.com/company/aparaitech" />
            </div>
            <div className="form-group">
              <label>Instagram URL</label>
              <input name="instagramUrl" value={form.instagramUrl} onChange={handleChange} placeholder="https://www.instagram.com/aparaitech" />
            </div>
            <div className="form-group">
              <label>YouTube URL</label>
              <input name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange} placeholder="https://www.youtube.com/@aparaitech" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Google Maps Embed</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Map Embed URL</label>
              <input name="mapEmbedUrl" value={form.mapEmbedUrl} onChange={handleChange} placeholder="Paste Google Maps embed src URL here..." />
            </div>
            {form.mapEmbedUrl && (
              <div className="form-group full-width">
                <label>Preview</label>
                <iframe
                  src={form.mapEmbedUrl}
                  title="Map Preview"
                  width="100%"
                  height="220"
                  style={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
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

export default ContactEdit;
