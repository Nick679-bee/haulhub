import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchHaul, startHaul, completeHaul, cancelHaul, assignHaul } from '@/store/slices/haulsSlice';
import { addNotification } from '@/store/slices/notificationSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Package, 
  Truck, 
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  StopCircle,
  XCircle,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';

const HaulDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentHaul, isLoading } = useAppSelector(state => state.hauls);
  const { user } = useAppSelector(state => state.auth);

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchHaul(parseInt(id)));
    }
  }, [id, dispatch]);

  const handleStatusUpdate = async (action: 'start' | 'complete' | 'cancel') => {
    if (!currentHaul) return;

    setIsUpdating(true);
    try {
      switch (action) {
        case 'start':
          await dispatch(startHaul(currentHaul.id)).unwrap();
          dispatch(addNotification({
            type: 'success',
            title: 'Haul Started',
            message: 'The haul has been started successfully',
          }));
          break;
        case 'complete':
          await dispatch(completeHaul(currentHaul.id)).unwrap();
          dispatch(addNotification({
            type: 'success',
            title: 'Haul Completed',
            message: 'The haul has been completed successfully',
          }));
          break;
        case 'cancel':
          await dispatch(cancelHaul(currentHaul.id)).unwrap();
          dispatch(addNotification({
            type: 'success',
            title: 'Haul Cancelled',
            message: 'The haul has been cancelled successfully',
          }));
          break;
      }
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        title: 'Action Failed',
        message: error || 'Failed to update haul status',
      }));
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      assigned: { variant: 'default' as const, icon: AlertCircle, color: 'text-blue-600' },
      in_progress: { variant: 'default' as const, icon: Play, color: 'text-orange-600' },
      completed: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      cancelled: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.color}`}>
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return `Ksh ${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!currentHaul) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Haul Not Found</h2>
          <p className="text-gray-600 mb-4">The haul you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Haul #{currentHaul.id}
              </h1>
              <p className="text-gray-600">{currentHaul.load_description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {getStatusBadge(currentHaul.status)}
            <Button
              variant="outline"
              onClick={() => navigate(`/hauls/${currentHaul.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              {currentHaul.status === 'pending' && (
                <Button
                  onClick={() => handleStatusUpdate('start')}
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Haul
                </Button>
              )}
              
              {currentHaul.status === 'in_progress' && (
                <Button
                  onClick={() => handleStatusUpdate('complete')}
                  disabled={isUpdating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Haul
                </Button>
              )}
              
              {(currentHaul.status === 'pending' || currentHaul.status === 'assigned') && (
                <Button
                  onClick={() => handleStatusUpdate('cancel')}
                  disabled={isUpdating}
                  variant="destructive"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Haul
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Pickup Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>Pickup Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Address</Label>
                    <p className="text-gray-900">{currentHaul.pickup_address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">City</Label>
                      <p className="text-gray-900">{currentHaul.pickup_city}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">State</Label>
                      <p className="text-gray-900">{currentHaul.pickup_state}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">ZIP Code</Label>
                      <p className="text-gray-900">{currentHaul.pickup_zip}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Date</Label>
                      <p className="text-gray-900">{formatDate(currentHaul.pickup_date)}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Contact Name</Label>
                      <p className="text-gray-900">{currentHaul.pickup_contact_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Contact Phone</Label>
                      <p className="text-gray-900">{currentHaul.pickup_contact_phone}</p>
                    </div>
                  </div>
                  {currentHaul.pickup_instructions && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Instructions</Label>
                      <p className="text-gray-900">{currentHaul.pickup_instructions}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span>Delivery Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Address</Label>
                    <p className="text-gray-900">{currentHaul.delivery_address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">City</Label>
                      <p className="text-gray-900">{currentHaul.delivery_city}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">State</Label>
                      <p className="text-gray-900">{currentHaul.delivery_state}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">ZIP Code</Label>
                      <p className="text-gray-900">{currentHaul.delivery_zip}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Date</Label>
                      <p className="text-gray-900">{formatDate(currentHaul.delivery_date)}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Contact Name</Label>
                      <p className="text-gray-900">{currentHaul.delivery_contact_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Contact Phone</Label>
                      <p className="text-gray-900">{currentHaul.delivery_contact_phone}</p>
                    </div>
                  </div>
                  {currentHaul.delivery_instructions && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Instructions</Label>
                      <p className="text-gray-900">{currentHaul.delivery_instructions}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Load Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-orange-600" />
                  <span>Load Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Load Type</Label>
                    <p className="text-gray-900">{currentHaul.load_type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Description</Label>
                    <p className="text-gray-900">{currentHaul.load_description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {currentHaul.load_weight && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Weight</Label>
                        <p className="text-gray-900">{currentHaul.load_weight} tons</p>
                      </div>
                    )}
                    {currentHaul.load_volume && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Volume</Label>
                        <p className="text-gray-900">{currentHaul.load_volume} m³</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm font-medium text-gray-600">Hazardous Materials</Label>
                    <Badge variant={currentHaul.load_hazardous ? 'destructive' : 'secondary'}>
                      {currentHaul.load_hazardous ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  {currentHaul.special_requirements && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Special Requirements</Label>
                      <p className="text-gray-900">{currentHaul.special_requirements}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Trip Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-purple-600" />
                  <span>Trip Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {currentHaul.distance_miles && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Distance</Label>
                      <p className="text-gray-900">{currentHaul.distance_miles} miles</p>
                    </div>
                  )}
                  {currentHaul.estimated_duration_hours && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Duration</Label>
                      <p className="text-gray-900">{currentHaul.estimated_duration_hours} hours</p>
                    </div>
                  )}
                </div>
                {currentHaul.notes && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Notes</Label>
                    <p className="text-gray-900">{currentHaul.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <span>Pricing Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {currentHaul.quoted_price && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Quoted Price</Label>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(currentHaul.quoted_price)}
                      </p>
                    </div>
                  )}
                  {currentHaul.final_price && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Final Price</Label>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(currentHaul.final_price)}
                      </p>
                    </div>
                  )}
                  {currentHaul.fuel_cost && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Fuel Cost</Label>
                      <p className="text-gray-900">{formatCurrency(currentHaul.fuel_cost)}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Payment Status</Label>
                      <Badge variant={currentHaul.payment_status === 'paid' ? 'default' : 'secondary'}>
                        {currentHaul.payment_status.toUpperCase()}
                      </Badge>
                    </div>
                    {currentHaul.payment_method && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Payment Method</Label>
                        <p className="text-gray-900">{currentHaul.payment_method}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <span>Metadata</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Created</Label>
                    <p className="text-gray-900">{formatDate(currentHaul.created_at)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
                    <p className="text-gray-900">{formatDate(currentHaul.updated_at)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Haul Type</Label>
                    <Badge variant="outline">{currentHaul.haul_type.toUpperCase()}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HaulDetailsPage;
