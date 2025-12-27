import { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useMatchPersonnel, useAllocateToProject } from '../../hooks/useMatching';
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
    data: matches,
    isLoading: isLoadingMatches,
    refetch: refetchMatches,
  } = useMatchPersonnel(selectedProject, {
    enabled: !!selectedProject,
  });

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
        <h1 className="text-3xl font-bold text-gray-900">Project Matching</h1>
        <p className="mt-2 text-gray-600">
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
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedProjectData.project_name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedProjectData.description}
                  </p>
                </div>
                <Badge variant="primary">{selectedProjectData.status}</Badge>
              </div>

              {selectedProjectData.required_skills &&
                selectedProjectData.required_skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
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
            <h3 className="font-semibold text-gray-900">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
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

      {/* Results */}
      {isLoadingMatches ? (
        <Loading />
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
      ) : matches && matches.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No matches found"
          description="No personnel match the requirements for this project"
        />
      ) : (
        <EmptyState
          icon={Search}
          title="Select a project to get started"
          description="Choose a project from the dropdown above to find matching personnel"
        />
      )}
    </div>
  );
};

export default MatchingInterface;

