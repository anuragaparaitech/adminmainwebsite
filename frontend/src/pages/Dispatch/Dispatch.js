import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import ConfirmModal from '../../components/shared/ConfirmModal';

const TAB_COLORS = {
  launch:       '#2563eb',
  careers:      '#16a34a',
  consultation: '#7c3aed',
};

const columns = [
  { key: 'tabLabel', label: 'Tab' },
  { key: 'cardLabel', label: 'Card Label' },
  { key: 'title', label: 'Popup Title' },
  {
    key: 'tab',
    label: 'Tab Type',
    render: (val) => (
      <span
        style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: '12px',
          fontSize: '11.5px',
          fontWeight: 700,
          letterSpacing: '0.4px',
          textTransform: 'uppercase',
          background: TAB_COLORS[val] + '1a',
          color: TAB_COLORS[val] || '#374151',
          border: `1px solid ${TAB_COLORS[val] || '#d1d5db'}40`,
        }}
      >
        {val}
      </span>
    ),
  },
  { key: 'order', label: 'Order' },
  { key: 'isActive', label: 'Status', type: 'status' },
];

const Dispatch = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const res = await axios.get('/api/dispatch');
      setItems(res.data);
    } catch {
      toast.error('Failed to load dispatch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleEdit = (row) => navigate(`/dispatch/edit/${row._id}`);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/dispatch/${deleteId}`);
      toast.success('Dispatch item deleted');
      setDeleteId(null);
      fetchItems();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <PageHeader
        title="Dispatch Popup"
        subtitle="Manage the popup tabs shown on the main website (Launch, Careers, Consultation)"
        addPath="/dispatch/new"
        addLabel="Add Popup Tab"
      />
      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteId(id)}
      />
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Dispatch Item"
        message="Are you sure you want to delete this popup tab entry? This action cannot be undone."
      />
    </div>
  );
};

export default Dispatch;
