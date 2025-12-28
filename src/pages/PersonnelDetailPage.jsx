import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Briefcase, Calendar, Edit, Trash2, Plus } from 'lucide-react';
import { usePersonnelDetail, useDeletePersonnel } from '../hooks/usePersonnel';
import { usePermissions } from '../hooks/usePermissions';
import { getExperienceLevelColor, formatDisplayDate } from '../utils/helpers';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import Modal from '../components/common/Modal';
import PersonnelForm from '../components/personnel/PersonnelForm';
import { useUpdatePersonnel } from '../hooks/usePersonnel';
import { useState } from 'react';

const PersonnelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: response, isLoading } = usePersonnelDetail(id);
  const personnel = response?.data;
  const updateMutation = useUpdatePersonnel();
  const deleteMutation = useDeletePersonnel();

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    navigate('/personnel');
  };

  const handleUpdate = async (formData) => {
    try {
      await updateMutation.mutateAsync({
        id: personnel.id,
        data: formData,
      });
      setShowEditModal(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (isLoading) {
    return <Loading size="lg" text="Loading personnel details..." />;
  }

  if (!personnel) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Personnel not found</h2>
        <p className="mt-2 text-gray-600 dark:text-slate-400">The personnel you're looking for doesn't exist.</p>
        <Button className="mt-4" onClick={() => navigate('/personnel')}>
          Back to Personnel
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/personnel')}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">{personnel.name}</h1>
            <p className="mt-1 text-gray-600 dark:text-slate-400">{personnel.role_title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {permissions.canEditAnyPersonnel && (
            <Button
              variant="outline"
              onClick={handleEdit}
              leftIcon={<Edit className="h-4 w-4" />}
            >
              Edit
            </Button>
          )}
          {permissions.canDeletePersonnel && (
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              leftIcon={<Trash2 className="h-4 w-4" />}
              className="text-danger-600 hover:text-danger-700 hover:border-danger-300"
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            {personnel.profile_image_url ? (
              <img
                src={personnel.profile_image_url}
                alt={personnel.name}
                className="h-32 w-32 rounded-full object-cover border-4 border-gray-100"
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center border-4 border-gray-50 dark:border-slate-700">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-4xl">
                  {personnel.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                  <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-slate-100">{personnel.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Experience Level</p>
                  <Badge variant={getExperienceLevelColor(personnel.experience_level).replace('badge-', '')}>
                    {personnel.experience_level}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Joined</p>
                  <p className="font-medium text-gray-900 dark:text-slate-100">
                    {formatDisplayDate(personnel.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {personnel.bio && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Bio</h3>
                <p className="text-gray-600 dark:text-slate-400">{personnel.bio}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Skills Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Skills</h2>
          {permissions.canManagePersonnelSkills && (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Skill
            </Button>
          )}
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-slate-400">
          <p>Skills management feature coming soon...</p>
        </div>
      </Card>

      {/* Projects Section */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">Projects</h2>
        <div className="text-center py-8 text-gray-500 dark:text-slate-400">
          <p>Project allocations will be shown here...</p>
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Personnel"
      >
        <PersonnelForm
          initialData={personnel}
          onSubmit={handleUpdate}
          onCancel={() => setShowEditModal(false)}
          isLoading={updateMutation.isPending}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Personnel"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-slate-400">
            Are you sure you want to delete <strong>{personnel.name}</strong>? This action cannot
            be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PersonnelDetailPage;
