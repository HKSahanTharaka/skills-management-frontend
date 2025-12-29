import { Calendar, Users, Award } from 'lucide-react';
import Badge from '../common/Badge';
import { getProjectStatusColor, formatDisplayDate } from '../../utils/helpers';

const ProjectCard = ({ project, onClick }) => {
  const getStatusColor = (status) => {
    return getProjectStatusColor(status).replace('badge-', '');
  };

  const getStatusBarColor = (status) => {
    const colors = {
      Planning: 'bg-gray-500',
      Active: 'bg-blue-500',
      Completed: 'bg-green-500',
      'On Hold': 'bg-yellow-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div
      onClick={() => onClick(project)}
      className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
    >
      {/* Status bar */}
      <div className={`h-2 ${getStatusBarColor(project.status)}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 line-clamp-1">
            {project.project_name}
          </h3>
          <Badge variant={getStatusColor(project.status)} size="sm">
            {project.status}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2 mb-4">
          {project.description || 'No description available'}
        </p>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {formatDisplayDate(project.start_date)} - {formatDisplayDate(project.end_date)}
            </span>
          </div>

          {project.required_skills && project.required_skills.length > 0 && (
            <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
              <Award className="h-4 w-4 mr-2" />
              <span>{project.required_skills.length} required skills</span>
            </div>
          )}

          {project.allocated_personnel && project.allocated_personnel.length > 0 && (
            <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
              <Users className="h-4 w-4 mr-2" />
              <span>{project.allocated_personnel.length} team members</span>
            </div>
          )}
        </div>

        {/* Required Skills Preview */}
        {project.required_skills && project.required_skills.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
            <div className="flex flex-wrap gap-1">
              {project.required_skills.slice(0, 3).map((skill) => (
                <Badge key={skill.skill_id} variant="secondary" size="sm">
                  {skill.skill_name}
                </Badge>
              ))}
              {project.required_skills.length > 3 && (
                <Badge variant="gray" size="sm">
                  +{project.required_skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

