import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PageHeader from '../../components/shared/PageHeader';
import '../Careers/Form.css';

const EMPTY = {
  address: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  phone: '',
  altPhone: '',
  email: '',
  supportEmail: '',
  website: '',
  mapEmbedUrl: '',
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
        subtitle="Edit official headquarters address, phone numbers and email addresses"
        showBack
      />
      <form onSubmit={handleSubmit} className="form-card">
        {/* Address */}
        <div className="form-section">
          <h3>Office Address</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Street Address</label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="e.g. 4th Floor, Tech Park, Hinjewadi" />
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

        {/* Phone & Email */}
        <div className="form-section">
          <h3>Phone & Email</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Primary Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 20 XXXX XXXX" />
            </div>
            <div className="form-group">
              <label>Alternate Phone</label>
              <input name="altPhone" value={form.altPhone} onChange={handleChange} placeholder="+91 98XXXXXXXX" />
            </div>
            <div className="form-group">
              <label>Primary Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="info@aparaitech.com" />
            </div>
            <div className="form-group">
              <label>Support Email</label>
              <input type="email" name="supportEmail" value={form.supportEmail} onChange={handleChange} placeholder="support@aparaitech.com" />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input name="website" value={form.website} onChange={handleChange} placeholder="https://aparaitech.com" />
            </div>
          </div>
        </div>

        {/* Map */}
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
