import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { createHaul } from '@/store/slices/haulsSlice';
import { addNotification } from '@/store/slices/notificationSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Truck, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Loader2,
  ArrowLeft,
  Save
} from 'lucide-react';
import { CreateHaulRequest } from '@/lib/api';

const CreateHaulPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.hauls);

  const [formData, setFormData] = useState<CreateHaulRequest>({
    haul_type: 'both',
    pickup: {
      address: '',
      city: '',
      state: '',
      zip: '',
      date: '',
      contact_name: '',
      contact_phone: '',
      instructions: '',
    },
    delivery: {
      address: '',
      city: '',
      state: '',
      zip: '',
      date: '',
      contact_name: '',
      contact_phone: '',
      instructions: '',
    },
    load: {
      type: '',
      description: '',
      weight: undefined,
      volume: undefined,
      hazardous: false,
      special_requirements: '',
    },
    pricing: {
      quoted_price: undefined,
      final_price: undefined,
      fuel_cost: undefined,
      payment_status: 'pending',
      payment_method: '',
    },
    distance_miles: undefined,
    estimated_duration_hours: undefined,
    notes: '',
    status: 'pending',
  });

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof CreateHaulRequest],
        [field]: value,
      },
    }));
  };

  const handleLoadChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      load: {
        ...prev.load,
        [field]: value,
      },
    }));
  };

  const handlePricingChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing!,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.pickup.address || !formData.delivery.address || !formData.load.description) {
      dispatch(addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields',
      }));
      return;
    }

    try {
      await dispatch(createHaul(formData)).unwrap();
      
      dispatch(addNotification({
        type: 'success',
        title: 'Haul Created',
        message: 'Your haul has been created successfully',
      }));

      navigate('/dashboard');
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: error || 'Failed to create haul',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
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
              <h1 className="text-3xl font-bold text-gray-900">Create New Haul</h1>
              <p className="text-gray-600">Fill in the details below to create a new haul</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Haul Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Haul Type</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.haul_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, haul_type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select haul type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Pickup Only</SelectItem>
                  <SelectItem value="delivery">Delivery Only</SelectItem>
                  <SelectItem value="both">Pickup & Delivery</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Pickup Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Pickup Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup-address">Address *</Label>
                  <Input
                    id="pickup-address"
                    value={formData.pickup.address}
                    onChange={(e) => handleInputChange('pickup', 'address', e.target.value)}
                    placeholder="Enter pickup address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickup-city">City *</Label>
                  <Input
                    id="pickup-city"
                    value={formData.pickup.city}
                    onChange={(e) => handleInputChange('pickup', 'city', e.target.value)}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickup-state">State *</Label>
                  <Input
                    id="pickup-state"
                    value={formData.pickup.state}
                    onChange={(e) => handleInputChange('pickup', 'state', e.target.value)}
                    placeholder="Enter state"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickup-zip">ZIP Code *</Label>
                  <Input
                    id="pickup-zip"
                    value={formData.pickup.zip}
                    onChange={(e) => handleInputChange('pickup', 'zip', e.target.value)}
                    placeholder="Enter ZIP code"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickup-date">Pickup Date *</Label>
                  <Input
                    id="pickup-date"
                    type="date"
                    value={formData.pickup.date}
                    onChange={(e) => handleInputChange('pickup', 'date', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickup-contact">Contact Name *</Label>
                  <Input
                    id="pickup-contact"
                    value={formData.pickup.contact_name}
                    onChange={(e) => handleInputChange('pickup', 'contact_name', e.target.value)}
                    placeholder="Enter contact name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickup-phone">Contact Phone *</Label>
                  <Input
                    id="pickup-phone"
                    value={formData.pickup.contact_phone}
                    onChange={(e) => handleInputChange('pickup', 'contact_phone', e.target.value)}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickup-instructions">Pickup Instructions</Label>
                <Textarea
                  id="pickup-instructions"
                  value={formData.pickup.instructions}
                  onChange={(e) => handleInputChange('pickup', 'instructions', e.target.value)}
                  placeholder="Enter any special pickup instructions"
                />
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Delivery Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delivery-address">Address *</Label>
                  <Input
                    id="delivery-address"
                    value={formData.delivery.address}
                    onChange={(e) => handleInputChange('delivery', 'address', e.target.value)}
                    placeholder="Enter delivery address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-city">City *</Label>
                  <Input
                    id="delivery-city"
                    value={formData.delivery.city}
                    onChange={(e) => handleInputChange('delivery', 'city', e.target.value)}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-state">State *</Label>
                  <Input
                    id="delivery-state"
                    value={formData.delivery.state}
                    onChange={(e) => handleInputChange('delivery', 'state', e.target.value)}
                    placeholder="Enter state"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-zip">ZIP Code *</Label>
                  <Input
                    id="delivery-zip"
                    value={formData.delivery.zip}
                    onChange={(e) => handleInputChange('delivery', 'zip', e.target.value)}
                    placeholder="Enter ZIP code"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-date">Delivery Date *</Label>
                  <Input
                    id="delivery-date"
                    type="date"
                    value={formData.delivery.date}
                    onChange={(e) => handleInputChange('delivery', 'date', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-contact">Contact Name *</Label>
                  <Input
                    id="delivery-contact"
                    value={formData.delivery.contact_name}
                    onChange={(e) => handleInputChange('delivery', 'contact_name', e.target.value)}
                    placeholder="Enter contact name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-phone">Contact Phone *</Label>
                  <Input
                    id="delivery-phone"
                    value={formData.delivery.contact_phone}
                    onChange={(e) => handleInputChange('delivery', 'contact_phone', e.target.value)}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-instructions">Delivery Instructions</Label>
                <Textarea
                  id="delivery-instructions"
                  value={formData.delivery.instructions}
                  onChange={(e) => handleInputChange('delivery', 'instructions', e.target.value)}
                  placeholder="Enter any special delivery instructions"
                />
              </div>
            </CardContent>
          </Card>

          {/* Load Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Load Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="load-type">Load Type *</Label>
                  <Input
                    id="load-type"
                    value={formData.load.type}
                    onChange={(e) => handleLoadChange('type', e.target.value)}
                    placeholder="e.g., General cargo, Construction materials"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="load-weight">Weight (tons)</Label>
                  <Input
                    id="load-weight"
                    type="number"
                    value={formData.load.weight || ''}
                    onChange={(e) => handleLoadChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Enter weight in tons"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="load-volume">Volume (cubic meters)</Label>
                  <Input
                    id="load-volume"
                    type="number"
                    value={formData.load.volume || ''}
                    onChange={(e) => handleLoadChange('volume', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Enter volume"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="load-hazardous">Hazardous Materials</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="load-hazardous"
                      checked={formData.load.hazardous}
                      onCheckedChange={(checked) => handleLoadChange('hazardous', checked)}
                    />
                    <Label htmlFor="load-hazardous">Contains hazardous materials</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="load-description">Load Description *</Label>
                <Textarea
                  id="load-description"
                  value={formData.load.description}
                  onChange={(e) => handleLoadChange('description', e.target.value)}
                  placeholder="Describe the load in detail"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="load-requirements">Special Requirements</Label>
                <Textarea
                  id="load-requirements"
                  value={formData.load.special_requirements || ''}
                  onChange={(e) => handleLoadChange('special_requirements', e.target.value)}
                  placeholder="Any special handling requirements"
                />
              </div>
            </CardContent>
          </Card>

          {/* Trip Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Trip Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (miles)</Label>
                  <Input
                    id="distance"
                    type="number"
                    value={formData.distance_miles || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, distance_miles: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    placeholder="Enter distance"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Estimated Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.estimated_duration_hours || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimated_duration_hours: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    placeholder="Enter estimated duration"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional notes or comments"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Pricing Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quoted-price">Quoted Price (Ksh)</Label>
                  <Input
                    id="quoted-price"
                    type="number"
                    value={formData.pricing?.quoted_price || ''}
                    onChange={(e) => handlePricingChange('quoted_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Enter quoted price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuel-cost">Fuel Cost (Ksh)</Label>
                  <Input
                    id="fuel-cost"
                    type="number"
                    value={formData.pricing?.fuel_cost || ''}
                    onChange={(e) => handlePricingChange('fuel_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Enter fuel cost"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select
                    value={formData.pricing?.payment_method || ''}
                    onValueChange={(value) => handlePricingChange('payment_method', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="card">Card Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Haul
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHaulPage;

