import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Shield, Infinity, ArrowRight, ImageIcon, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Generate stunning images in seconds with our optimized AI models"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description: "Your images and data are protected with enterprise-grade security"
    },
    {
      icon: <Infinity className="h-8 w-8" />,
      title: "Unlimited Creativity",
      description: "Explore endless possibilities with advanced AI image generation"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Digital Artist",
      content: "ImageMaster has revolutionized my creative workflow. The quality is incredible!",
      rating: 5
    },
    {
      name: "Mark Rodriguez", 
      role: "Marketing Director",
      content: "Perfect for creating unique visuals for our campaigns. Saves us hours of work.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Content Creator", 
      content: "The ease of use combined with professional results makes this a must-have tool.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">ImageMaster</h1>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-muted/20 animate-float"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              🚀 Powered by Advanced AI Technology
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-primary to-purple-600 bg-clip-text text-transparent leading-tight">
              Create Stunning
              <br />
              AI Images
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into breathtaking visuals with our cutting-edge AI image generation platform. 
              Professional quality, lightning fast results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8 py-6 animate-glow">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8 py-6 animate-glow">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Start Creating
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              )}
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                <Users className="h-5 w-5 mr-2" />
                View Examples
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <div>10,000+ Happy Users</div>
              <div className="h-4 w-px bg-border"></div>
              <div>500K+ Images Generated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Why Choose ImageMaster?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the perfect blend of power, simplicity, and professional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-border/50">
                <CardHeader>
                  <div className="text-primary group-hover:scale-110 transition-transform duration-300 flex justify-center">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Loved by Creators</h2>
            <p className="text-xl text-muted-foreground">
              See what our users have to say about ImageMaster
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-card to-card/50 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Create Amazing Images?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators who are already using ImageMaster to bring their visions to life.
          </p>
          {!user && (
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8 py-6">
                <Sparkles className="h-5 w-5 mr-2" />
                Get Started for Free
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">ImageMaster</span>
            </div>
            <p className="text-muted-foreground">
              © 2024 ImageMaster. All rights reserved. Powered by cutting-edge AI technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
