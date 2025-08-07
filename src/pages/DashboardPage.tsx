import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchHauls, setFilters } from '@/store/slices/haulsSlice';
import { getCurrentUser, logoutUser } from '@/store/slices/authSlice';
import { addNotification } from '@/store/slices/notificationSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Truck, 
  Package, 
  MapPin, 
  Calendar, 
  User, 
  LogOut, 
  Plus, 
  Filter,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const { hauls, isLoading, filters, total } = useAppSelector(state => state.hauls);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Get current user if not already loaded
    if (!user) {
      dispatch(getCurrentUser());
    }

    // Fetch hauls
    dispatch(fetchHauls(filters));
  }, [isAuthenticated, navigate, dispatch, user, filters]);

  useEffect(() => {
    // Calculate stats
    const newStats = {
      total: hauls.length,
      pending: hauls.filter(h => h.status === 'pending').length,
      inProgress: hauls.filter(h => h.status === 'in_progress').length,
      completed: hauls.filter(h => h.status === 'completed').length,
    };
    setStats(newStats);
  }, [hauls]);

  const handleFilterChange = (filter: string) => {
    dispatch(setFilters({ filter: filter as any, page: 1 }));
    dispatch(fetchHauls({ ...filters, filter: filter as any, page: 1 }));
  };

  const handleRefresh = () => {
    dispatch(fetchHauls(filters));
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
        message: error || 'An error occurred during logout',
      }));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock },
      assigned: { variant: 'default' as const, icon: AlertCircle },
      in_progress: { variant: 'default' as const, icon: TrendingUp },
      completed: { variant: 'default' as const, icon: CheckCircle },
      cancelled: { variant: 'destructive' as const, icon: AlertCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Truck className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Haul Hub</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.name}</span>
                <Badge variant="outline" className="text-xs">
                  {user?.role}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hauls</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/create-haul')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Haul
            </Button>
            
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filters.filter || ''} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter hauls" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Hauls</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="my_hauls">My Hauls</SelectItem>
                <SelectItem value="my_assignments">My Assignments</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Hauls List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : hauls.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hauls found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first haul</p>
                <Button onClick={() => navigate('/create-haul')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Haul
                </Button>
              </CardContent>
            </Card>
          ) : (
            hauls.map((haul) => (
              <Card key={haul.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/hauls/${haul.id}`)}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Haul #{haul.id}
                      </h3>
                      <p className="text-gray-600 mb-2">{haul.load_description}</p>
                    </div>
                    {getStatusBadge(haul.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          From: {haul.pickup_city}, {haul.pickup_state}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          To: {haul.delivery_city}, {haul.delivery_state}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Pickup: {formatDate(haul.pickup_date)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Delivery: {formatDate(haul.delivery_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Distance: {haul.distance_miles || 'N/A'} miles</span>
                      <span>Load: {haul.load_type}</span>
                      {haul.quoted_price && (
                        <span className="font-medium text-green-600">
                          Ksh {haul.quoted_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      Created {formatDate(haul.created_at)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {total > filters.per_page && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === 1}
                onClick={() => {
                  dispatch(setFilters({ page: filters.page - 1 }));
                  dispatch(fetchHauls({ ...filters, page: filters.page - 1 }));
                }}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {filters.page} of {Math.ceil(total / filters.per_page)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page >= Math.ceil(total / filters.per_page)}
                onClick={() => {
                  dispatch(setFilters({ page: filters.page + 1 }));
                  dispatch(fetchHauls({ ...filters, page: filters.page + 1 }));
                }}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
