import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Edit,
  Trash2,
  Users,
  Award,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useProject, useUpdateProject, useDeleteProject } from '../hooks/useProjects';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import ProjectForm from '../components/projects/ProjectForm';
import { formatDisplayDate, getProjectStatusColor } from '../utils/helpers';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: response, isLoading } = useProject(id);
  const project = response?.data;
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const handleUpdate = async (formData) => {
    try {
      await updateMutation.mutateAsync({ id, data: formData });
      setShowEdit(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      navigate('/projects');
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Project not found</h2>
        <Button onClick={() => navigate('/projects')} className="mt-4">
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate('/projects')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          className="mb-4"
        >
          Back to Projects
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">{project.project_name}</h1>
              <Badge variant={getProjectStatusColor(project.status).replace('badge-', '')}>
                {project.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-gray-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {formatDisplayDate(project.start_date)} - {formatDisplayDate(project.end_date)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowEdit(true)}
              leftIcon={<Edit className="h-4 w-4" />}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Project Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Award className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Required Skills</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {project.required_skills?.length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Team Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {project.allocated_personnel?.length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Duration</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {calculateDuration(project.start_date, project.end_date)} days
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Description */}
      <Card title="Project Description">
        <p className="text-gray-700 dark:text-slate-300 whitespace-pre-wrap">
          {project.description || 'No description available'}
        </p>
      </Card>

      {/* Required Skills */}
      <Card title="Required Skills">
        {project.required_skills && project.required_skills.length > 0 ? (
          <div className="space-y-3">
            {project.required_skills.map((skill) => (
              <div
                key={skill.skill_id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-slate-100">{skill.skill_name}</p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{skill.category}</p>
                  </div>
                </div>
                <Badge variant="primary">
                  Min: {skill.min_proficiency_level}/5
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-slate-400 text-center py-4">No required skills defined</p>
        )}
      </Card>

      {/* Allocated Personnel */}
      <Card title="Team Members">
        {project.allocated_personnel && project.allocated_personnel.length > 0 ? (
          <div className="space-y-3">
            {project.allocated_personnel.map((person) => (
              <div
                key={person.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                onClick={() => navigate(`/personnel/${person.id}`)}
              >
                <div className="flex items-center gap-3">
                  {person.profile_picture_url ? (
                    <img
                      src={person.profile_picture_url}
                      alt={person.personnel_name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        {person.personnel_name?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-slate-100">{person.personnel_name}</p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{person.personnel_email}</p>
                  </div>
                </div>
                <Badge variant="secondary">{person.allocation_percentage || 100}%</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-slate-400 text-center py-4">No team members allocated yet</p>
        )}
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Project"
        size="lg"
      >
        <ProjectForm
          initialData={project}
          onSubmit={handleUpdate}
          onCancel={() => setShowEdit(false)}
          isLoading={updateMutation.isPending}
        />
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
        size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
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
          Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-slate-100">{project.project_name}</span>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff;
}

export default ProjectDetailPage;

