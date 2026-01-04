import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Briefcase, Award, X, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { personnelService } from '../../services/personnel.service';
import { projectService } from '../../services/project.service';
import { skillService } from '../../services/skill.service';
import Modal from './Modal';
import Badge from './Badge';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const { data: personnelResults, isLoading: personnelLoading } = useQuery({
    queryKey: ['search-personnel', debouncedSearch],
    queryFn: () => personnelService.getAll({ search: debouncedSearch, limit: 5, page: 1 }),
    enabled: debouncedSearch.length >= 2,
  });

  const { data: projectResults, isLoading: projectsLoading } = useQuery({
    queryKey: ['search-projects', debouncedSearch],
    queryFn: () => projectService.getAll({ search: debouncedSearch, limit: 5, page: 1 }),
    enabled: debouncedSearch.length >= 2,
  });

  const { data: skillResults, isLoading: skillsLoading } = useQuery({
    queryKey: ['search-skills', debouncedSearch],
    queryFn: () => skillService.getAll({ search: debouncedSearch, limit: 5, page: 1 }),
    enabled: debouncedSearch.length >= 2,
  });

  const isLoading = personnelLoading || projectsLoading || skillsLoading;

  const hasResults = 
    (personnelResults?.data?.length > 0) || 
    (projectResults?.data?.length > 0) || 
    (skillResults?.data?.length > 0);

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
    setSearchTerm('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="max-w-3xl"
      showHeader={false}
    >
      <div className="p-6">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for personnel, projects, or skills..."
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
          </div>
        )}

        {!isLoading && debouncedSearch.length >= 2 && (
          <div className="space-y-6 max-h-[500px] overflow-y-auto">
            {!hasResults && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No results found for "{debouncedSearch}"
                </p>
              </div>
            )}

            {personnelResults?.data?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Personnel ({personnelResults?.pagination?.total || personnelResults.data.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {personnelResults.data.map((person) => (
                    <button
                      key={person.personnel_id}
                      onClick={() => handleNavigate(`/personnel/${person.personnel_id}`)}
                      className="w-full text-left p-4 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {person.profile_image ? (
                            <img
                              src={person.profile_image}
                              alt={person.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {person.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {person.email}
                            </div>
                          </div>
                        </div>
                        {person.department && (
                          <Badge variant="secondary" size="sm">
                            {person.department}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {personnelResults?.pagination?.total > 5 && (
                  <button
                    onClick={() => handleNavigate(`/personnel?search=${debouncedSearch}`)}
                    className="mt-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                  >
                    View all {personnelResults.pagination.total} results →
                  </button>
                )}
              </div>
            )}

            {projectResults?.data?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Projects ({projectResults?.pagination?.total || projectResults.data.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {projectResults.data.map((project) => (
                    <button
                      key={project.project_id}
                      onClick={() => handleNavigate(`/projects/${project.project_id}`)}
                      className="w-full text-left p-4 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {project.project_name}
                          </div>
                          {project.description && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                              {project.description}
                            </div>
                          )}
                        </div>
                        <Badge
                          variant={
                            project.status === 'Active'
                              ? 'success'
                              : project.status === 'Completed'
                              ? 'default'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
                {projectResults?.pagination?.total > 5 && (
                  <button
                    onClick={() => handleNavigate(`/projects?search=${debouncedSearch}`)}
                    className="mt-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                  >
                    View all {projectResults.pagination.total} results →
                  </button>
                )}
              </div>
            )}

            {skillResults?.data?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Skills ({skillResults?.pagination?.total || skillResults.data.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {skillResults.data.map((skill) => (
                    <button
                      key={skill.skill_id}
                      onClick={() => handleNavigate(`/skills?search=${skill.skill_name}`)}
                      className="w-full text-left p-4 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {skill.skill_name}
                          </div>
                          {skill.description && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                              {skill.description}
                            </div>
                          )}
                        </div>
                        {skill.category && (
                          <Badge variant="secondary" size="sm">
                            {skill.category}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {skillResults?.pagination?.total > 5 && (
                  <button
                    onClick={() => handleNavigate(`/skills?search=${debouncedSearch}`)}
                    className="mt-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                  >
                    View all {skillResults.pagination.total} results →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {!isLoading && debouncedSearch.length < 2 && searchTerm.length < 2 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Start typing to search for personnel, projects, or skills
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Tip: Use keywords like names, emails, project titles, or skill names
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SearchModal;
