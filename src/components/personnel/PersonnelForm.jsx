import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import { personnelSchema } from '../../utils/validation';
import { EXPERIENCE_LEVELS, PROFICIENCY_LEVELS } from '../../utils/constants';
import { cloudinaryService } from '../../services/cloudinary.service';
import { useSkills } from '../../hooks/useSkills';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const PersonnelForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [imageUrl, setImageUrl] = useState(initialData?.profile_image_url || '');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState(
    initialData?.skills?.map(skill => ({
      skill_id: skill.skill_id,
      proficiency_level: skill.proficiency_level,
      years_of_experience: skill.years_of_experience || 0,
    })) || []
  );
  
  const { data: skillsData } = useSkills({ limit: 1000 });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(personnelSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      role_title: initialData?.role_title || '',
      experience_level: initialData?.experience_level || 'Junior',
      bio: initialData?.bio || '',
      profile_image_url: initialData?.profile_image_url || '',
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const url = await cloudinaryService.uploadImage(file);
      setImageUrl(url);
      setValue('profile_image_url', url);
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setValue('profile_image_url', '');
  };

  const handleAddSkill = () => {
    setSelectedSkills([...selectedSkills, { skill_id: '', proficiency_level: 'Beginner', years_of_experience: 0 }]);
  };

  const handleRemoveSkill = (index) => {
    setSelectedSkills(selectedSkills.filter((_, i) => i !== index));
  };

  const handleSkillChange = (index, field, value) => {
    const updated = [...selectedSkills];
    updated[index][field] = value;
    setSelectedSkills(updated);
  };

  const onFormSubmit = (data) => {
    const validSkills = selectedSkills.filter(skill => skill.skill_id && skill.proficiency_level);
    
    if (validSkills.length === 0) {
      toast.error('At least one skill is required');
      return;
    }
    
    const cleanedData = {
      ...data,
      profile_image_url: imageUrl || undefined,
      bio: data.bio || undefined,
    };
    
    onSubmit(cleanedData, validSkills);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Profile Image Upload */}
      <div className="flex flex-col items-center">
        {imageUrl ? (
          <div className="relative">
            <img
              src={imageUrl}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover border-4 border-gray-100"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-danger-600 text-white rounded-full p-1 hover:bg-danger-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
        )}
        <label className="mt-2 cursor-pointer">
          <span className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            {isUploading ? 'Uploading...' : imageUrl ? 'Change Photo' : 'Upload Photo'}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
        </label>
        <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max 5MB)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="Enter full name"
          required
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter email address"
          required
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Role / Title"
          placeholder="e.g., Software Engineer"
          required
          error={errors.role_title?.message}
          {...register('role_title')}
        />

        <Controller
          name="experience_level"
          control={control}
          render={({ field }) => (
            <Select
              label="Experience Level"
              required
              options={EXPERIENCE_LEVELS.map((level) => ({
                value: level,
                label: level,
              }))}
              error={errors.experience_level?.message}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          rows={4}
          placeholder="Tell us about this person..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          {...register('bio')}
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-danger-600">{errors.bio.message}</p>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Skills <span className="text-danger-600">*</span>
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

          {selectedSkills.length > 0 && (
            <div className="space-y-3">
              {selectedSkills.map((skill, index) => (
                <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
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
                      value={skill.proficiency_level}
                      onChange={(e) => handleSkillChange(index, 'proficiency_level', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    >
                      {PROFICIENCY_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="Years"
                      value={skill.years_of_experience}
                      onChange={(e) => handleSkillChange(index, 'years_of_experience', parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    />
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

        {selectedSkills.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-slate-400 italic">
            No skills added yet. Click "Add Skill" to add at least one skill.
          </p>
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
          {initialData ? 'Update Personnel' : 'Create Personnel'}
        </Button>
      </div>
    </form>
  );
};

export default PersonnelForm;

