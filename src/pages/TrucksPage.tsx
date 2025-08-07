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
  Clock
} from 'lucide-react';
import { Truck as TruckType } from '@/lib/api';

const TrucksPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const [trucks, setTrucks] = useState<TruckType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTruck, setNewTruck] = useState({
    make: '',
    model: '',
    year: '',
    license_plate: '',
    capacity_tons: '',
    fuel_type: '',
    status: 'available' as const,
  });

  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getTrucks();
      setTrucks(response.data!.trucks);
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        title: 'Failed to fetch trucks',
        message: error.message || 'An error occurred while fetching trucks',
      }));
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
        capacity_tons: parseFloat(newTruck.capacity_tons),
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
        capacity_tons: '',
        fuel_type: '',
        status: 'available',
      });
      fetchTrucks();
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: error.message || 'Failed to create truck',
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
      dispatch(addNotification({
        type: 'error',
        title: 'Deletion Failed',
        message: error.message || 'Failed to delete truck',
      }));
    }
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
                      value={newTruck.capacity_tons}
                      onChange={(e) => setNewTruck(prev => ({ ...prev, capacity_tons: e.target.value }))}
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
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
                          <p className="text-gray-900">{truck.capacity_tons} tons</p>
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
                        onClick={() => navigate(`/trucks/${truck.id}/edit`)}
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
