import { Users, Briefcase, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { usePersonnel } from '../hooks/usePersonnel';
import { useSkills } from '../hooks/useSkills';
import { useProjects } from '../hooks/useProjects';

export const Dashboard = () => {
  const navigate = useNavigate();

  const { data: personnelData, isLoading: isLoadingPersonnel } = usePersonnel({ limit: 100 });
  const { data: skillsData, isLoading: isLoadingSkills } = useSkills({ limit: 100 });
  const { data: projectsData, isLoading: isLoadingProjects } = useProjects({ limit: 100 });

  const isLoading = isLoadingPersonnel || isLoadingSkills || isLoadingProjects;
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
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-slate-400">Welcome back! Here's an overview of your system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card header="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/personnel')}
            className="p-4 text-left border border-gray-200 dark:border-slate-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
          >
            <Users className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-slate-100">Add Personnel</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Add a new team member</p>
          </button>

          <button
            onClick={() => navigate('/projects')}
            className="p-4 text-left border border-gray-200 dark:border-slate-700 rounded-lg hover:border-green-300 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
          >
            <Briefcase className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-slate-100">Create Project</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Start a new project</p>
          </button>

          <button
            onClick={() => navigate('/skills')}
            className="p-4 text-left border border-gray-200 dark:border-slate-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
          >
            <Award className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-slate-100">Add Skill</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Add a new skill to the system</p>
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card header="Projects Overview">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-400">Total Projects</span>
              <span className="font-semibold text-gray-900 dark:text-slate-100">{totalProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-400">Active Projects</span>
              <span className="font-semibold text-gray-900 dark:text-slate-100">{activeProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-400">Completed Projects</span>
              <span className="font-semibold text-gray-900 dark:text-slate-100">{completedProjects}</span>
            </div>
          </div>
        </Card>

        <Card header="System Overview">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-400">Total Personnel</span>
              <span className="font-semibold text-gray-900 dark:text-slate-100">{totalPersonnel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-400">Total Skills</span>
              <span className="font-semibold text-gray-900 dark:text-slate-100">{totalSkills}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-400">Planning Projects</span>
              <span className="font-semibold text-gray-900 dark:text-slate-100">{planningProjects}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

