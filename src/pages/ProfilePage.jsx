import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { User, Mail, Calendar, Save, Lock, Eye, EyeOff, Briefcase, Award, FileText } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import RoleBadge from '../components/common/RoleBadge';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user: authUser, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      const response = await api.get('/auth/me');
      return response.data.data;
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        email: profile.email || '',
      }));
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put('/auth/me', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries(['currentUserProfile']);
      setUser({ ...authUser, email: data.data.email });
      setIsEditingPassword(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error?.message || 'Failed to update profile';
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const updateData = {};
    
    if (formData.email !== profile?.email) {
      updateData.email = formData.email;
    }

    if (isEditingPassword) {
      if (!formData.currentPassword) {
        toast.error('Current password is required');
        return;
      }
      if (!formData.newPassword) {
        toast.error('New password is required');
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
    }

    if (Object.keys(updateData).length === 0) {
      toast.error('No changes to save');
      return;
    }

    updateProfileMutation.mutate(updateData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger-600 dark:text-danger-400">
          {error.response?.data?.error?.message || 'Failed to load profile'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">Manage your account settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              {profile?.personnel?.profile_image_url ? (
                <img
                  src={profile.personnel.profile_image_url}
                  alt={profile.personnel.name}
                  className="h-32 w-32 rounded-full object-cover border-4 border-gray-100 dark:border-slate-700 mx-auto"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center border-4 border-gray-50 dark:border-slate-700 mx-auto">
                  <User className="h-16 w-16 text-primary-600 dark:text-primary-400" />
                </div>
              )}

              <div className="mt-4">
                {profile?.personnel?.name && (
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {profile.personnel.name}
                  </h2>
                )}
                <p className="text-gray-600 dark:text-slate-400 text-sm mt-1">{profile?.email}</p>
                <div className="flex justify-center mt-3">
                  <RoleBadge role={profile?.role} />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-600 dark:text-slate-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-gray-500 dark:text-slate-400 text-xs">Member since</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {new Date(profile?.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {profile?.personnel && (
            <Card className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Personnel Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                    <Briefcase className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Role Title</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {profile.personnel.role_title}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-success-50 dark:bg-success-900/30 rounded-lg">
                    <Award className="h-4 w-4 text-success-600 dark:text-success-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Experience Level</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {profile.personnel.experience_level}
                    </p>
                  </div>
                </div>

                {profile.personnel.bio && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-info-50 dark:bg-info-900/30 rounded-lg">
                      <FileText className="h-4 w-4 text-info-600 dark:text-info-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Bio</p>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {profile.personnel.bio}
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => navigate(`/personnel/${profile.personnel.id}`)}
                >
                  View Full Personnel Profile
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Account Settings
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Change Password
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                      Update your password to keep your account secure
                    </p>
                  </div>
                  {!isEditingPassword && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingPassword(true)}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  )}
                </div>

                {isEditingPassword && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type={showCurrentPassword ? 'text' : 'password'}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="pl-10 pr-10"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                        >
                          {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="pl-10 pr-10"
                          placeholder="Enter new password (min. 6 characters)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                        >
                          {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="pl-10 pr-10"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditingPassword(false);
                        setFormData(prev => ({
                          ...prev,
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        }));
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="flex-1"
                >
                  {updateProfileMutation.isPending ? (
                    'Saving...'
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

