import { useState, useMemo } from 'react';
import { Calendar, TrendingUp, Users } from 'lucide-react';
import {
  useAvailability,
  useCreateAvailability,
  useUpdateAvailability,
  useDeleteAvailability,
  useProjectAllocations,
} from '../hooks/useMatching';
import { usePersonnel } from '../hooks/usePersonnel';
import { useProjects } from '../hooks/useProjects';
import Select from '../components/common/Select';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import AvailabilityCalendar from '../components/availability/AvailabilityCalendar';
import AllocationChart from '../components/availability/AllocationChart';

const AvailabilityPage = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedPersonnel, setSelectedPersonnel] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const { data: personnelData } = usePersonnel({ limit: 100 });
  const personnel = personnelData?.data || [];

  const { data: projectsData } = useProjects({ limit: 100 });
  const projects = projectsData?.data || [];

  const { data: availabilityData, isLoading: isLoadingAvailability } = useAvailability(
    selectedPersonnel,
    dateRange,
    { enabled: !!selectedPersonnel && activeTab === 'calendar' }
  );

  // Fetch allocations for selected project
  const { data: allocationsData, isLoading: isLoadingAllocations } = useProjectAllocations(
    selectedProject
  );

  const createMutation = useCreateAvailability();
  const updateMutation = useUpdateAvailability();
  const deleteMutation = useDeleteAvailability();

  const handleAddPeriod = async (data) => {
    await createMutation.mutateAsync(data);
  };

  const handleEditPeriod = async (data) => {
    await updateMutation.mutateAsync(data);
  };

  const handleDeletePeriod = async (id) => {
    await deleteMutation.mutateAsync(id);
  };

  const tabs = [
    { id: 'calendar', label: 'Availability Calendar', icon: Calendar },
    { id: 'allocations', label: 'Project Allocations', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Availability & Allocation Management</h1>
        <p className="mt-2 text-gray-600 dark:text-slate-400">
          Manage personnel availability and track project allocations
        </p>
      </div>

      {/* Tabs */}
      <Card>
        <div className="border-b border-gray-200 dark:border-slate-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </Card>

      {/* Tab Content */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Personnel Selector */}
          <Card>
            <Select
              label="Select Personnel"
              placeholder="Choose a person to manage availability"
              options={[
                { value: '', label: 'Select personnel...' },
                ...personnel.map((p) => ({
                  value: p.id,
                  label: `${p.name} (${p.email})`,
                })),
              ]}
              value={selectedPersonnel}
              onChange={(e) => setSelectedPersonnel(e.target.value)}
            />
          </Card>

          {/* Calendar */}
          {selectedPersonnel ? (
            isLoadingAvailability ? (
              <Loading />
            ) : (
              <AvailabilityCalendar
                personnelId={selectedPersonnel}
                availabilityData={availabilityData}
                onAddPeriod={handleAddPeriod}
                onEditPeriod={handleEditPeriod}
                onDeletePeriod={handleDeletePeriod}
              />
            )
          ) : (
            <Card>
              <p className="text-center text-gray-500 dark:text-slate-400 py-8">
                Please select personnel to view their availability calendar
              </p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'allocations' && (
        <div className="space-y-6">
          {/* Project Selector */}
          <Card>
            <Select
              label="Select Project"
              placeholder="Choose a project to view allocations"
              options={[
                { value: '', label: 'Select project...' },
                ...projects.map((p) => ({
                  value: p.id,
                  label: `${p.project_name} (${p.status})`,
                })),
              ]}
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            />
          </Card>

          {selectedProject ? (
            isLoadingAllocations ? (
              <Loading />
            ) : allocationsData && allocationsData.length > 0 ? (
              <AllocationChart allocations={allocationsData} />
            ) : (
              <Card>
                <p className="text-center text-gray-500 dark:text-slate-400 py-8">
                  No allocations found for this project. Allocate personnel to this project to see them here.
                </p>
              </Card>
            )
          ) : (
            <Card>
              <p className="text-center text-gray-500 dark:text-slate-400 py-8">
                Please select a project to view allocations
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AvailabilityPage;

