import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchHauls } from '@/store/slices/haulsSlice';
import { apiService } from '@/lib/api';
import { addNotification } from '@/store/slices/notificationSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Truck, 
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { Haul } from '@/lib/api';

const ReportsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { hauls, isLoading } = useAppSelector(state => state.hauls);
  const { user, isAuthenticated } = useAppSelector(state => state.auth);

  // Access control - only admins can view reports
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'admin') {
      dispatch(addNotification({
        type: 'error',
        title: 'Access Denied',
        message: 'You do not have permission to view reports. Only administrators can access this page.',
      }));
      navigate('/dashboard');
      return;
    }
  }, [user, isAuthenticated, navigate, dispatch]);

  // Don't render anything if user is not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const [timeFilter, setTimeFilter] = useState('30');
  const [filteredHauls, setFilteredHauls] = useState<Haul[]>([]);
  const [stats, setStats] = useState({
    totalHauls: 0,
    completedHauls: 0,
    pendingHauls: 0,
    inProgressHauls: 0,
    cancelledHauls: 0,
    totalRevenue: 0,
    averageRevenue: 0,
    totalDistance: 0,
    averageDistance: 0,
  });

  useEffect(() => {
    dispatch(fetchHauls());
  }, [dispatch]);

  useEffect(() => {
    if (hauls.length > 0) {
      filterHaulsByTime();
    }
  }, [hauls, timeFilter]);

  useEffect(() => {
    if (filteredHauls.length > 0) {
      calculateStats();
    }
  }, [filteredHauls]);

  const filterHaulsByTime = () => {
    const now = new Date();
    const daysAgo = new Date(now.getTime() - parseInt(timeFilter) * 24 * 60 * 60 * 1000);
    
    const filtered = hauls.filter(haul => {
      const haulDate = new Date(haul.created_at);
      return haulDate >= daysAgo;
    });
    
    setFilteredHauls(filtered);
  };

  const calculateStats = () => {
    const completed = filteredHauls.filter(h => h.status === 'completed');
    const pending = filteredHauls.filter(h => h.status === 'pending');
    const inProgress = filteredHauls.filter(h => h.status === 'in_progress');
    const cancelled = filteredHauls.filter(h => h.status === 'cancelled');
    
    const totalRevenue = completed.reduce((sum, haul) => sum + (haul.final_price || haul.quoted_price || 0), 0);
    const totalDistance = filteredHauls.reduce((sum, haul) => sum + (haul.distance_miles || 0), 0);
    
    setStats({
      totalHauls: filteredHauls.length,
      completedHauls: completed.length,
      pendingHauls: pending.length,
      inProgressHauls: inProgress.length,
      cancelledHauls: cancelled.length,
      totalRevenue,
      averageRevenue: completed.length > 0 ? totalRevenue / completed.length : 0,
      totalDistance,
      averageDistance: filteredHauls.length > 0 ? totalDistance / filteredHauls.length : 0,
    });
  };

  const formatCurrency = (amount: number) => {
    return `Ksh ${amount.toLocaleString()}`;
  };

  const getStatusDistribution = () => {
    const total = filteredHauls.length;
    if (total === 0) return [];

    return [
      { status: 'Completed', count: stats.completedHauls, percentage: (stats.completedHauls / total) * 100, color: 'bg-green-500' },
      { status: 'In Progress', count: stats.inProgressHauls, percentage: (stats.inProgressHauls / total) * 100, color: 'bg-blue-500' },
      { status: 'Pending', count: stats.pendingHauls, percentage: (stats.pendingHauls / total) * 100, color: 'bg-yellow-500' },
      { status: 'Cancelled', count: stats.cancelledHauls, percentage: (stats.cancelledHauls / total) * 100, color: 'bg-red-500' },
    ];
  };

  const getTopHauls = () => {
    return filteredHauls
      .filter(haul => haul.final_price || haul.quoted_price)
      .sort((a, b) => (b.final_price || b.quoted_price || 0) - (a.final_price || a.quoted_price || 0))
      .slice(0, 5);
  };

  const exportReport = () => {
    const reportData = {
      period: `${timeFilter} days`,
      stats,
      hauls: filteredHauls,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `haul-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    dispatch(addNotification({
      type: 'success',
      title: 'Report Exported',
      message: 'Report has been downloaded successfully',
    }));
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                Admin Only
              </Badge>
            </div>
            <p className="text-gray-600">Comprehensive insights into your haul operations</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hauls</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHauls}</div>
              <p className="text-xs text-muted-foreground">
                Last {timeFilter} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                From completed hauls
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(stats.averageRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Per completed haul
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalDistance.toLocaleString()} miles
              </div>
              <p className="text-xs text-muted-foreground">
                Average {stats.averageDistance.toFixed(1)} miles per haul
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Haul Status Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getStatusDistribution().map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium">{item.status}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{item.count}</span>
                      <span className="text-sm text-gray-500">({item.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Revenue Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Completed Hauls</span>
                  <span className="text-sm text-gray-600">{stats.completedHauls}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Revenue</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(stats.totalRevenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average per Haul</span>
                  <span className="text-sm text-blue-600">
                    {formatCurrency(stats.averageRevenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm text-gray-600">
                    {stats.totalHauls > 0 ? ((stats.completedHauls / stats.totalHauls) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Revenue Hauls */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Top Revenue Hauls</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getTopHauls().length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hauls with revenue data found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getTopHauls().map((haul, index) => (
                  <div key={haul.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Haul #{haul.id} - {haul.load_description}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {haul.pickup_city} → {haul.delivery_city}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        {formatCurrency(haul.final_price || haul.quoted_price || 0)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={haul.status === 'completed' ? 'default' : 'secondary'}>
                          {haul.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(haul.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Efficiency Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="text-sm font-semibold">
                  {stats.totalHauls > 0 ? ((stats.completedHauls / stats.totalHauls) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cancellation Rate</span>
                <span className="text-sm font-semibold text-red-600">
                  {stats.totalHauls > 0 ? ((stats.cancelledHauls / stats.totalHauls) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Hauls</span>
                <span className="text-sm font-semibold text-blue-600">
                  {stats.inProgressHauls + stats.pendingHauls}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Distance Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Distance</span>
                <span className="text-sm font-semibold">
                  {stats.totalDistance.toLocaleString()} miles
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average per Haul</span>
                <span className="text-sm font-semibold">
                  {stats.averageDistance.toFixed(1)} miles
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Revenue per Mile</span>
                <span className="text-sm font-semibold text-green-600">
                  {stats.totalDistance > 0 ? formatCurrency(stats.totalRevenue / stats.totalDistance) : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Revenue Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="text-sm font-semibold text-green-600">
                  {formatCurrency(stats.totalRevenue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Revenue</span>
                <span className="text-sm font-semibold">
                  {formatCurrency(stats.averageRevenue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Revenue per Day</span>
                <span className="text-sm font-semibold text-blue-600">
                  {formatCurrency(stats.totalRevenue / parseInt(timeFilter))}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
