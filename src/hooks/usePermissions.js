import { useAuthStore } from '../store/authStore';

/**
 * Custom hook for checking user permissions
 * 
 * Based on role-based access control (RBAC):
 * - Admin: Can do everything
 * - Manager: Can do most things except delete resources
 * - User: Can only manage own data
 */
export const usePermissions = () => {
  const user = useAuthStore(state => state.user);

  // Role checks
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isUser = user?.role === 'user';
  const isManagerOrAdmin = isAdmin || isManager;

  return {
    // ===== Role Checks =====
    isAdmin,
    isManager,
    isUser,
    isManagerOrAdmin,

    // ===== Personnel Permissions =====
    canViewAllPersonnel: isManagerOrAdmin,
    canCreatePersonnel: isManagerOrAdmin,
    canEditAnyPersonnel: isManagerOrAdmin,
    canDeletePersonnel: isAdmin, // Only admin can delete
    canExportPersonnel: isManagerOrAdmin,

    // ===== Skills Permissions =====
    canViewSkills: true, // All authenticated users
    canCreateSkill: isManagerOrAdmin,
    canEditSkill: isManagerOrAdmin,
    canDeleteSkill: isAdmin, // Only admin can delete

    // ===== Projects Permissions =====
    canViewAllProjects: isManagerOrAdmin,
    canCreateProject: isManagerOrAdmin,
    canEditProject: isManagerOrAdmin,
    canDeleteProject: isAdmin, // Only admin can delete
    canManageProjectSkills: isManagerOrAdmin,

    // ===== Matching System Permissions =====
    canUseMatching: isManagerOrAdmin,
    canViewMatchResults: isManagerOrAdmin,
    canAssignPersonnelToProject: isManagerOrAdmin,

    // ===== Availability Permissions =====
    canViewAllAvailability: isManagerOrAdmin,
    canManageOwnAvailability: true, // All users

    // ===== Allocation Permissions =====
    canViewAllAllocations: isManagerOrAdmin,
    canCreateAllocation: isManagerOrAdmin,
    canEditAllocation: isManagerOrAdmin,
    canDeleteAllocation: isManagerOrAdmin,

    // ===== Dashboard & Reports =====
    canViewFullDashboard: isManagerOrAdmin,
    canExportReports: isManagerOrAdmin,
    canViewTeamAnalytics: isManagerOrAdmin,

    // ===== Conditional Permissions =====
    /**
     * Check if user can modify a resource they own
     * @param {number} resourceOwnerId - The user_id of the resource owner
     * @returns {boolean}
     */
    canModifyOwn: (resourceOwnerId) => {
      if (isManagerOrAdmin) return true;
      return user?.id === resourceOwnerId;
    },

    /**
     * Check if user can view a personnel record
     * @param {number} personnelUserId - The user_id associated with personnel
     * @returns {boolean}
     */
    canViewPersonnel: (personnelUserId) => {
      if (isManagerOrAdmin) return true;
      return user?.id === personnelUserId;
    },

    /**
     * Check if user can edit a personnel record
     * @param {number} personnelUserId - The user_id associated with personnel
     * @returns {boolean}
     */
    canEditPersonnel: (personnelUserId) => {
      if (isManagerOrAdmin) return true;
      return user?.id === personnelUserId;
    },

    /**
     * Check if user can view a project
     * Regular users can only view projects they're assigned to
     * @param {boolean} isAssignedToProject - Whether user is assigned to the project
     * @returns {boolean}
     */
    canViewProject: (isAssignedToProject) => {
      if (isManagerOrAdmin) return true;
      return isAssignedToProject;
    },
  };
};

export default usePermissions;

