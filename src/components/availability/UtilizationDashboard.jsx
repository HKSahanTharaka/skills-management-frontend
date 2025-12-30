import { Users, TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const UtilizationDashboard = ({ utilizationData }) => {
  if (!utilizationData || utilizationData.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
            No Utilization Data Available
          </h3>
          <p className="text-gray-600 dark:text-slate-400 mb-4">
            Start allocating personnel to projects to see utilization statistics here.
          </p>
        </div>
      </Card>
    );
  }

  const stats = calculateStats(utilizationData);

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-1">
               Understanding Utilization
            </h4>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Utilization shows how much of each person's capacity is allocated to projects. 
              <strong> 80-100% is ideal</strong>. Over 100% indicates over-allocation and potential burnout risk.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Users className="h-6 w-6 text-primary-600" />
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
    return { color: 'primary', label: 'Well-balanced', bgColor: 'bg-primary-500' };
  } else if (percentage <= 100) {
    return { color: 'purple', label: 'Fully allocated', bgColor: 'bg-purple-500' };
  } else {
    return { color: 'red', label: 'Over-allocated', bgColor: 'bg-red-500' };
  }
}

export default UtilizationDashboard;

