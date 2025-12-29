import { CheckCircle, XCircle, Calendar, Award, Briefcase } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

const MatchResultCard = ({ match, onAllocate, isAllocating }) => {
  const getMatchColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'primary';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  const getMatchLabel = (score) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 70) return 'Good Match';
    if (score >= 50) return 'Fair Match';
    return 'Poor Match';
  };

  const matchVariant = getMatchColor(match.match_score);
  const matchLabel = getMatchLabel(match.match_score);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="font-medium text-gray-900 dark:text-slate-100">
            {match.full_name}
          </h4>
          <Badge variant={matchVariant} size="sm">
            {matchLabel}
          </Badge>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {match.role_title || 'N/A'}
          </span>
          <span className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            Skills: {match.matching_skills?.length || 0} / {match.total_required_skills || 0}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Availability: {match.availability_percentage || 0}%
          </span>
        </div>

        {/* Skills Breakdown */}
        <div className="space-y-2">
          {/* Matching Skills */}
          {match.matching_skills && match.matching_skills.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Matching Skills:</p>
              <div className="flex flex-wrap gap-1">
                {match.matching_skills.map((skill, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded text-xs"
                  >
                    <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                    <span className="text-green-700 dark:text-green-300">
                      {skill.skill_name} ({skill.proficiency_level}/{skill.min_required})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {match.missing_skills && match.missing_skills.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Missing Skills:</p>
              <div className="flex flex-wrap gap-1">
                {match.missing_skills.map((skill, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded text-xs"
                  >
                    <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                    <span className="text-red-700 dark:text-red-300">
                      {skill.skill_name} (Required: {skill.min_proficiency_level})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {Math.round(match.match_score)}%
          </div>
          <div className="text-xs text-gray-500 dark:text-slate-400">
            Match Score
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onAllocate(match)}
          isLoading={isAllocating}
          disabled={match.availability_percentage === 0}
        >
          {match.availability_percentage === 0 ? 'Not Available' : 'Assign'}
        </Button>
      </div>
    </div>
  );
};

export default MatchResultCard;

