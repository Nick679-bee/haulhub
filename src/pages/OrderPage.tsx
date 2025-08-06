import { useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { 
  setSelectedMaterial, 
  setSelectedTruck, 
  setQuantity, 
  setDistance, 
  setCustomerInfo,
  addOrder,
  resetOrder,
  materials,
  truckTypes,
  Material,
  TruckType,
  Order
} from '@/store/slices/orderSlice';
import { addNotification } from '@/store/slices/notificationSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, Truck, MapPin, Calculator, User, Phone, Mail, MapPinIcon } from 'lucide-react';

const OrderPage = () => {
  const dispatch = useAppDispatch();
  const { selectedMaterial, selectedTruck, quantity, distance, customerInfo, totalPrice } = useAppSelector(state => state.order);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMaterialChange = (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    if (material) {
      dispatch(setSelectedMaterial(material));
    }
  };

  const handleTruckChange = (truckId: string) => {
    const truck = truckTypes.find(t => t.id === truckId);
    if (truck) {
      dispatch(setSelectedTruck(truck));
    }
  };

  const handleSubmitOrder = async () => {
    if (!selectedMaterial || !selectedTruck || !customerInfo.name || !customerInfo.phone) {
      dispatch(addNotification({
        title: 'Incomplete Information',
        message: 'Please fill in all required fields before submitting your order.',
        type: 'warning'
      }));
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newOrder: Order = {
      id: Date.now().toString(),
      material: selectedMaterial,
      truck: selectedTruck,
      quantity,
      distance,
      customerInfo,
      totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    dispatch(addOrder(newOrder));
    dispatch(addNotification({
      title: 'Order Submitted Successfully',
      message: `Your order for ${quantity} trips of ${selectedMaterial.name} has been submitted. Order ID: ${newOrder.id}`,
      type: 'success'
    }));

    dispatch(resetOrder());
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Order Construction Materials</h1>
          <p className="text-xl text-muted-foreground">
            Select materials, choose your truck type, and get instant pricing
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Material Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Select Material
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedMaterial?.id || ""} onValueChange={handleMaterialChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose construction material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{material.name}</span>
                          <Badge variant="outline" className="ml-2">
                            Ksh {material.pricePerTrip.toLocaleString()} {material.unit}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Truck Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Select Truck Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedTruck?.id || ""} onValueChange={handleTruckChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose truck type" />
                  </SelectTrigger>
                  <SelectContent>
                    {truckTypes.map((truck) => (
                      <SelectItem key={truck.id} value={truck.id}>
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <span className="font-medium">{truck.name}</span>
                            <span className="text-muted-foreground ml-2">({truck.capacity})</span>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {(truck.priceMultiplier * 100).toFixed(0)}% base rate
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Quantity and Distance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Number of Trips</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => dispatch(setQuantity(parseInt(e.target.value) || 1))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="distance">Distance from Mlolongo (km)</Label>
                    <Input
                      id="distance"
                      type="number"
                      min="0"
                      step="0.1"
                      value={distance}
                      onChange={(e) => dispatch(setDistance(parseFloat(e.target.value) || 0))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Distance affects pricing (5% increase per km)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => dispatch(setCustomerInfo({ name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => dispatch(setCustomerInfo({ phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => dispatch(setCustomerInfo({ email: e.target.value }))}
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => dispatch(setCustomerInfo({ address: e.target.value }))}
                    placeholder="Enter complete delivery address"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedMaterial && (
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Material:</span>
                      <span>{selectedMaterial.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Base price:</span>
                      <span>Ksh {selectedMaterial.pricePerTrip.toLocaleString()}/trip</span>
                    </div>
                  </div>
                )}

                {selectedTruck && (
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Truck:</span>
                      <span>{selectedTruck.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Capacity:</span>
                      <span>{selectedTruck.capacity}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Rate multiplier:</span>
                      <span>{(selectedTruck.priceMultiplier * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Quantity:</span>
                    <span>{quantity} trips</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Distance:</span>
                    <span>{distance} km</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Price:</span>
                  <span className="text-primary">Ksh {totalPrice.toLocaleString()}</span>
                </div>

                <Button 
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting || !selectedMaterial || !selectedTruck || !customerInfo.name || !customerInfo.phone}
                  variant="hero"
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Order'}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  * Required fields must be filled before submitting
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;