import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { usePersonnel, useDeletePersonnel } from '../hooks/usePersonnel';
import { EXPERIENCE_LEVELS } from '../utils/constants';
import { getExperienceLevelColor } from '../utils/helpers';
import { usePermissions } from '../hooks/usePermissions';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import PersonnelForm from '../components/personnel/PersonnelForm';
import { useCreatePersonnel, useUpdatePersonnel } from '../hooks/usePersonnel';

const PersonnelPage = () => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [showForm, setShowForm] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    experience_level: '',
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = usePersonnel(filters);
  const createMutation = useCreatePersonnel();
  const updateMutation = useUpdatePersonnel();
  const deleteMutation = useDeletePersonnel();

  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleCreate = () => {
    setEditingPersonnel(null);
    setShowForm(true);
  };

  const handleEdit = (personnel) => {
    setEditingPersonnel(personnel);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    await deleteMutation.mutateAsync(showDeleteConfirm.id);
    setShowDeleteConfirm(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingPersonnel) {
        await updateMutation.mutateAsync({
          id: editingPersonnel.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setShowForm(false);
      setEditingPersonnel(null);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {row.profile_image_url ? (
            <img
              src={row.profile_image_url}
              alt={value}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                {value.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-slate-100">{value}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role_title',
      label: 'Role',
      sortable: true,
    },
    {
      key: 'experience_level',
      label: 'Experience',
      sortable: true,
      render: (value) => (
        <Badge variant={getExperienceLevelColor(value).replace('badge-', '')}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/personnel/${row.id}`);
            }}
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {permissions.canEditAnyPersonnel && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row);
              }}
              title="Edit personnel"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {permissions.canDeletePersonnel && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(row);
              }}
              title="Delete personnel (Admin only)"
            >
              <Trash2 className="h-4 w-4 text-danger-600" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Personnel Management</h1>
          <p className="mt-2 text-gray-600 dark:text-slate-400">Manage your team members and their skills</p>
        </div>
        {permissions.canCreatePersonnel && (
          <Button variant="primary" onClick={handleCreate} leftIcon={<Plus className="h-4 w-4" />}>
            Add Personnel
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by name or email..."
            leftIcon={<Search className="h-4 w-4" />}
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            clearable
            onClear={() => handleSearch('')}
          />
          <Select
            placeholder="Filter by experience"
            options={[
              { value: '', label: 'All Experience Levels' },
              ...EXPERIENCE_LEVELS.map((level) => ({
                value: level,
                label: level,
              })),
            ]}
            value={filters.experience_level}
            onChange={(e) => handleFilterChange('experience_level', e.target.value)}
          />
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-600 dark:text-slate-400">
              {data?.pagination?.total || 0} personnel found
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      {data?.data?.length === 0 && !isLoading ? (
        <EmptyState
          icon={Plus}
          title="No personnel found"
          description="Get started by adding your first team member"
          action={handleCreate}
          actionLabel="Add Personnel"
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={data?.data || []}
            isLoading={isLoading}
          />

          {data?.pagination && (
            <Pagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.totalPages}
              totalItems={data.pagination.total}
              itemsPerPage={data.pagination.limit}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingPersonnel(null);
        }}
        title={editingPersonnel ? 'Edit Personnel' : 'Add New Personnel'}
        size="lg"
      >
        <PersonnelForm
          initialData={editingPersonnel}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingPersonnel(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-gray-600 dark:text-slate-400">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900 dark:text-slate-100">{showDeleteConfirm?.name}</span>? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
};

export default PersonnelPage;

