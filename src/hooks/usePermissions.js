import { useAuthStore } from '../store/authStore';

export const usePermissions = () => {
  const user = useAuthStore(state => state.user);

  // Role checks
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isManagerOrAdmin = isAdmin || isManager;

  return {
    //Role Checks
    isAdmin,
    isManager,
    isManagerOrAdmin,

    //Personnel Permissions
    canViewAllPersonnel: isManagerOrAdmin,
    canCreatePersonnel: isManagerOrAdmin,
    canEditAnyPersonnel: isManagerOrAdmin,
    canDeletePersonnel: isAdmin, // Only admin can delete
    canExportPersonnel: isManagerOrAdmin,

    //Skills Permissions
    canViewSkills: isManagerOrAdmin,
    canCreateSkill: isManagerOrAdmin,
    canEditSkill: isManagerOrAdmin,
    canDeleteSkill: isAdmin, // Only admin can delete

    //Projects Permissions
    canViewAllProjects: isManagerOrAdmin,
    canCreateProject: isManagerOrAdmin,
    canEditProject: isManagerOrAdmin,
    canDeleteProject: isAdmin, // Only admin can delete
    canManageProjectSkills: isManagerOrAdmin,

    //Matching System Permissions
    canUseMatching: isManagerOrAdmin,
    canViewMatchResults: isManagerOrAdmin,
    canAssignPersonnelToProject: isManagerOrAdmin,

    //Availability Permissions
    canViewAllAvailability: isManagerOrAdmin,
    canManageAvailability: isManagerOrAdmin,

    //Allocation Permissions
    canViewAllAllocations: isManagerOrAdmin,
    canCreateAllocation: isManagerOrAdmin,
    canEditAllocation: isManagerOrAdmin,
    canDeleteAllocation: isManagerOrAdmin,

    //User Management Permissions
    canManageUsers: isAdmin, // Only admin
    canChangeUserRoles: isAdmin, // Only admin
    canDeleteUsers: isAdmin, // Only admin

    //Dashboard & Reports
    canViewFullDashboard: isManagerOrAdmin,
    canExportReports: isManagerOrAdmin,
    canViewTeamAnalytics: isManagerOrAdmin,

    //System Administration
    canAccessSystemSettings: isAdmin, // Only admin
    canViewSystemLogs: isAdmin, // Only admin
    canManageIntegrations: isAdmin, // Only admin
  };
};

export default usePermissions;

