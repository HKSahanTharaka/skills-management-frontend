import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skillSchema } from '../../utils/validation';
import { SKILL_CATEGORIES } from '../../utils/constants';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const SkillForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skill_name: initialData?.skill_name || '',
      category: initialData?.category || 'Programming Language',
      description: initialData?.description || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Skill Name"
        placeholder="e.g., React, Python, Communication"
        required
        error={errors.skill_name?.message}
        {...register('skill_name')}
      />

      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <Select
            label="Category"
            required
            options={SKILL_CATEGORIES.map((category) => ({
              value: category,
              label: category,
            }))}
            error={errors.category?.message}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
          />
        )}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          rows={4}
          placeholder="Describe this skill..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-danger-600">{errors.description.message}</p>
        )}
      </div>

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
          {initialData ? 'Update Skill' : 'Create Skill'}
        </Button>
      </div>
    </form>
  );
};

export default SkillForm;

