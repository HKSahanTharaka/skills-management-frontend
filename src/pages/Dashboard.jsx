import { Users, Briefcase, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { usePersonnel } from '../hooks/usePersonnel';
import { useSkills } from '../hooks/useSkills';
import { useProjects } from '../hooks/useProjects';

export const Dashboard = () => {
  const navigate = useNavigate();
  
  // Fetch data - fetch all for accurate counts
  const { data: personnelData, isLoading: isLoadingPersonnel } = usePersonnel({ limit: 100 });
  const { data: skillsData, isLoading: isLoadingSkills } = useSkills({ limit: 100 });
  const { data: projectsData, isLoading: isLoadingProjects } = useProjects({ limit: 100 });

  const isLoading = isLoadingPersonnel || isLoadingSkills || isLoadingProjects;

  // Calculate stats
  const totalPersonnel = personnelData?.pagination?.total || personnelData?.data?.length || 0;
  const totalSkills = skillsData?.pagination?.total || skillsData?.data?.length || 0;
  const totalProjects = projectsData?.pagination?.total || projectsData?.data?.length || 0;
  const activeProjects = projectsData?.data?.filter(p => p.status === 'Active').length || 0;
  const completedProjects = projectsData?.data?.filter(p => p.status === 'Completed').length || 0;
  const planningProjects = projectsData?.data?.filter(p => p.status === 'Planning').length || 0;

  const stats = [
    {
      label: 'Total Personnel',
      value: totalPersonnel,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Active Projects',
      value: activeProjects,
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Total Skills',
      value: totalSkills,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Total Projects',
      value: totalProjects,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here's an overview of your system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card header="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/personnel')}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Add Personnel</h3>
            <p className="text-sm text-gray-600 mt-1">Add a new team member</p>
          </button>
          
          <button
            onClick={() => navigate('/projects')}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all"
          >
            <Briefcase className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Create Project</h3>
            <p className="text-sm text-gray-600 mt-1">Start a new project</p>
          </button>
          
          <button
            onClick={() => navigate('/skills')}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
          >
            <Award className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Add Skill</h3>
            <p className="text-sm text-gray-600 mt-1">Add a new skill to the system</p>
          </button>
        </div>
      </Card>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card header="Projects Overview">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Projects</span>
              <span className="font-semibold text-gray-900">{totalProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Projects</span>
              <span className="font-semibold text-green-600">{activeProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completed Projects</span>
              <span className="font-semibold text-gray-900">{completedProjects}</span>
            </div>
          </div>
        </Card>

        <Card header="System Overview">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Personnel</span>
              <span className="font-semibold text-gray-900">{totalPersonnel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Skills</span>
              <span className="font-semibold text-gray-900">{totalSkills}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Planning Projects</span>
              <span className="font-semibold text-gray-900">{planningProjects}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

