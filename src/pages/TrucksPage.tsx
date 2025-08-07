import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { apiService } from '@/lib/api';
import { addNotification } from '@/store/slices/notificationSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Truck, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  User,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Save,
  X
} from 'lucide-react';
import { Truck as TruckType } from '@/lib/api';

const TrucksPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);

  // Access control - only admins and dispatchers can manage trucks
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'admin' && user?.role !== 'dispatcher') {
      dispatch(addNotification({
        type: 'error',
        title: 'Access Denied',
        message: 'You do not have permission to manage trucks. Only administrators and dispatchers can access this page.',
      }));
      navigate('/dashboard');
      return;
    }
  }, [user, isAuthenticated, navigate, dispatch]);

  // Don't render anything if user is not authorized
  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'dispatcher')) {
    return null;
  }

  const [trucks, setTrucks] = useState<TruckType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTruck, setEditingTruck] = useState<TruckType | null>(null);
  const [newTruck, setNewTruck] = useState({
    make: '',
    model: '',
    year: '',
    license_plate: '',
    capacity: '',
    fuel_type: '',
    status: 'available' as const,
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrucks();
    }
  }, [isAuthenticated]);

  const fetchTrucks = async () => {
    setIsLoading(true);
    setHasError(false); // Reset error state
    try {
      console.log('Fetching trucks...');
      const response = await apiService.getTrucks();
      console.log('Trucks response:', response);
      setTrucks(response.data!.trucks);
    } catch (error: any) {
      console.error('Error fetching trucks:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'An error occurred while fetching trucks';
      
      if (error.message.includes('Unable to connect')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (error.message.includes('Server error')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message.includes('Service temporarily unavailable')) {
        errorMessage = 'Service temporarily unavailable. Please try again later.';
      } else if (error.message.includes('Access denied')) {
        errorMessage = 'Your session has expired. Please log in again.';
        // Redirect to login if session expired
        navigate('/login');
        return;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch(addNotification({
        type: 'error',
        title: 'Failed to fetch trucks',
        message: errorMessage,
      }));
      setHasError(true); // Set error state
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTruck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTruck.make || !newTruck.model || !newTruck.license_plate) {
      dispatch(addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields',
      }));
      return;
    }

    try {
      await apiService.createTruck({
        ...newTruck,
        year: parseInt(newTruck.year),
        capacity: parseFloat(newTruck.capacity),
      });
      
      dispatch(addNotification({
        type: 'success',
        title: 'Truck Created',
        message: 'Truck has been created successfully',
      }));
      
      setShowCreateForm(false);
      setNewTruck({
        make: '',
        model: '',
        year: '',
        license_plate: '',
        capacity: '',
        fuel_type: '',
        status: 'available',
      });
      fetchTrucks();
    } catch (error: any) {
      let errorMessage = 'Failed to create truck';
      
      if (error.message.includes('Unable to connect')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (error.message.includes('Server error')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message.includes('Access denied')) {
        errorMessage = 'Your session has expired. Please log in again.';
        navigate('/login');
        return;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch(addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: errorMessage,
      }));
    }
  };

  const handleEditTruck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTruck) return;

    if (!editingTruck.make || !editingTruck.model || !editingTruck.license_plate) {
      dispatch(addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields',
      }));
      return;
    }

    try {
      await apiService.updateTruck(editingTruck.id, {
        make: editingTruck.make,
        model: editingTruck.model,
        year: editingTruck.year,
        license_plate: editingTruck.license_plate,
        capacity: editingTruck.capacity,
        fuel_type: editingTruck.fuel_type,
        status: editingTruck.status,
      });
      
      dispatch(addNotification({
        type: 'success',
        title: 'Truck Updated',
        message: 'Truck has been updated successfully',
      }));
      
      setEditingTruck(null);
      fetchTrucks();
    } catch (error: any) {
      let errorMessage = 'Failed to update truck';
      
      if (error.message.includes('Unable to connect')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (error.message.includes('Server error')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message.includes('Access denied')) {
        errorMessage = 'Your session has expired. Please log in again.';
        navigate('/login');
        return;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch(addNotification({
        type: 'error',
        title: 'Update Failed',
        message: errorMessage,
      }));
    }
  };

  const handleDeleteTruck = async (truckId: number) => {
    if (!confirm('Are you sure you want to delete this truck?')) return;

    try {
      await apiService.deleteTruck(truckId);
      dispatch(addNotification({
        type: 'success',
        title: 'Truck Deleted',
        message: 'Truck has been deleted successfully',
      }));
      fetchTrucks();
    } catch (error: any) {
      let errorMessage = 'Failed to delete truck';
      
      if (error.message.includes('Unable to connect')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (error.message.includes('Server error')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message.includes('Access denied')) {
        errorMessage = 'Your session has expired. Please log in again.';
        navigate('/login');
        return;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch(addNotification({
        type: 'error',
        title: 'Deletion Failed',
        message: errorMessage,
      }));
    }
  };

  const startEditing = (truck: TruckType) => {
    setEditingTruck({ ...truck });
  };

  const cancelEditing = () => {
    setEditingTruck(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      in_use: { variant: 'secondary' as const, icon: Clock, color: 'text-blue-600' },
      maintenance: { variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.color}`}>
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const filteredTrucks = trucks.filter(truck => {
    const matchesSearch = truck.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         truck.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         truck.license_plate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || truck.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Truck Management</h1>
            <p className="text-gray-600">Manage your fleet of trucks</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Truck
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Trucks</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by make, model, or license plate..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Label htmlFor="status-filter">Status Filter</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="in_use">In Use</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Truck Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Truck</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTruck} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="make">Make *</Label>
                    <Input
                      id="make"
                      value={newTruck.make}
                      onChange={(e) => setNewTruck(prev => ({ ...prev, make: e.target.value }))}
                      placeholder="e.g., Toyota, Ford"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={newTruck.model}
                      onChange={(e) => setNewTruck(prev => ({ ...prev, model: e.target.value }))}
                      placeholder="e.g., Hino, Fuso"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={newTruck.year}
                      onChange={(e) => setNewTruck(prev => ({ ...prev, year: e.target.value }))}
                      placeholder="e.g., 2020"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="license">License Plate *</Label>
                    <Input
                      id="license"
                      value={newTruck.license_plate}
                      onChange={(e) => setNewTruck(prev => ({ ...prev, license_plate: e.target.value }))}
                      placeholder="e.g., KCA 123A"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacity (tons) *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      step="0.1"
                      value={newTruck.capacity}
                      onChange={(e) => setNewTruck(prev => ({ ...prev, capacity: e.target.value }))}
                      placeholder="e.g., 10.5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fuel">Fuel Type</Label>
                    <Select
                      value={newTruck.fuel_type}
                      onValueChange={(value) => setNewTruck(prev => ({ ...prev, fuel_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Create Truck
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Trucks List */}
        <div className="space-y-4">
          {isLoading && !hasError ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">Loading trucks...</p>
            </div>
          ) : hasError ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-gray-600 mb-4">Failed to fetch trucks. Please try again.</p>
              <Button onClick={fetchTrucks} className="bg-blue-600 hover:bg-blue-700">
                Retry
              </Button>
            </div>
          ) : filteredTrucks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Truck className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trucks found</h3>
                <p className="text-gray-500 mb-4">
                  {trucks.length === 0 ? 'Get started by adding your first truck' : 'No trucks match your search criteria'}
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Truck
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTrucks.map((truck) => (
              <Card key={truck.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {editingTruck?.id === truck.id ? (
                    // Edit Form
                    <form onSubmit={handleEditTruck} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`edit-make-${truck.id}`}>Make *</Label>
                          <Input
                            id={`edit-make-${truck.id}`}
                            value={editingTruck.make}
                            onChange={(e) => setEditingTruck(prev => prev ? { ...prev, make: e.target.value } : null)}
                            placeholder="e.g., Toyota, Ford"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-model-${truck.id}`}>Model *</Label>
                          <Input
                            id={`edit-model-${truck.id}`}
                            value={editingTruck.model}
                            onChange={(e) => setEditingTruck(prev => prev ? { ...prev, model: e.target.value } : null)}
                            placeholder="e.g., Hino, Fuso"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-year-${truck.id}`}>Year *</Label>
                          <Input
                            id={`edit-year-${truck.id}`}
                            type="number"
                            value={editingTruck.year}
                            onChange={(e) => setEditingTruck(prev => prev ? { ...prev, year: parseInt(e.target.value) } : null)}
                            placeholder="e.g., 2020"
                            min="1900"
                            max={new Date().getFullYear() + 1}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-license-${truck.id}`}>License Plate *</Label>
                          <Input
                            id={`edit-license-${truck.id}`}
                            value={editingTruck.license_plate}
                            onChange={(e) => setEditingTruck(prev => prev ? { ...prev, license_plate: e.target.value } : null)}
                            placeholder="e.g., KCA 123A"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-capacity-${truck.id}`}>Capacity (tons) *</Label>
                          <Input
                            id={`edit-capacity-${truck.id}`}
                            type="number"
                            step="0.1"
                            value={editingTruck.capacity}
                            onChange={(e) => setEditingTruck(prev => prev ? { ...prev, capacity: parseFloat(e.target.value) } : null)}
                            placeholder="e.g., 10.5"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-fuel-${truck.id}`}>Fuel Type</Label>
                          <Select
                            value={editingTruck.fuel_type}
                            onValueChange={(value) => setEditingTruck(prev => prev ? { ...prev, fuel_type: value } : null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="diesel">Diesel</SelectItem>
                              <SelectItem value="petrol">Petrol</SelectItem>
                              <SelectItem value="electric">Electric</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`edit-status-${truck.id}`}>Status</Label>
                          <Select
                            value={editingTruck.status}
                            onValueChange={(value: 'available' | 'in_use' | 'maintenance') => 
                              setEditingTruck(prev => prev ? { ...prev, status: value } : null)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="in_use">In Use</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700">
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  ) : (
                    // Display Mode
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {truck.make} {truck.model}
                            </h3>
                            <p className="text-gray-600">License: {truck.license_plate}</p>
                          </div>
                          {getStatusBadge(truck.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Year</Label>
                            <p className="text-gray-900">{truck.year}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Capacity</Label>
                            <p className="text-gray-900">{truck.capacity} tons</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Fuel Type</Label>
                            <p className="text-gray-900 capitalize">{truck.fuel_type}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Added</Label>
                            <p className="text-gray-900">
                              {new Date(truck.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditing(truck)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTruck(truck.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trucks</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trucks.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {trucks.filter(t => t.status === 'available').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Use</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {trucks.filter(t => t.status === 'in_use').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {trucks.filter(t => t.status === 'maintenance').length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrucksPage;
