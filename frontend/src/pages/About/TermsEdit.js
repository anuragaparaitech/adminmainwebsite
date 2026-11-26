import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PageHeader from '../../components/shared/PageHeader';
import '../Careers/Form.css';

const EMPTY = {
  termsTitle: 'Terms & Conditions',
  termsContent: '',
  termsLastUpdated: '',
  privacyTitle: 'Privacy Policy',
  privacyContent: '',
};

const TermsEdit = () => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get('/api/contact-details')
      .then((res) => {
        const d = res.data;
        setForm({
          termsTitle: d.termsTitle || EMPTY.termsTitle,
          termsContent: d.termsContent || '',
          termsLastUpdated: d.termsLastUpdated ? d.termsLastUpdated.split('T')[0] : '',
          privacyTitle: d.privacyTitle || EMPTY.privacyTitle,
          privacyContent: d.privacyContent || '',
        });
      })
      .catch(() => toast.error('Failed to load terms'))
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
      toast.success('Terms & Conditions saved!');
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
        title="Terms & Conditions"
        subtitle="Edit commercial SLAs, governance policies and privacy content"
        showBack
      />
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-section">
          <h3>Terms & Conditions</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Section Title</label>
              <input name="termsTitle" value={form.termsTitle} onChange={handleChange} placeholder="Terms & Conditions" />
            </div>
            <div className="form-group">
              <label>Last Updated Date</label>
              <input type="date" name="termsLastUpdated" value={form.termsLastUpdated} onChange={handleChange} />
            </div>
            <div className="form-group full-width">
              <label>Content</label>
              <textarea
                name="termsContent"
                value={form.termsContent}
                onChange={handleChange}
                rows={14}
                placeholder="Paste or type the full Terms & Conditions text here..."
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Privacy Policy</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Section Title</label>
              <input name="privacyTitle" value={form.privacyTitle} onChange={handleChange} placeholder="Privacy Policy" />
            </div>
            <div className="form-group full-width">
              <label>Content</label>
              <textarea
                name="privacyContent"
                value={form.privacyContent}
                onChange={handleChange}
                rows={14}
                placeholder="Paste or type the full Privacy Policy text here..."
              />
            </div>
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

export default TermsEdit;
