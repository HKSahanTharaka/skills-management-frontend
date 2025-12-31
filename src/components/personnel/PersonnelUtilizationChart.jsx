import { useMemo } from 'react';
import { TrendingUp, AlertTriangle, Users, Info } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Loading from '../common/Loading';

const PersonnelUtilizationChart = ({ utilizationData, isLoading, dateRange }) => {
  const stats = useMemo(() => {
    if (!utilizationData || utilizationData.length === 0) return null;

    const available = utilizationData.filter((p) => p.total_utilization === 0).length;
    const underUtilized = utilizationData.filter(
      (p) => p.total_utilization > 0 && p.total_utilization <= 60
    ).length;
    const wellBalanced = utilizationData.filter(
      (p) => p.total_utilization > 60 && p.total_utilization <= 100
    ).length;
    const overAllocated = utilizationData.filter((p) => p.total_utilization > 100).length;

    return {
      total: utilizationData.length,
      available,
      underUtilized,
      wellBalanced,
      overAllocated,
    };
  }, [utilizationData]);

  if (isLoading) {
    return <Loading />;
  }

  if (!utilizationData || utilizationData.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
            No Utilization Data Available
          </h3>
          <p className="text-gray-600 dark:text-slate-400">
            Personnel utilization data will appear here once allocations are created.
          </p>
        </div>
      </Card>
    );
  }

  const months = utilizationData[0]?.utilization_by_month || [];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Personnel Utilization Overview
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This visualization shows how personnel time is allocated across projects over the next 3 months. 
              Colors indicate utilization levels: <strong>Green (0-60%)</strong> available capacity, 
              <strong>Blue (61-80%)</strong> well-balanced, <strong>Purple (81-100%)</strong> fully allocated, 
              <strong>Red (>100%)</strong> over-allocated.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <div className="flex flex-col items-center">
            <Users className="h-8 w-8 text-gray-600 dark:text-slate-400 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{stats.total}</p>
            <p className="text-sm text-gray-600 dark:text-slate-400">Total</p>
          </div>
        </Card>
        <Card className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-gray-400 rounded mb-2"></div>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{stats.available}</p>
            <p className="text-sm text-gray-600 dark:text-slate-400">Available</p>
          </div>
        </Card>
        <Card className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-green-500 rounded mb-2"></div>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{stats.underUtilized}</p>
            <p className="text-sm text-gray-600 dark:text-slate-400">Under-utilized</p>
          </div>
        </Card>
        <Card className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-primary-500 rounded mb-2"></div>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{stats.wellBalanced}</p>
            <p className="text-sm text-gray-600 dark:text-slate-400">Well-balanced</p>
          </div>
        </Card>
        <Card className="text-center">
          <div className="flex flex-col items-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{stats.overAllocated}</p>
            <p className="text-sm text-gray-600 dark:text-slate-400">Over-allocated</p>
          </div>
        </Card>
      </div>

      <Card title="Personnel Utilization Timeline">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-slate-100 sticky left-0 bg-white dark:bg-slate-800 z-10 min-w-[200px]">
                  Personnel
                </th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-gray-900 dark:text-slate-100">
                  Avg
                </th>
                {months.map((month) => (
                  <th
                    key={month.month}
                    className="text-center py-3 px-2 text-xs font-semibold text-gray-900 dark:text-slate-100 min-w-[80px]"
                  >
                    {month.month_label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {utilizationData.map((person) => (
                <tr key={person.personnel_id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 sticky left-0 bg-white dark:bg-slate-800 z-10">
                    <div className="flex items-center gap-3">
                      {person.profile_image_url ? (
                        <img
                          src={person.profile_image_url}
                          alt={person.personnel_name}
                          className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-600 dark:text-primary-400 font-medium text-xs">
                            {person.personnel_name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 dark:text-slate-100 text-sm truncate">
                          {person.personnel_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                          {person.role_title}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <Badge variant={getUtilizationColor(person.total_utilization)}>
                      {person.total_utilization}%
                    </Badge>
                  </td>
                  {person.utilization_by_month.map((month) => (
                    <td key={month.month} className="py-3 px-2">
                      <UtilizationCell
                        utilization={month.utilization}
                        monthLabel={month.month_label}
                        person={person.personnel_name}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
          <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 mb-2">Legend:</p>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 dark:bg-slate-700 rounded"></div>
              <span className="text-gray-600 dark:text-slate-400">0% - Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
              <span className="text-gray-600 dark:text-slate-400">1-60% - Under-utilized</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
              <span className="text-gray-600 dark:text-slate-400">61-80% - Good balance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-500 rounded"></div>
              <span className="text-gray-600 dark:text-slate-400">81-100% - Fully allocated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded"></div>
              <span className="text-gray-600 dark:text-slate-400">&gt;100% - Over-allocated</span>
            </div>
          </div>
        </div>
      </Card>

      {stats.overAllocated > 0 && (
        <Card>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">
                Over-Allocation Warnings
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
                The following personnel have average utilization above 100%:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {utilizationData
                  .filter((p) => p.total_utilization > 100)
                  .map((person) => (
                    <div
                      key={person.personnel_id}
                      className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800"
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">
                        {person.personnel_name}
                      </span>
                      <Badge variant="red">{person.total_utilization}%</Badge>
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

const UtilizationCell = ({ utilization, monthLabel, person }) => {
  const getColor = (util) => {
    if (util === 0) return 'bg-gray-200 dark:bg-slate-700';
    if (util <= 60) return 'bg-green-500';
    if (util <= 80) return 'bg-blue-500';
    if (util <= 100) return 'bg-purple-500';
    return 'bg-red-500';
  };

  const getIntensity = (util) => {
    if (util === 0) return 'opacity-30';
    if (util <= 25) return 'opacity-40';
    if (util <= 50) return 'opacity-60';
    if (util <= 75) return 'opacity-80';
    return 'opacity-100';
  };

  return (
    <div
      className="group relative"
      title={`${person} - ${monthLabel}: ${utilization}% allocated`}
    >
      <div
        className={`w-full h-8 rounded ${getColor(utilization)} ${getIntensity(utilization)} 
          flex items-center justify-center transition-all hover:opacity-100 hover:ring-2 hover:ring-offset-1 hover:ring-primary-500 cursor-pointer`}
      >
        <span className="text-xs font-semibold text-white opacity-0 group-hover:opacity-100">
          {utilization}%
        </span>
      </div>
    </div>
  );
};

function getUtilizationColor(utilization) {
  if (utilization === 0) return 'gray';
  if (utilization <= 60) return 'green';
  if (utilization <= 80) return 'primary';
  if (utilization <= 100) return 'purple';
  return 'red';
}

export default PersonnelUtilizationChart;
