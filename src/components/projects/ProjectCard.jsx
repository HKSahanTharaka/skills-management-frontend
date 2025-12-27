import { Calendar, Users, Award } from 'lucide-react';
import Badge from '../common/Badge';
import { getProjectStatusColor, formatDisplayDate } from '../../utils/helpers';

const ProjectCard = ({ project, onClick }) => {
  const getStatusColor = (status) => {
    return getProjectStatusColor(status).replace('badge-', '');
  };

  return (
    <div
      onClick={() => onClick(project)}
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
    >
      {/* Status bar */}
      <div className={`h-2 bg-${getStatusColor(project.status)}-500`} />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {project.project_name}
          </h3>
          <Badge variant={getStatusColor(project.status)} size="sm">
            {project.status}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {project.description || 'No description available'}
        </p>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {formatDisplayDate(project.start_date)} - {formatDisplayDate(project.end_date)}
            </span>
          </div>
          
          {project.required_skills && project.required_skills.length > 0 && (
            <div className="flex items-center text-sm text-gray-500">
              <Award className="h-4 w-4 mr-2" />
              <span>{project.required_skills.length} required skills</span>
            </div>
          )}
          
          {project.allocated_personnel && project.allocated_personnel.length > 0 && (
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-2" />
              <span>{project.allocated_personnel.length} team members</span>
            </div>
          )}
        </div>

        {/* Required Skills Preview */}
        {project.required_skills && project.required_skills.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
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

