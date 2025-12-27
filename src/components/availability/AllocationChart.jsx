import { format, eachMonthOfInterval, addMonths, startOfMonth } from 'date-fns';
import Card from '../common/Card';
import Badge from '../common/Badge';

const AllocationChart = ({ allocations }) => {
  const startDate = startOfMonth(new Date());
  const endDate = addMonths(startDate, 3);
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  const personnelMap = new Map();
  allocations?.forEach((allocation) => {
    if (!personnelMap.has(allocation.personnel_id)) {
      personnelMap.set(allocation.personnel_id, {
        id: allocation.personnel_id,
        name: allocation.personnel_name,
        allocations: [],
      });
    }
    personnelMap.get(allocation.personnel_id).allocations.push(allocation);
  });

  const personnel = Array.from(personnelMap.values());

  const getColorForProject = (projectId, index) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500',
    ];
    return colors[index % colors.length];
  };

  const calculateMonthAllocation = (personnelAllocations, month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = addMonths(monthStart, 1);

    let total = 0;
    const projectAllocations = [];

    personnelAllocations.forEach((allocation) => {
      const allocStart = new Date(allocation.start_date);
      const allocEnd = new Date(allocation.end_date);

      if (allocStart <= monthEnd && allocEnd >= monthStart) {
        total += allocation.allocation_percentage;
        projectAllocations.push(allocation);
      }
    });

    return { total, projects: projectAllocations };
  };

  const projectColors = new Map();
  let colorIndex = 0;

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Project Allocations Timeline</h3>
          <Badge variant="secondary">{personnel.length} Personnel</Badge>
        </div>

        {/* Timeline */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="flex border-b border-gray-200">
              <div className="w-48 flex-shrink-0 p-3 font-medium text-gray-700">Personnel</div>
              {months.map((month) => (
                <div
                  key={month.toISOString()}
                  className="flex-1 min-w-32 p-3 text-center font-medium text-gray-700 border-l border-gray-200"
                >
                  {format(month, 'MMM yyyy')}
                </div>
              ))}
            </div>

            {/* Rows */}
            {personnel.length > 0 ? (
              personnel.map((person) => {
                return (
                  <div key={person.id} className="flex border-b border-gray-200 hover:bg-gray-50">
                    <div className="w-48 flex-shrink-0 p-3">
                      <p className="font-medium text-gray-900 text-sm">{person.name}</p>
                    </div>
                    {months.map((month) => {
                      const { total, projects } = calculateMonthAllocation(
                        person.allocations,
                        month
                      );
                      const isOverAllocated = total > 100;

                      return (
                        <div
                          key={month.toISOString()}
                          className={`flex-1 min-w-32 p-3 border-l border-gray-200 ${
                            isOverAllocated ? 'bg-red-50' : ''
                          }`}
                        >
                          {projects.length > 0 ? (
                            <div className="space-y-1">
                              {projects.map((project) => {
                                if (!projectColors.has(project.project_id)) {
                                  projectColors.set(
                                    project.project_id,
                                    getColorForProject(project.project_id, colorIndex++)
                                  );
                                }
                                const color = projectColors.get(project.project_id);

                                return (
                                  <div key={project.id} className="relative group">
                                    <div
                                      className={`${color} text-white text-xs px-2 py-1 rounded truncate cursor-pointer`}
                                      title={`${project.project_name}: ${project.allocation_percentage}%`}
                                    >
                                      {project.allocation_percentage}%
                                    </div>
                                    <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-10 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                      {project.project_name}: {project.allocation_percentage}%
                                    </div>
                                  </div>
                                );
                              })}
                              {isOverAllocated && (
                                <Badge variant="red" size="sm" className="w-full">
                                  {total}% ⚠️
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <div className="text-center text-gray-400 text-xs">-</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500">No allocations found</div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Project Legend:</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(projectColors.entries()).map(([projectId, color]) => {
              const project = allocations?.find((a) => a.project_id === projectId);
              return (
                <div key={projectId} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${color}`} />
                  <span className="text-sm text-gray-700">{project?.project_name || 'Unknown'}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <span className="font-medium">Note:</span> Red background indicates over-allocation (&gt;100%)
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AllocationChart;

