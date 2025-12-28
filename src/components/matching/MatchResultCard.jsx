import { CheckCircle, XCircle, Calendar, Award } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

const MatchResultCard = ({ match, onAllocate, isAllocating }) => {
  const getMatchColor = (score) => {
    if (score >= 90) return 'green';
    if (score >= 70) return 'yellow';
    if (score >= 50) return 'orange';
    return 'red';
  };

  const getMatchLabel = (score) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 70) return 'Good Match';
    if (score >= 50) return 'Fair Match';
    return 'Poor Match';
  };

  const matchColor = getMatchColor(match.match_score);
  const matchLabel = getMatchLabel(match.match_score);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          {match.profile_picture_url ? (
            <img
              src={match.profile_picture_url}
              alt={match.full_name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-bold text-xl">
                {match.full_name?.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{match.full_name}</h3>
              <p className="text-sm text-gray-600">{match.email}</p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold text-${matchColor}-600`}>
                {Math.round(match.match_score)}%
              </div>
              <Badge variant={matchColor} size="sm">
                {matchLabel}
              </Badge>
            </div>
          </div>

          {/* Match Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Skills Match */}
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Skills Match</p>
                <p className="text-sm font-medium text-gray-900">
                  {match.matching_skills?.length || 0} / {match.total_required_skills || 0}
                </p>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Availability</p>
                <p className="text-sm font-medium text-gray-900">
                  {match.availability_percentage || 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="space-y-2 mb-4">
            {/* Matching Skills */}
            {match.matching_skills && match.matching_skills.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Matching Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {match.matching_skills.map((skill) => (
                    <div
                      key={skill.skill_id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded text-xs"
                    >
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-green-700">
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
                <p className="text-xs font-medium text-gray-700 mb-1">Missing Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {match.missing_skills.map((skill) => (
                    <div
                      key={skill.skill_id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded text-xs"
                    >
                      <XCircle className="h-3 w-3 text-red-600" />
                      <span className="text-red-700">
                        {skill.skill_name} (Required: {skill.min_proficiency_level})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            variant="primary"
            onClick={() => onAllocate(match)}
            isLoading={isAllocating}
            disabled={match.availability_percentage === 0}
            className="w-full"
          >
            {match.availability_percentage === 0 ? 'Not Available' : 'Assign to Project'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MatchResultCard;

