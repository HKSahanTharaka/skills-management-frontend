import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '../hooks/useSkills';
import { SKILL_CATEGORIES } from '../utils/constants';
import { usePermissions } from '../hooks/usePermissions';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import Loading from '../components/common/Loading';
import SkillForm from '../components/skills/SkillForm';

const SkillsPage = () => {
  const [searchParams] = useSearchParams();
  const permissions = usePermissions();
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: '',
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam && searchParam !== filters.search) {
      setFilters((prev) => ({ ...prev, search: searchParam, page: 1 }));
    }
  }, [searchParams]);

  const { data, isLoading } = useSkills(filters);
  const createMutation = useCreateSkill();
  const updateMutation = useUpdateSkill();
  const deleteMutation = useDeleteSkill();

  const handleSearch = useCallback((value) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  }, []);

  const handleCategoryChange = useCallback((value) => {
    setFilters((prev) => ({ ...prev, category: value, page: 1 }));
  }, []);

  const searchIcon = useMemo(() => <Search className="h-4 w-4" />, []);

  const handleSearchChange = useCallback((e) => {
    handleSearch(e.target.value);
  }, [handleSearch]);

  const handleSearchClear = useCallback(() => {
    handleSearch('');
  }, [handleSearch]);

  const handleCreate = () => {
    setEditingSkill(null);
    setShowForm(true);
  };

  const handleEdit = useCallback((skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  }, []);

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    await deleteMutation.mutateAsync(showDeleteConfirm.id);
    setShowDeleteConfirm(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingSkill) {
        await updateMutation.mutateAsync({
          id: editingSkill.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setShowForm(false);
      setEditingSkill(null);
    } catch (error) {
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Programming Language': 'primary',
      'Framework': 'success',
      'Tool': 'warning',
      'Soft Skill': 'info',
      'Other': 'secondary',
    };
    return colors[category] || 'secondary';
  };

  const columns = useMemo(() => [
    {
      key: 'skill_name',
      label: 'Skill Name',
      sortable: true,
      render: (value) => <span className="font-medium text-gray-900 dark:text-slate-100">{value}</span>,
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value) => (
        <Badge variant={getCategoryColor(value)}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
          {value || 'No description'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          {permissions.canEditSkill && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {permissions.canDeleteSkill && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(row);
              }}
            >
              <Trash2 className="h-4 w-4 text-danger-600" />
            </Button>
          )}
        </div>
      ),
    },
  ], [permissions.canEditSkill, permissions.canDeleteSkill, handleEdit]);

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Skills Management</h1>
          <p className="mt-2 text-gray-600 dark:text-slate-400">Manage skills available in the system</p>
        </div>
        {permissions.canCreateSkill && (
          <Button variant="primary" onClick={handleCreate} leftIcon={<Plus className="h-4 w-4" />}>
            Add Skill
          </Button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search skills..."
              leftIcon={<Search className="h-4 w-4" />}
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              clearable
              onClear={() => handleSearch('')}
            />
          </div>
          <Select
            placeholder="Filter by category"
            options={[
              { value: '', label: 'All Categories' },
              ...SKILL_CATEGORIES.map((category) => ({
                value: category,
                label: category,
              })),
            ]}
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          />
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-600 dark:text-slate-400">
              {data?.pagination?.total || 0} skills
            </span>
          </div>
        </div>
      </div>

      {data?.data?.length === 0 && !isLoading ? (
        <EmptyState
          icon={Plus}
          title="No skills found"
          description="Get started by adding your first skill"
          action={handleCreate}
          actionLabel="Add Skill"
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

      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingSkill(null);
        }}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
        size="md"
      >
        <SkillForm
          initialData={editingSkill}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingSkill(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

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
          Are you sure you want to delete the skill{' '}
          <span className="font-semibold text-gray-900 dark:text-slate-100">{showDeleteConfirm?.skill_name}</span>? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
};

export default SkillsPage;

