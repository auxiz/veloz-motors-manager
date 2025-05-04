
import { useProfilesList } from './profiles/useProfilesList';
import { useInviteUser } from './profiles/useInviteUser';
import { useProfileUpdate } from './profiles/useProfileUpdate';
import { useUserManagement } from './profiles/useUserManagement';
import { useState, useCallback } from 'react';

export function useProfiles() {
  const [loadingState, setLoadingState] = useState(false);
  
  // Custom handler for fetching profiles after actions
  const handleProfilesRefresh = useCallback(async () => {
    return await profilesList.fetchAllProfiles();
  }, []);
  
  // Individual hooks
  const profilesList = useProfilesList();
  const inviteUserHook = useInviteUser(handleProfilesRefresh);
  const profileUpdateHook = useProfileUpdate(handleProfilesRefresh);
  const userManagementHook = useUserManagement(handleProfilesRefresh);
  
  // Combined loading state
  const loading = 
    loadingState || 
    profilesList.loading || 
    inviteUserHook.loading || 
    profileUpdateHook.loading || 
    userManagementHook.loading;

  return {
    // From useProfilesList
    profiles: profilesList.profiles,
    fetchAllProfiles: profilesList.fetchAllProfiles,
    
    // From useInviteUser
    inviteUser: inviteUserHook.inviteUser,
    
    // From useProfileUpdate
    updateProfile: profileUpdateHook.updateProfile,
    uploadAvatar: profileUpdateHook.uploadAvatar,
    
    // From useUserManagement
    deactivateUser: userManagementHook.deactivateUser,
    updateUserStatus: userManagementHook.updateUserStatus,
    updateUserRole: userManagementHook.updateUserRole,
    
    // Combined loading state
    loading
  };
}
