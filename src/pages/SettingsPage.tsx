import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { getCurrentUser, logoutUser } from '@/store/slices/authSlice';
import { addNotification } from '@/store/slices/notificationSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  LogOut,
  Save,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle
} from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector(state => state.auth);

  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    autoRefresh: true,
    soundAlerts: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [user, dispatch]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      dispatch(addNotification({
        type: 'error',
        title: 'Password Mismatch',
        message: 'New password and confirm password do not match',
      }));
      return;
    }

    setIsUpdating(true);
    try {
      // Here you would typically make an API call to update the profile
      // For now, we'll just show a success notification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch(addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully',
      }));

      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update profile',
      }));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(addNotification({
        type: 'success',
        title: 'Logged Out',
        message: 'You have been successfully logged out',
      }));
      navigate('/login');
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        title: 'Logout Failed',
        message: error.message || 'Failed to logout',
      }));
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { variant: 'destructive' as const, color: 'text-red-600' },
      driver: { variant: 'default' as const, color: 'text-blue-600' },
      dispatcher: { variant: 'secondary' as const, color: 'text-green-600' },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.driver;

    return (
      <Badge variant={config.variant} className={config.color}>
        {role.toUpperCase()}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <User className="h-4 w-4 inline mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'notifications'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Bell className="h-4 w-4 inline mr-2" />
                    Notifications
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'security'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Shield className="h-4 w-4 inline mr-2" />
                    Security
                  </button>
                  <button
                    onClick={() => setActiveTab('appearance')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'appearance'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Palette className="h-4 w-4 inline mr-2" />
                    Appearance
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Role:</span>
                        {user && getRoleBadge(user.role)}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showPassword ? 'text' : 'password'}
                              value={profileData.currentPassword}
                              onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={profileData.newPassword}
                              onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                              placeholder="Enter new password"
                            />
                          </div>
                          <div>
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={profileData.confirmPassword}
                              onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notification Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Sound Alerts</h3>
                        <p className="text-sm text-gray-600">Play sound for important notifications</p>
                      </div>
                      <Switch
                        checked={settings.soundAlerts}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, soundAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Auto Refresh</h3>
                        <p className="text-sm text-gray-600">Automatically refresh data every 30 seconds</p>
                      </div>
                      <Switch
                        checked={settings.autoRefresh}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoRefresh: checked }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-yellow-800">Security Recommendations</h3>
                          <p className="text-sm text-yellow-700 mt-1">
                            For enhanced security, consider enabling two-factor authentication and using a strong password.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Session Management</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Manage your active sessions and security settings.
                        </p>
                        <Button variant="outline" size="sm">
                          View Active Sessions
                        </Button>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Add an extra layer of security to your account.
                        </p>
                        <Button variant="outline" size="sm">
                          Enable 2FA
                        </Button>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Login History</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Review your recent login activity.
                        </p>
                        <Button variant="outline" size="sm">
                          View Login History
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'appearance' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Appearance Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Dark Mode</h3>
                        <p className="text-sm text-gray-600">Switch between light and dark themes</p>
                      </div>
                      <Switch
                        checked={settings.darkMode}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, darkMode: checked }))}
                      />
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Theme Preview</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg bg-white">
                          <div className="w-full h-8 bg-gray-200 rounded mb-2"></div>
                          <div className="w-3/4 h-4 bg-gray-200 rounded mb-1"></div>
                          <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                          <p className="text-xs text-gray-600 mt-2">Light Theme</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-gray-900">
                          <div className="w-full h-8 bg-gray-700 rounded mb-2"></div>
                          <div className="w-3/4 h-4 bg-gray-700 rounded mb-1"></div>
                          <div className="w-1/2 h-4 bg-gray-700 rounded"></div>
                          <p className="text-xs text-gray-400 mt-2">Dark Theme</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <Card className="mt-8 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-red-600">Logout</h3>
                <p className="text-sm text-gray-600">Sign out of your account</p>
              </div>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
