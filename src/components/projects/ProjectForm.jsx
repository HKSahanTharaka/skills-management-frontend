import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { projectSchema } from '../../utils/validation';
import { PROJECT_STATUSES, PROFICIENCY_LEVELS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import { useSkills } from '../../hooks/useSkills';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const ProjectForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [requiredSkills, setRequiredSkills] = useState([]);
  
  const { data: skillsData } = useSkills({ limit: 1000 });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      project_name: initialData?.project_name || '',
      description: initialData?.description || '',
      start_date: initialData?.start_date ? formatDate(initialData.start_date) : '',
      end_date: initialData?.end_date ? formatDate(initialData.end_date) : '',
      status: initialData?.status || 'Planning',
    },
  });

  const handleAddSkill = () => {
    setRequiredSkills([...requiredSkills, { skill_id: '', minimum_proficiency: 'Intermediate' }]);
  };

  const handleRemoveSkill = (index) => {
    setRequiredSkills(requiredSkills.filter((_, i) => i !== index));
  };

  const handleSkillChange = (index, field, value) => {
    const updated = [...requiredSkills];
    updated[index][field] = value;
    setRequiredSkills(updated);
  };

  const onFormSubmit = (data) => {
    const validSkills = requiredSkills.filter(skill => skill.skill_id && skill.minimum_proficiency);
    onSubmit(data, validSkills);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      <Input
        label="Project Name"
        placeholder="e.g., E-commerce Platform"
        required
        error={errors.project_name?.message}
        {...register('project_name')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          rows={4}
          placeholder="Describe the project..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-danger-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          required
          error={errors.start_date?.message}
          {...register('start_date')}
        />

        <Input
          label="End Date"
          type="date"
          required
          error={errors.end_date?.message}
          {...register('end_date')}
        />
      </div>

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Select
            label="Status"
            required
            options={PROJECT_STATUSES.map((status) => ({
              value: status,
              label: status,
            }))}
            error={errors.status?.message}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
          />
        )}
      />

      {!initialData && (
        <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
              Required Skills (Optional)
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSkill}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Skill
            </Button>
          </div>

          {requiredSkills.length > 0 && (
            <div className="space-y-3">
              {requiredSkills.map((skill, index) => (
                <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <select
                      value={skill.skill_id}
                      onChange={(e) => handleSkillChange(index, 'skill_id', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="">Select Skill</option>
                      {skillsData?.data?.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.skill_name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={skill.minimum_proficiency}
                      onChange={(e) => handleSkillChange(index, 'minimum_proficiency', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="">Minimum Level</option>
                      {PROFICIENCY_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="p-2 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {requiredSkills.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-slate-400 italic">
              No required skills added yet. You can add skills now or later.
            </p>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="flex-1"
        >
          {initialData ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;

