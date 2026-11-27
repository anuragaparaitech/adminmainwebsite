import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/DataTable';
import ConfirmModal from '../../components/shared/ConfirmModal';
import { resolveImageUrl } from '../../utils/imageUrl';

const columns = [
  {
    key: 'coverImage',
    label: 'Cover',
    render: (val, row) =>
      val ? (
        <img
          src={resolveImageUrl(val)}
          alt={row.name}
          style={{
            width: 72,
            height: 44,
            borderRadius: 6,
            objectFit: 'cover',
            border: '1px solid #e2e8f0',
          }}
        />
      ) : (
        <div style={{
          width: 72, height: 44, borderRadius: 6, background: '#f1f5f9',
          border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 11, color: '#94a3b8',
        }}>
          No image
        </div>
      ),
  },
  { key: 'name', label: 'Team / Pod Name' },
  { key: 'badge', label: 'Badge Label' },
  { key: 'order', label: 'Order' },
  { key: 'isActive', label: 'Status', type: 'status' },
];

const Team = () => {
  const [pods, setPods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchPods = async () => {
    try {
      const res = await axios.get('/api/team');
      setPods(res.data);
    } catch {
      toast.error('Failed to load team pods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPods(); }, []);

  const handleEdit = (row) => navigate(`/about/team/edit/${row._id}`);

  const handleToggleStatus = async (row) => {
    try {
      await axios.put(`/api/team/${row._id}`, { isActive: !row.isActive });
      toast.success(`Team pod marked as ${!row.isActive ? 'Active' : 'Inactive'}`);
      fetchPods();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/team/${deleteId}`);
      toast.success('Team pod deleted');
      setDeleteId(null);
      fetchPods();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <PageHeader
        title="Our Team"
        subtitle="Manage engineering pods and team groups shown on the website"
        addPath="/about/team/new"
        addLabel="Add Team Pod"
        showBack
      />
      <DataTable
        columns={columns}
        data={pods}
        loading={loading}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteId(id)}
        onToggleStatus={handleToggleStatus}
      />
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Team Pod"
        message="Are you sure you want to remove this team pod?"
      />
    </div>
  );
};

export default Team;
