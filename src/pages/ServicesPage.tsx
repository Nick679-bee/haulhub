import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Truck, Phone, Mail, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const ServicesPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: '',
    description: '',
    location: ''
  });

  const services = [
    {
      id: 'dumping',
      title: 'Professional Dumping Services',
      description: 'Efficient waste material dumping and disposal services with proper environmental compliance.',
      features: [
        'Waste material disposal',
        'Construction debris removal',
        'Soil and earth dumping',
        'Environmental compliance',
        'Licensed disposal sites'
      ],
      trucks: ['Ashok Leyland', 'TATA', 'Howo'],
      pricing: 'Quote on call'
    },
    {
      id: 'roadmaking',
      title: 'Road Making Services',
      description: 'Complete road construction and maintenance services using modern equipment and techniques.',
      features: [
        'Road construction',
        'Pavement laying',
        'Surface repair',
        'Quality materials',
        'Professional crew'
      ],
      trucks: ['Ashok Leyland', 'TATA', 'Howo'],
      pricing: 'Quote on call'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleServiceSelect = (serviceType: string) => {
    setFormData(prev => ({
      ...prev,
      serviceType
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Service quote request:', formData);
    alert('Thank you! We will contact you shortly with a detailed quote.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Professional Truck Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expert dumping and road making services with modern equipment and experienced crews
          </p>
        </div>

        {/* Services Overview */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Truck className="mr-3 h-6 w-6 text-primary" />
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{service.description}</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Service Features:</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Available Trucks:</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.trucks.map((truck) => (
                      <Badge key={truck} variant="outline">{truck}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-sm text-muted-foreground">Pricing:</span>
                    <div className="font-semibold text-primary">{service.pricing}</div>
                  </div>
                  <Button 
                    onClick={() => handleServiceSelect(service.id)}
                    variant={formData.serviceType === service.id ? "default" : "outline"}
                  >
                    Select Service
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Get Your Service Quote</CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below and we'll contact you with a detailed quote
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Project Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter project location"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your project requirements, scope, timeline, and any specific needs"
                    rows={4}
                    required
                  />
                </div>

                {formData.serviceType && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Selected Service:</p>
                    <p className="font-semibold capitalize">{formData.serviceType} Service</p>
                  </div>
                )}

                <Button type="submit" variant="hero" size="lg" className="w-full">
                  Request Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h3>
              <p className="text-muted-foreground mb-6">
                Call us directly for urgent projects or immediate quotes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" size="lg" className="flex items-center">
                  <Phone className="mr-2 h-5 w-5" />
                  Call: +91 12345 67890
                </Button>
                <Button variant="outline" size="lg" className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Email: info@haulhub.com
                </Button>
              </div>
              <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                Available 24/7 for emergency services
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;