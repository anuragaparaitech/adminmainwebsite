import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdAdd, MdClose } from 'react-icons/md';
import PageHeader from '../../components/shared/PageHeader';
import '../Careers/Form.css';
import './About.css';

const EMPTY = {
  termsTitle: 'Terms & Conditions',
  termsSubtitle: '',
  termsDocCode: '',
  termsEffectiveDate: '',
  termsJurisdiction: '',
  termsLegalEmail: '',
  termsArticles: [],
  termsContent: '',
  termsLastUpdated: '',
  privacyTitle: 'Privacy Policy',
  privacyContent: '',
};

const TermsEdit = () => {
  const [form, setForm] = useState(EMPTY);
  const [newArticle, setNewArticle] = useState({ number: '', title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get('/api/contact-details')
      .then((res) => {
        const d = res.data;
        setForm({
          termsTitle: d.termsTitle || EMPTY.termsTitle,
          termsSubtitle: d.termsSubtitle || '',
          termsDocCode: d.termsDocCode || '',
          termsEffectiveDate: d.termsEffectiveDate || '',
          termsJurisdiction: d.termsJurisdiction || '',
          termsLegalEmail: d.termsLegalEmail || '',
          termsArticles: d.termsArticles || [],
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

  const updateArticle = (idx, field, value) => {
    setForm((prev) => {
      const updated = [...prev.termsArticles];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, termsArticles: updated };
    });
  };

  const addArticle = () => {
    if (!newArticle.title.trim()) return;
    const nextNum = newArticle.number.trim() || `0${form.termsArticles.length + 1}.`;
    setForm((prev) => ({
      ...prev,
      termsArticles: [...prev.termsArticles, { ...newArticle, number: nextNum }],
    }));
    setNewArticle({ number: '', title: '', content: '' });
  };

  const removeArticle = (idx) => {
    setForm((prev) => ({
      ...prev,
      termsArticles: prev.termsArticles.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        termsContent: form.termsArticles.length
          ? form.termsArticles.map((a) => `${a.number} ${a.title}\n${a.content}`).join('\n\n')
          : form.termsContent,
      };
      await axios.put('/api/contact-details', payload);
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
        subtitle="Edit commercial SLAs, terms articles, governance policies, and privacy content"
        showBack
      />
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-section">
          <h3>Header & Document Metadata</h3>
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
              <label>Section Subtitle</label>
              <input name="termsSubtitle" value={form.termsSubtitle} onChange={handleChange} placeholder="Standard commercial terms, governance guidelines..." />
            </div>
            <div className="form-group">
              <label>Document Code</label>
              <input name="termsDocCode" value={form.termsDocCode} onChange={handleChange} placeholder="e.g. AP-TOS-2026-V3" />
            </div>
            <div className="form-group">
              <label>Effective Date Label</label>
              <input name="termsEffectiveDate" value={form.termsEffectiveDate} onChange={handleChange} placeholder="e.g. JANUARY 2026" />
            </div>
            <div className="form-group">
              <label>Jurisdiction</label>
              <input name="termsJurisdiction" value={form.termsJurisdiction} onChange={handleChange} placeholder="e.g. PUNE, MAHARASHTRA, INDIA" />
            </div>
            <div className="form-group">
              <label>Legal Desk Email</label>
              <input type="email" name="termsLegalEmail" value={form.termsLegalEmail} onChange={handleChange} placeholder="info@aparaitech.org" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Terms & Conditions Articles ({form.termsArticles.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
            {form.termsArticles.map((art, i) => (
              <div key={i} className="principle-row" style={{ alignItems: 'flex-start' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      value={art.number}
                      onChange={(e) => updateArticle(i, 'number', e.target.value)}
                      placeholder="01."
                      style={{ width: 70, padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                    />
                    <input
                      value={art.title}
                      onChange={(e) => updateArticle(i, 'title', e.target.value)}
                      placeholder="Article Title"
                      style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13.5, fontWeight: 600 }}
                    />
                  </div>
                  <textarea
                    value={art.content}
                    onChange={(e) => updateArticle(i, 'content', e.target.value)}
                    rows={3}
                    placeholder="Article clause content..."
                    style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeArticle(i)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 20, cursor: 'pointer', flexShrink: 0 }}
                >
                  <MdClose />
                </button>
              </div>
            ))}
          </div>

          <div className="principle-add-row" style={{ alignItems: 'flex-start' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={newArticle.number}
                  onChange={(e) => setNewArticle((p) => ({ ...p, number: e.target.value }))}
                  placeholder={`0${form.termsArticles.length + 1}.`}
                  style={{ width: 70, padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                />
                <input
                  value={newArticle.title}
                  onChange={(e) => setNewArticle((p) => ({ ...p, title: e.target.value }))}
                  placeholder="New Article Title..."
                  style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13.5 }}
                />
              </div>
              <textarea
                value={newArticle.content}
                onChange={(e) => setNewArticle((p) => ({ ...p, content: e.target.value }))}
                rows={3}
                placeholder="New article text..."
                style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
              />
            </div>
            <button type="button" className="tag-add-btn" onClick={addArticle}>
              <MdAdd />
            </button>
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
                rows={8}
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
