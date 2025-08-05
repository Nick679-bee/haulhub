import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import heroImage from '@/assets/hero-construction.jpg';

const HomePage = () => {
  const features = [
    {
      icon: Package,
      title: "Material Ordering",
      description: "Order sand, gravel, stone chips, bricks, and cement with dynamic pricing",
      link: "/order"
    },
    {
      icon: Truck,
      title: "Truck Services",
      description: "Professional dumping and road making services with various truck types",
      link: "/services"
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Get instant quotes and support for all your construction needs",
      link: "/contact"
    }
  ];

  const benefits = [
    "Dynamic pricing based on quantity and distance",
    "Multiple truck types: Ashok Leyland, TATA, Howo",
    "Real-time order tracking and notifications",
    "Professional dumping and road making services",
    "Instant price quotes via phone",
    "Responsive customer support"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Welcome to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">HaulHub</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Your one-stop solution for construction materials and professional truck services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/order">
              <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                Order Materials
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-foreground">
                Truck Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional construction solutions with transparent pricing and reliable service
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground mb-6">{feature.description}</p>
                    <Link to={feature.link}>
                      <Button variant="outline" className="w-full">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Why Choose HaulHub?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                We provide reliable, efficient, and cost-effective solutions for all your construction material and transportation needs.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:text-right">
              <Card className="inline-block p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-primary mb-2">24/7</h3>
                  <p className="text-lg font-semibold mb-4">Available Service</p>
                  <p className="text-muted-foreground">
                    Call us anytime for instant quotes and emergency services
                  </p>
                  <Link to="/contact">
                    <Button variant="hero" className="mt-6">
                      Contact Us Now
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Order your construction materials or book truck services today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/order">
              <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                Start Ordering
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Get Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;