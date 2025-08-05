import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    inquiryType: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const inquiryTypes = [
    { value: 'materials', label: 'Material Orders' },
    { value: 'services', label: 'Truck Services' },
    { value: 'pricing', label: 'Pricing Information' },
    { value: 'support', label: 'Customer Support' },
    { value: 'other', label: 'Other Inquiry' }
  ];

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: ['+91 12345 67890', '+91 98765 43210'],
      subtitle: 'Available 24/7'
    },
    {
      icon: Mail,
      title: 'Email Addresses',
      details: ['orders@haulhub.com', 'support@haulhub.com'],
      subtitle: 'Response within 2 hours'
    },
    {
      icon: MapPin,
      title: 'Office Location',
      details: ['123 Industrial Area', 'Construction Zone, City 123456'],
      subtitle: 'Mon-Sat: 9 AM - 6 PM'
    },
    {
      icon: Clock,
      title: 'Service Hours',
      details: ['24/7 Emergency Services', 'Office: 9 AM - 6 PM'],
      subtitle: 'Always available for urgent needs'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Thank you for your message! We will respond within 2 hours.');
    setFormData({
      name: '',
      phone: '',
      email: '',
      subject: '',
      inquiryType: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get in touch with us for quotes, support, or any questions about our services
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
            
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-full">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{info.title}</h3>
                        <div className="space-y-1">
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-foreground">{detail}</p>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{info.subtitle}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Quick Contact */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Need Immediate Help?</h3>
                <p className="text-muted-foreground mb-4">
                  Call us directly for urgent orders or emergency services
                </p>
                <Button variant="hero" className="w-full">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now: +91 12345 67890
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="inquiryType">Inquiry Type</Label>
                      <Select value={formData.inquiryType} onValueChange={(value) => handleSelectChange('inquiryType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief subject of your inquiry"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please provide details about your inquiry, requirements, or questions"
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    * Required fields. We typically respond within 2 hours during business hours.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">How do I get a price quote?</h4>
                    <p className="text-muted-foreground text-sm">
                      Call us directly or use our order form. We provide instant quotes based on material type, quantity, and distance.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What truck types are available?</h4>
                    <p className="text-muted-foreground text-sm">
                      We have Ashok Leyland, TATA, and Howo trucks with capacities ranging from 10-15 tons.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Do you provide emergency services?</h4>
                    <p className="text-muted-foreground text-sm">
                      Yes, we offer 24/7 emergency services for urgent construction and dumping needs.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">What materials do you supply?</h4>
                    <p className="text-muted-foreground text-sm">
                      We supply sand, gravel, stone chips, bricks, cement, and other construction materials.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">How is pricing calculated?</h4>
                    <p className="text-muted-foreground text-sm">
                      Pricing is based on material type, truck type, quantity (trips), and delivery distance.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What payment methods are accepted?</h4>
                    <p className="text-muted-foreground text-sm">
                      We accept cash, bank transfers, and digital payments. Payment terms can be discussed for large orders.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;