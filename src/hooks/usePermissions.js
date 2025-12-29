import { useAuthStore } from '../store/authStore';

export const usePermissions = () => {
  const user = useAuthStore(state => state.user);

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isManagerOrAdmin = isAdmin || isManager;

  return {
    isAdmin,
    isManager,
    isManagerOrAdmin,

    canViewAllPersonnel: isManagerOrAdmin,
    canCreatePersonnel: isManagerOrAdmin,
    canEditAnyPersonnel: isManagerOrAdmin,
    canDeletePersonnel: isAdmin,
    canExportPersonnel: isManagerOrAdmin,

    canViewSkills: isManagerOrAdmin,
    canCreateSkill: isManagerOrAdmin,
    canEditSkill: isManagerOrAdmin,
    canDeleteSkill: isAdmin,

    canViewAllProjects: isManagerOrAdmin,
    canCreateProject: isManagerOrAdmin,
    canEditProject: isManagerOrAdmin,
    canDeleteProject: isAdmin,
    canManageProjectSkills: isManagerOrAdmin,

    canUseMatching: isManagerOrAdmin,
    canViewMatchResults: isManagerOrAdmin,
    canAssignPersonnelToProject: isManagerOrAdmin,

    canViewAllAvailability: isManagerOrAdmin,
    canManageAvailability: isManagerOrAdmin,

    canViewAllAllocations: isManagerOrAdmin,
    canCreateAllocation: isManagerOrAdmin,
    canEditAllocation: isManagerOrAdmin,
    canDeleteAllocation: isManagerOrAdmin,

    canManageUsers: isAdmin,
    canChangeUserRoles: isAdmin,
    canDeleteUsers: isAdmin,

    canViewFullDashboard: isManagerOrAdmin,
    canExportReports: isManagerOrAdmin,
    canViewTeamAnalytics: isManagerOrAdmin,

    canAccessSystemSettings: isAdmin,
    canViewSystemLogs: isAdmin,
    canManageIntegrations: isAdmin,
  };
};

export default usePermissions;

