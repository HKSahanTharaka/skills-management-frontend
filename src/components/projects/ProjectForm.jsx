import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '../../utils/validation';
import { PROJECT_STATUSES } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const ProjectForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

      <div className="flex gap-3 pt-4 border-t border-gray-200">
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

