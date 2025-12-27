import { Users, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const UtilizationDashboard = ({ utilizationData }) => {
  if (!utilizationData || utilizationData.length === 0) {
    return (
      <Card>
        <p className="text-center text-gray-500 py-8">No utilization data available</p>
      </Card>
    );
  }

  const stats = calculateStats(utilizationData);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Personnel</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Fully Allocated</p>
              <p className="text-2xl font-bold text-gray-900">{stats.fullyAllocated}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Over-Allocated</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overAllocated}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Utilization Chart */}
      <Card title="Personnel Utilization">
        <div className="space-y-3">
          {utilizationData.map((person) => {
            const utilizationPercent = person.utilization_percentage || 0;
            const status = getUtilizationStatus(utilizationPercent);

            return (
              <div key={person.personnel_id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {person.profile_picture_url ? (
                      <img
                        src={person.profile_picture_url}
                        alt={person.personnel_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {person.personnel_name?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{person.personnel_name}</p>
                      <p className="text-sm text-gray-600">
                        {person.project_count || 0} project{person.project_count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={status.color}>{utilizationPercent}%</Badge>
                    <span className="text-sm text-gray-600">{status.label}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full transition-all ${status.bgColor}`}
                    style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                  />
                  {utilizationPercent > 100 && (
                    <div
                      className="absolute top-0 left-0 h-full bg-red-500 opacity-50"
                      style={{ width: `${utilizationPercent}%` }}
                    />
                  )}
                </div>

                {/* Project Breakdown */}
                {person.projects && person.projects.length > 0 && (
                  <div className="pl-13">
                    <details className="text-sm">
                      <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                        View project breakdown
                      </summary>
                      <div className="mt-2 space-y-1 pl-4">
                        {person.projects.map((project) => (
                          <div
                            key={project.project_id}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-gray-700">{project.project_name}</span>
                            <span className="text-gray-600">{project.allocation_percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Over-Allocation Warnings */}
      {stats.overAllocated > 0 && (
        <Card>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Over-Allocation Warnings</h3>
              <p className="text-sm text-gray-600 mb-3">
                The following personnel are allocated to more than 100% capacity:
              </p>
              <div className="space-y-2">
                {utilizationData
                  .filter((p) => (p.utilization_percentage || 0) > 100)
                  .map((person) => (
                    <div
                      key={person.personnel_id}
                      className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {person.personnel_name}
                      </span>
                      <Badge variant="red">{person.utilization_percentage}%</Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

function calculateStats(data) {
  return {
    total: data.length,
    available: data.filter((p) => (p.utilization_percentage || 0) === 0).length,
    fullyAllocated: data.filter(
      (p) => (p.utilization_percentage || 0) >= 80 && (p.utilization_percentage || 0) <= 100
    ).length,
    overAllocated: data.filter((p) => (p.utilization_percentage || 0) > 100).length,
  };
}

function getUtilizationStatus(percentage) {
  if (percentage === 0) {
    return { color: 'gray', label: 'Available', bgColor: 'bg-gray-400' };
  } else if (percentage <= 50) {
    return { color: 'green', label: 'Under-utilized', bgColor: 'bg-green-500' };
  } else if (percentage <= 80) {
    return { color: 'blue', label: 'Well-balanced', bgColor: 'bg-blue-500' };
  } else if (percentage <= 100) {
    return { color: 'purple', label: 'Fully allocated', bgColor: 'bg-purple-500' };
  } else {
    return { color: 'red', label: 'Over-allocated', bgColor: 'bg-red-500' };
  }
}

export default UtilizationDashboard;

