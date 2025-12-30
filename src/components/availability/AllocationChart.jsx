import { useState } from 'react';
import { format, eachMonthOfInterval, addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

const AllocationChart = ({ allocations }) => {
  const [currentStartDate, setCurrentStartDate] = useState(startOfMonth(new Date()));
  
  const startDate = currentStartDate;
  const endDate = addMonths(startDate, 3);
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  const handlePrevMonth = () => {
    setCurrentStartDate(subMonths(currentStartDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentStartDate(addMonths(currentStartDate, 1));
  };

  const handleToday = () => {
    setCurrentStartDate(startOfMonth(new Date()));
  };

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
      'bg-primary-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-warning-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-danger-500',
      'bg-teal-500',
    ];
    return colors[index % colors.length];
  };

  const calculateMonthAllocation = (personnelAllocations, month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

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

  const projectColorsMap = new Map();
  const projectNamesMap = new Map();
  let colorIndex = 0;

  return (
    <Card>
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                 How to Read This Chart
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Each row shows a person's allocations across months. Numbers indicate allocation percentage. 
                <strong className="text-blue-900 dark:text-blue-100"> Red background = Over-allocated (exceeds 100%)</strong>. 
                Hover over colored boxes to see project details.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Project Allocations Timeline</h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handlePrevMonth} size="sm" title="Previous month">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleToday} 
                size="sm"
                className="text-xs font-medium min-w-[80px]"
              >
                Today
              </Button>
              <Button variant="ghost" onClick={handleNextMonth} size="sm" title="Next month">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-slate-400">
              {format(startDate, 'MMM yyyy')} - {format(endDate, 'MMM yyyy')}
            </span>
            <Badge variant="secondary">{personnel.length} Personnel</Badge>
            <Badge variant="primary">{projectColorsMap.size} Projects</Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="flex border-b border-gray-200 dark:border-slate-700">
              <div className="w-48 flex-shrink-0 p-3 font-medium text-gray-700 dark:text-slate-300">Personnel</div>
              {months.map((month) => (
                <div
                  key={month.toISOString()}
                  className="flex-1 min-w-32 p-3 text-center font-medium text-gray-700 dark:text-slate-300 border-l border-gray-200 dark:border-slate-700"
                >
                  {format(month, 'MMM yyyy')}
                </div>
              ))}
            </div>

            {personnel.length > 0 ? (
              personnel.map((person) => {
                return (
                  <div key={person.id} className="flex border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800">
                    <div className="w-48 flex-shrink-0 p-3">
                      <p className="font-medium text-gray-900 dark:text-slate-100 text-sm">{person.name}</p>
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
                          className={`flex-1 min-w-32 p-3 border-l border-gray-200 dark:border-slate-700 ${isOverAllocated ? 'bg-red-50 dark:bg-red-900/30' : ''
                            }`}
                        >
                          {projects.length > 0 ? (
                            <div className="space-y-1">
                              {projects.map((project) => {
                                if (!projectColorsMap.has(project.project_id)) {
                                  projectColorsMap.set(
                                    project.project_id,
                                    getColorForProject(project.project_id, colorIndex++)
                                  );
                                  projectNamesMap.set(project.project_id, project.project_name);
                                }
                                const color = projectColorsMap.get(project.project_id);

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
                                  {total}%
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <div className="text-center text-gray-400 dark:text-slate-500 text-xs">-</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-slate-400">No allocations found</div>
            )}
          </div>
        </div>

        {projectColorsMap.size > 0 && (
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3"> Project Colors:</p>
            <div className="flex flex-wrap gap-3">
              {Array.from(projectColorsMap.entries()).map(([projectId, color]) => {
                const projectName = projectNamesMap.get(projectId) || 'Unknown';
                return (
                  <div key={projectId} className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700">
                    <div className={`w-4 h-4 rounded ${color}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{projectName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AllocationChart;

