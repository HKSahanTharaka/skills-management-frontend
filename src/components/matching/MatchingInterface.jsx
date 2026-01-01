import { useState } from 'react';
import { Search, Filter, SlidersHorizontal, Users, Calendar, Briefcase, Info, HelpCircle, UserX } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useMatchPersonnel, useAllocateToProject, useProjectAllocations, useDeleteAllocation } from '../../hooks/useMatching';
import { usePermissions } from '../../hooks/usePermissions';
import { formatDisplayDate } from '../../utils/helpers';
import Select from '../common/Select';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import Loading from '../common/Loading';
import MatchResultCard from './MatchResultCard';
import HelpModal from '../common/HelpModal';
import Modal from '../common/Modal';

const MatchingInterface = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [shouldFetchMatches, setShouldFetchMatches] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showUnassignConfirm, setShowUnassignConfirm] = useState(false);
  const [allocationToUnassign, setAllocationToUnassign] = useState(null);
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
    enabled: shouldFetchMatches && !!selectedProject,
  });

  const { data: allocations, isLoading: isLoadingAllocations, refetch: refetchAllocations } = useProjectAllocations(selectedProject, {
    enabled: !!selectedProject,
  });
  const assignedPersonnel = allocations || [];

  const totalRequiredSkills = matchingResponse?.requiredSkills?.length || 0;

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
  const deleteMutation = useDeleteAllocation();
  const { isAdmin } = usePermissions();

  const handleProjectChange = (projectId) => {
    setSelectedProject(projectId);
    setShouldFetchMatches(false);
  };

  const handleFindMatches = () => {
    if (selectedProject) {
      setShouldFetchMatches(true);
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
    }
  };

  const handleUnassign = async (allocationId, personnelName) => {
    setAllocationToUnassign({ id: allocationId, name: personnelName });
    setShowUnassignConfirm(true);
  };

  const confirmUnassign = async () => {
    if (allocationToUnassign) {
      try {
        await deleteMutation.mutateAsync(allocationToUnassign.id);
        setShowUnassignConfirm(false);
        setAllocationToUnassign(null);

        refetchAllocations();
      } catch (error) {
      }
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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">Project Matching</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 dark:text-slate-400">
            Find the best personnel matches for your projects based on skills and availability
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowHelp(true)}
          leftIcon={<HelpCircle className="h-4 w-4" />}
          className="w-full sm:w-auto"
        >
          Help
        </Button>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
              How Matching Works
            </h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-green-800 dark:text-green-200">
              <div>
                <strong>1. Skills Analysis</strong>
                <p className="text-xs mt-1 text-green-700 dark:text-green-300">Compares personnel skills against project requirements and proficiency levels</p>
              </div>
              <div>
                <strong>2. Match Score</strong>
                <p className="text-xs mt-1 text-green-700 dark:text-green-300">Calculates percentage based on matching skills, experience, and availability</p>
              </div>
              <div>
                <strong>3. Smart Ranking</strong>
                <p className="text-xs mt-1 text-green-700 dark:text-green-300">Sorts by match score, then experience level, then availability</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      {allocation.allocation_percentage}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">
                      Allocated
                    </div>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnassign(allocation.id, allocation.personnel_name)}
                      isLoading={deleteMutation.isPending}
                      leftIcon={<UserX className="h-4 w-4" />}
                      className="text-red-600 hover:text-red-700 hover:border-red-300 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Unassign
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {isLoadingMatches ? (
        <Loading />
      ) : !selectedProject ? (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-12">
          <div className="text-center">
            <Search className="h-20 w-20 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
              Select a Project to Begin
            </h3>
            <p className="text-gray-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Choose a project from the dropdown above, then click "Find Matches" to discover the best personnel for your team.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-w-lg mx-auto text-left">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2"> Matching Tips:</p>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• 90%+ match score = Excellent candidate (all requirements met)</li>
                <li>• 70-89% = Good match (most requirements met)</li>
                <li>• 50-69% = Fair match (partial requirements met)</li>
                <li>• Use filters to narrow results by experience or availability</li>
              </ul>
            </div>
          </div>
        </div>
      ) : !shouldFetchMatches ? (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-12">
          <div className="text-center">
            <Search className="h-20 w-20 text-primary-400 dark:text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
              Ready to Find Matches
            </h3>
            <p className="text-gray-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Click the "Find Matches" button above to analyze personnel and find the best candidates for this project.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 max-w-md mx-auto text-left">
              <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2"> What happens next:</p>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• System analyzes all personnel skills and experience</li>
                <li>• Matches are ranked by compatibility score</li>
                <li>• You'll see matching and missing skills for each candidate</li>
                <li>• You can assign suitable personnel with one click</li>
              </ul>
            </div>
          </div>
        </div>
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
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-12">
          <div className="text-center">
            <Filter className="h-20 w-20 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
              No Matching Personnel Found
            </h3>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              No personnel currently meet the requirements for this project.
            </p>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 max-w-md mx-auto text-left">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2"> What you can do:</p>
              <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                <li>• Lower the minimum match score filter if applied</li>
                <li>• Check if search or experience filters are too restrictive</li>
                <li>• Review and adjust project skill requirements</li>
                <li>• Add required skills to existing personnel profiles</li>
                <li>• Consider hiring personnel with needed skills</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        topic="matching"
      />

      <Modal
        isOpen={showUnassignConfirm}
        onClose={() => {
          setShowUnassignConfirm(false);
          setAllocationToUnassign(null);
        }}
        title="Confirm Unassign"
        size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => {
                setShowUnassignConfirm(false);
                setAllocationToUnassign(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmUnassign}
              isLoading={deleteMutation.isPending}
              className="flex-1"
            >
              Unassign
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-gray-600 dark:text-slate-400">
            Are you sure you want to unassign{' '}
            <span className="font-semibold text-gray-900 dark:text-slate-100">
              {allocationToUnassign?.name}
            </span>{' '}
            from this project?
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              This will remove their allocation and free up their capacity. This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MatchingInterface;

