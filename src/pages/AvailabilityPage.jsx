import { useState, useMemo } from 'react';
import { Calendar, TrendingUp, Users, HelpCircle } from 'lucide-react';
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
import HelpModal from '../components/common/HelpModal';
import Button from '../components/common/Button';
import AvailabilityCalendar from '../components/availability/AvailabilityCalendar';
import AllocationChart from '../components/availability/AllocationChart';

const AvailabilityPage = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedPersonnel, setSelectedPersonnel] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [showHelp, setShowHelp] = useState(false);
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Availability & Allocation Management</h1>
          <p className="mt-2 text-gray-600 dark:text-slate-400">
            Manage personnel availability and track project allocations to optimize resource utilization
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowHelp(true)}
          leftIcon={<HelpCircle className="h-4 w-4" />}
        >
          Help
        </Button>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3"> Quick Guide</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <h4 className="font-semibold text-primary-600 dark:text-primary-400 mb-2 flex items-center gap-2">
              <span className="text-xl"></span> Availability Calendar
            </h4>
            <ul className="text-sm text-gray-600 dark:text-slate-400 space-y-1">
              <li>• Define when people are available to work</li>
              <li>• Set percentage for part-time availability</li>
              <li>• Prevents over-allocation automatically</li>
              <li>• Color-coded for easy visualization</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
              <span className="text-xl"></span> Project Allocations
            </h4>
            <ul className="text-sm text-gray-600 dark:text-slate-400 space-y-1">
              <li>• View team members assigned to projects</li>
              <li>• See allocation percentages over time</li>
              <li>• Identify over-allocation (&gt;100%)</li>
              <li>• Plan resource distribution effectively</li>
            </ul>
          </div>
        </div>
      </div>

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

      {activeTab === 'calendar' && (
        <div className="space-y-6">
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
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
                  Select Personnel to Get Started
                </h3>
                <p className="text-gray-600 dark:text-slate-400 mb-4">
                  Choose a person from the dropdown above to view and manage their availability calendar.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-w-md mx-auto text-left">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong> Tip:</strong> Setting availability helps prevent over-allocation 
                    and ensures personnel are only assigned when they have capacity.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'allocations' && (
        <div className="space-y-6">
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
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
                    No Team Members Allocated Yet
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400 mb-4">
                    This project doesn't have any personnel assigned yet.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-w-md mx-auto text-left">
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                      <strong>To allocate personnel:</strong>
                    </p>
                    <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                      <li>Go to Project Matching page</li>
                      <li>Select this project and find matches</li>
                      <li>Click "Assign" on suitable candidates</li>
                    </ol>
                  </div>
                </div>
              </Card>
            )
          ) : (
            <Card>
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
                  Select a Project to View Team
                </h3>
                <p className="text-gray-600 dark:text-slate-400 mb-4">
                  Choose a project from the dropdown above to see who's allocated and their utilization.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-w-md mx-auto text-left">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong> Tip:</strong> Use the timeline to identify scheduling conflicts 
                    and ensure balanced workload distribution across your team.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      <HelpModal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)} 
        topic={activeTab === 'calendar' ? 'availability' : 'allocation'}
      />
    </div>
  );
};

export default AvailabilityPage;

