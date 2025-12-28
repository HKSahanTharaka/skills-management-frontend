import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../hooks/useProjects';
import { PROJECT_STATUSES } from '../utils/constants';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { CardGrid } from '../components/common/Card';
import Pagination from '../components/common/Pagination';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectForm from '../components/projects/ProjectForm';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    limit: 12,
  });

  const { data, isLoading } = useProjects(filters);
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleStatusChange = (value) => {
    setFilters((prev) => ({ ...prev, status: value, page: 1 }));
  };

  const handleCreate = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    await deleteMutation.mutateAsync(showDeleteConfirm.id);
    setShowDeleteConfirm(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProject) {
        await updateMutation.mutateAsync({
          id: editingProject.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setShowForm(false);
      setEditingProject(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Projects Management</h1>
          <p className="mt-2 text-gray-600 dark:text-slate-400">Manage your projects and track progress</p>
        </div>
        <Button variant="primary" onClick={handleCreate} leftIcon={<Plus className="h-4 w-4" />}>
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search projects..."
              leftIcon={<Search className="h-4 w-4" />}
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              clearable
              onClear={() => handleSearch('')}
            />
          </div>
          <Select
            placeholder="Filter by status"
            options={[
              { value: '', label: 'All Statuses' },
              ...PROJECT_STATUSES.map((status) => ({
                value: status,
                label: status,
              })),
            ]}
            value={filters.status}
            onChange={(e) => handleStatusChange(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {PROJECT_STATUSES.map((status) => {
          const count = data?.data?.filter((p) => p.status === status).length || 0;
          return (
            <div key={status} className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{status}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Projects Grid */}
      {data?.data?.length === 0 && !isLoading ? (
        <EmptyState
          icon={Plus}
          title="No projects found"
          description="Get started by creating your first project"
          action={handleCreate}
          actionLabel="Create Project"
        />
      ) : (
        <>
          <CardGrid cols={3}>
            {data?.data?.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate(`/projects/${project.id}`)}
              />
            ))}
          </CardGrid>

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
          setEditingProject(null);
        }}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
        size="lg"
      >
        <ProjectForm
          initialData={editingProject}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingProject(null);
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
          <span className="font-semibold text-gray-900 dark:text-slate-100">{showDeleteConfirm?.project_name}</span>? This action
          cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default ProjectsPage;

