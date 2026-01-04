import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Briefcase, Calendar, Edit, Trash2, Plus, X, TrendingUp } from 'lucide-react';
import { usePersonnelDetail, useDeletePersonnel, useAssignSkill, useRemoveSkill } from '../hooks/usePersonnel';
import { usePersonnelAllocations } from '../hooks/useMatching';
import { useSkills } from '../hooks/useSkills';
import { usePermissions } from '../hooks/usePermissions';
import { getExperienceLevelColor, formatDisplayDate, getProficiencyColor, getProjectStatusColor } from '../utils/helpers';
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
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);

  const { data: response, isLoading } = usePersonnelDetail(id);
  const personnel = response?.data;
  const { data: allocationsData, isLoading: allocationsLoading } = usePersonnelAllocations(id);
  const allocations = allocationsData || [];
  const { data: skillsResponse } = useSkills();
  const allSkills = skillsResponse?.data || [];
  
  const updateMutation = useUpdatePersonnel();
  const deleteMutation = useDeletePersonnel();
  const assignSkillMutation = useAssignSkill();
  const removeSkillMutation = useRemoveSkill();

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    navigate('/personnel');
  };

  const handleUpdate = async (formData, skills = []) => {
    try {
      await updateMutation.mutateAsync({
        id: personnel.id,
        data: {
          ...formData,
          skills: skills,
        },
      });
      setShowEditModal(false);
    } catch (error) {
      console.error('Error in handleUpdate:', error);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      await removeSkillMutation.mutateAsync({
        personnelId: id,
        skillId: skillId,
      });
    } catch (error) {
      console.error('Error in handleRemoveSkill:', error);
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
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-6">
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

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Skills</h2>
          {permissions.canManagePersonnelSkills && (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setShowAddSkillModal(true)}
            >
              Add Skill
            </Button>
          )}
        </div>
        {personnel?.skills && personnel.skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {personnel.skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-slate-100">
                      {skill.skill_name}
                    </h3>
                    <Badge variant={getProficiencyColor(skill.proficiency_level).replace('badge-', '')} size="sm">
                      {skill.proficiency_level}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                    {skill.category && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {skill.category}
                      </span>
                    )}
                    {skill.years_of_experience > 0 && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {skill.years_of_experience} {skill.years_of_experience === 1 ? 'year' : 'years'}
                      </span>
                    )}
                  </div>
                </div>
                {permissions.canManagePersonnelSkills && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveSkill(skill.skill_id)}
                    className="text-danger-600 hover:text-danger-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-slate-400">
            <p>No skills assigned yet</p>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">Projects</h2>
        {allocationsLoading ? (
          <div className="text-center py-8">
            <Loading size="md" />
          </div>
        ) : allocations && allocations.length > 0 ? (
          <div className="space-y-3">
            {allocations.map((allocation) => (
              <div
                key={allocation.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-gray-200 dark:border-slate-600"
                onClick={() => navigate(`/projects/${allocation.project_id}`)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-slate-100">
                      {allocation.project_name}
                    </h3>
                    <Badge variant={getProjectStatusColor(allocation.project_status).replace('badge-', '')} size="sm">
                      {allocation.project_status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                    {allocation.role_in_project && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {allocation.role_in_project}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDisplayDate(allocation.start_date)} - {formatDisplayDate(allocation.end_date)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {allocation.allocation_percentage}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">
                    Allocation
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-slate-400">
            <p>No project allocations yet</p>
          </div>
        )}
      </Card>

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

      <AddSkillModal
        isOpen={showAddSkillModal}
        onClose={() => setShowAddSkillModal(false)}
        personnelId={id}
        allSkills={allSkills}
        existingSkills={personnel?.skills || []}
        assignSkillMutation={assignSkillMutation}
      />
    </div>
  );
};

const AddSkillModal = ({ isOpen, onClose, personnelId, allSkills, existingSkills, assignSkillMutation }) => {
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [proficiencyLevel, setProficiencyLevel] = useState('Intermediate');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);

  const existingSkillIds = existingSkills.map(s => s.skill_id);
  const availableSkills = allSkills.filter(skill => !existingSkillIds.includes(skill.id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSkillId) return;

    try {
      await assignSkillMutation.mutateAsync({
        personnelId,
        skillData: {
          skill_id: parseInt(selectedSkillId),
          proficiency_level: proficiencyLevel,
          years_of_experience: parseInt(yearsOfExperience),
        },
      });
      setSelectedSkillId('');
      setProficiencyLevel('Intermediate');
      setYearsOfExperience(0);
      onClose();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Skill">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Skill
          </label>
          <select
            value={selectedSkillId}
            onChange={(e) => setSelectedSkillId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Select a skill</option>
            {availableSkills.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.skill_name} {skill.category && `(${skill.category})`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Proficiency Level
          </label>
          <select
            value={proficiencyLevel}
            onChange={(e) => setProficiencyLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Years of Experience
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={assignSkillMutation.isPending}
            disabled={!selectedSkillId || assignSkillMutation.isPending}
          >
            Add Skill
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PersonnelDetailPage;
