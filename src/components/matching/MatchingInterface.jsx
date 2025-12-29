import { useState } from 'react';
import { Search, Filter, SlidersHorizontal, Users, Calendar, Briefcase } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useMatchPersonnel, useAllocateToProject, useProjectAllocations } from '../../hooks/useMatching';
import { formatDisplayDate } from '../../utils/helpers';
import Select from '../common/Select';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import Loading from '../common/Loading';
import MatchResultCard from './MatchResultCard';

const MatchingInterface = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [filters, setFilters] = useState({
    minMatchScore: 0,
    sortBy: 'match_score',
    searchTerm: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: projectsData } = useProjects({ limit: 100 });
  const projects = projectsData?.data || [];

  const {
    data: matchingResponse,
    isLoading: isLoadingMatches,
    refetch: refetchMatches,
  } = useMatchPersonnel(selectedProject, {
    enabled: !!selectedProject,
  });

  const { data: allocations, isLoading: isLoadingAllocations } = useProjectAllocations(selectedProject);
  const assignedPersonnel = allocations || [];

  // Extract required skills count
  const totalRequiredSkills = matchingResponse?.requiredSkills?.length || 0;

  // Map backend response to expected format
  const matches = matchingResponse?.matchedPersonnel?.map(match => ({
    id: match.personnelId,
    full_name: match.name,
    email: match.email || '',
    role_title: match.roleTitle,
    experience_level: match.experienceLevel,
    match_score: match.matchScore,
    matching_skills: match.matchingSkills?.map(s => ({
      skill_name: s.skillName,
      proficiency_level: s.actual,
      min_required: s.required,
    })) || [],
    missing_skills: match.missingSkills?.map(s => ({
      skill_name: s.skillName,
      min_proficiency_level: s.required,
      actual_proficiency: s.actual,
    })) || [],
    total_required_skills: totalRequiredSkills,
    availability_percentage: match.availability,
    profile_picture_url: match.profileImageUrl,
    years_of_experience: 0,
  })) || [];

  const allocateMutation = useAllocateToProject();

  const handleProjectChange = (projectId) => {
    setSelectedProject(projectId);
  };

  const handleFindMatches = () => {
    if (selectedProject) {
      refetchMatches();
    }
  };

  const handleAllocate = async (personnel) => {
    try {
      await allocateMutation.mutateAsync({
        projectId: selectedProject,
        personnelId: personnel.id,
        allocationPercentage: 100,
        startDate: selectedProjectData?.start_date,
        endDate: selectedProjectData?.end_date,
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const selectedProjectData = projects.find((p) => p.id === Number(selectedProject));

  const filteredMatches = matches
    ?.filter((m) => m.match_score >= filters.minMatchScore)
    .filter((m) => {
      if (!filters.searchTerm) return true;
      return m.full_name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'match_score':
          return b.match_score - a.match_score;
        case 'availability':
          return b.availability_percentage - a.availability_percentage;
        case 'experience':
          return b.years_of_experience - a.years_of_experience;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Project Matching</h1>
        <p className="mt-2 text-gray-600 dark:text-slate-400">
          Find the best personnel matches for your projects based on skills and availability
        </p>
      </div>

      {/* Project Selection */}
      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Select
                label="Select Project"
                placeholder="Choose a project to find matches"
                options={[
                  { value: '', label: 'Select a project...' },
                  ...projects.map((p) => ({
                    value: p.id,
                    label: `${p.project_name} (${p.status})`,
                  })),
                ]}
                value={selectedProject}
                onChange={(e) => handleProjectChange(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="primary"
                onClick={handleFindMatches}
                disabled={!selectedProject}
                isLoading={isLoadingMatches}
                className="w-full"
              >
                Find Matches
              </Button>
            </div>
          </div>

          {/* Project Info */}
          {selectedProjectData && (
            <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                    {selectedProjectData.project_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                    {selectedProjectData.description}
                  </p>
                </div>
                <Badge variant="primary">{selectedProjectData.status}</Badge>
              </div>

              {selectedProjectData.required_skills &&
                selectedProjectData.required_skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProjectData.required_skills.map((skill) => (
                        <Badge key={skill.skill_id} variant="secondary">
                          {skill.skill_name} (Min: {skill.min_proficiency_level}/5)
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </Card>

      {/* Filters */}
      {matches && matches.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-slate-100">
              Found {filteredMatches?.length || 0} matches
            </h3>
            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<SlidersHorizontal className="h-4 w-4" />}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <Input
                label="Search Personnel"
                placeholder="Search by name..."
                leftIcon={<Search className="h-4 w-4" />}
                value={filters.searchTerm}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
              />
              <Select
                label="Minimum Match Score"
                options={[
                  { value: 0, label: 'All matches' },
                  { value: 50, label: '50% or higher' },
                  { value: 70, label: '70% or higher' },
                  { value: 90, label: '90% or higher' },
                ]}
                value={filters.minMatchScore}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, minMatchScore: Number(e.target.value) }))
                }
              />
              <Select
                label="Sort By"
                options={[
                  { value: 'match_score', label: 'Match Score' },
                  { value: 'availability', label: 'Availability' },
                  { value: 'experience', label: 'Experience' },
                ]}
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
              />
            </div>
          )}
        </Card>
      )}

      {/* Already Assigned Personnel */}
      {selectedProject && assignedPersonnel.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h3 className="font-semibold text-gray-900 dark:text-slate-100">
              Already Assigned Personnel ({assignedPersonnel.length})
            </h3>
          </div>
          <div className="space-y-3">
            {assignedPersonnel.map((allocation) => (
              <div
                key={allocation.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-slate-100">
                      {allocation.personnel_name}
                    </h4>
                    <Badge variant="success" size="sm">
                      Assigned
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {allocation.role_title || 'N/A'}
                    </span>
                    {allocation.role_in_project && (
                      <span className="flex items-center gap-1">
                        Role: {allocation.role_in_project}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDisplayDate(allocation.start_date)} - {formatDisplayDate(allocation.end_date)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    {allocation.allocation_percentage}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">
                    Allocated
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Results */}
      {isLoadingMatches ? (
        <Loading />
      ) : !selectedProject ? (
        <EmptyState
          icon={Search}
          title="Select a project to get started"
          description="Choose a project from the dropdown above to find matching personnel"
        />
      ) : filteredMatches && filteredMatches.length > 0 ? (
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <MatchResultCard
              key={match.id}
              match={match}
              onAllocate={handleAllocate}
              isAllocating={allocateMutation.isPending}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Filter}
          title="No matches found"
          description="No personnel match the requirements for this project"
        />
      )}
    </div>
  );
};

export default MatchingInterface;

