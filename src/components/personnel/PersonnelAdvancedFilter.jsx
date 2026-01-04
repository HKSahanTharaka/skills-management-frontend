import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import Select from '../common/Select';
import Input from '../common/Input';
import { useSkills } from '../../hooks/useSkills';
import { EXPERIENCE_LEVELS, PROFICIENCY_LEVELS } from '../../utils/constants';

const PersonnelAdvancedFilter = ({ onApply, onClear, initialFilters = {} }) => {
  const { data: skillsData } = useSkills({ limit: 1000 });
  const skills = skillsData?.data || [];

  const [filters, setFilters] = useState({
    experience_level: initialFilters.experience_level || '',
    role_title: initialFilters.role_title || '',
    skill_filters: initialFilters.skill_filters || [],
  });

  const [currentSkillFilter, setCurrentSkillFilter] = useState({
    skill_id: '',
    proficiency_level: '',
    min_proficiency_level: '',
    years_of_experience: '',
  });

  useEffect(() => {
    setFilters({
      experience_level: initialFilters.experience_level || '',
      role_title: initialFilters.role_title || '',
      skill_filters: initialFilters.skill_filters || [],
    });
  }, [initialFilters]);

  const handleAddSkillFilter = () => {
    if (!currentSkillFilter.skill_id) return;

    const skillExists = filters.skill_filters.some(
      (sf) => sf.skill_id === currentSkillFilter.skill_id
    );

    if (skillExists) {
      return;
    }

    const newFilter = { ...currentSkillFilter };
    setFilters((prev) => ({
      ...prev,
      skill_filters: [...prev.skill_filters, newFilter],
    }));

    setCurrentSkillFilter({
      skill_id: '',
      proficiency_level: '',
      min_proficiency_level: '',
      years_of_experience: '',
    });
  };

  const handleRemoveSkillFilter = (index) => {
    setFilters((prev) => ({
      ...prev,
      skill_filters: prev.skill_filters.filter((_, i) => i !== index),
    }));
  };

  const handleApply = () => {
    const appliedFilters = {
      ...filters,
      skill_filters: filters.skill_filters.length > 0 
        ? JSON.stringify(filters.skill_filters) 
        : undefined,
    };
    onApply(appliedFilters);
  };

  const handleClear = () => {
    setFilters({
      experience_level: '',
      role_title: '',
      skill_filters: [],
    });
    setCurrentSkillFilter({
      skill_id: '',
      proficiency_level: '',
      min_proficiency_level: '',
      years_of_experience: '',
    });
    onClear();
  };

  const getSkillName = (skillId) => {
    const skill = skills.find((s) => s.id === parseInt(skillId));
    return skill ? skill.skill_name : skillId;
  };

  const getProficiencyLabel = (level) => {
    const index = PROFICIENCY_LEVELS.indexOf(level);
    return index !== -1 ? `${level} (${index + 1})` : level;
  };

  return (
    <div className="space-y-4">
      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Experience Level"
          placeholder="All Experience Levels"
          options={[
            { value: '', label: 'All Experience Levels' },
            ...EXPERIENCE_LEVELS.map((level) => ({
              value: level,
              label: level,
            })),
          ]}
          value={filters.experience_level}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, experience_level: e.target.value }))
          }
        />
        <Input
          label="Role Title"
          placeholder="e.g., Software Engineer, Designer"
          value={filters.role_title}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, role_title: e.target.value }))
          }
        />
      </div>

      {/* Skill Filters Section */}
      <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
          Filter by Skills
        </h3>

        {/* Add Skill Filter Form */}
        <div className="space-y-3 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select
              placeholder="Select skill"
              options={[
                { value: '', label: 'Select skill' },
                ...skills.map((skill) => ({
                  value: skill.id.toString(),
                  label: `${skill.skill_name} (${skill.category})`,
                })),
              ]}
              value={currentSkillFilter.skill_id}
              onChange={(e) =>
                setCurrentSkillFilter((prev) => ({
                  ...prev,
                  skill_id: e.target.value,
                }))
              }
            />
            <Select
              placeholder="Exact proficiency"
              options={[
                { value: '', label: 'Any proficiency' },
                ...PROFICIENCY_LEVELS.map((level, index) => ({
                  value: level,
                  label: `${level} (${index + 1})`,
                })),
              ]}
              value={currentSkillFilter.proficiency_level}
              onChange={(e) =>
                setCurrentSkillFilter((prev) => ({
                  ...prev,
                  proficiency_level: e.target.value,
                  min_proficiency_level: '',
                }))
              }
            />
            <Select
              placeholder="Min proficiency"
              options={[
                { value: '', label: 'No minimum' },
                ...PROFICIENCY_LEVELS.map((level, index) => ({
                  value: level,
                  label: `≥ ${level} (${index + 1})`,
                })),
              ]}
              value={currentSkillFilter.min_proficiency_level}
              onChange={(e) =>
                setCurrentSkillFilter((prev) => ({
                  ...prev,
                  min_proficiency_level: e.target.value,
                  proficiency_level: '',
                }))
              }
              disabled={!!currentSkillFilter.proficiency_level}
            />
            <Input
              type="number"
              placeholder="Min years exp"
              min="0"
              value={currentSkillFilter.years_of_experience}
              onChange={(e) =>
                setCurrentSkillFilter((prev) => ({
                  ...prev,
                  years_of_experience: e.target.value,
                }))
              }
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSkillFilter}
            disabled={!currentSkillFilter.skill_id}
            leftIcon={<Plus className="h-4 w-4" />}
            className="w-full md:w-auto"
          >
            Add Skill Filter
          </Button>
        </div>

        {/* Active Skill Filters */}
        {filters.skill_filters.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium text-gray-600 dark:text-slate-400">
              Active Skill Filters ({filters.skill_filters.length}):
            </p>
            <div className="space-y-2">
              {filters.skill_filters.map((filter, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-3 py-2 rounded-lg text-sm"
                >
                  <span className="flex-1">
                    <strong>{getSkillName(filter.skill_id)}</strong>
                    {filter.proficiency_level && (
                      <span className="ml-2">
                        = {getProficiencyLabel(filter.proficiency_level)}
                      </span>
                    )}
                    {filter.min_proficiency_level && (
                      <span className="ml-2">
                        ≥ {getProficiencyLabel(filter.min_proficiency_level)}
                      </span>
                    )}
                    {filter.years_of_experience && (
                      <span className="ml-2">
                        (≥ {filter.years_of_experience} years)
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => handleRemoveSkillFilter(index)}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                    title="Remove filter"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
        <Button variant="outline" onClick={handleClear} className="flex-1">
          Clear All
        </Button>
        <Button variant="primary" onClick={handleApply} className="flex-1">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default PersonnelAdvancedFilter;
