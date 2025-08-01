import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Shield, Infinity, ArrowRight, ImageIcon, Users, Star, Palette, Clock, Download, Globe, Wand2, Layers, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Wand2 className="h-8 w-8" />,
      title: "AI-Powered Generation",
      description: "Create stunning images from text using cutting-edge Nebius AI technology with lightning-fast results",
      gradient: "from-purple-400 to-pink-400"
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: "Professional Quality",
      description: "Generate high-resolution images perfect for commercial use, marketing, and creative projects",
      gradient: "from-blue-400 to-cyan-400"
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Advanced optimization delivers your images in seconds, not minutes. Perfect for rapid iteration",
      gradient: "from-green-400 to-emerald-400"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description: "Enterprise-grade security ensures your creations and data remain protected and confidential",
      gradient: "from-orange-400 to-red-400"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Access",
      description: "Access your image gallery from anywhere, with cloud sync and cross-device compatibility",
      gradient: "from-indigo-400 to-purple-400"
    },
    {
      icon: <Infinity className="h-8 w-8" />,
      title: "Unlimited Creativity",
      description: "Explore endless possibilities with advanced prompting and style controls for unique results",
      gradient: "from-pink-400 to-rose-400"
    }
  ];

  const stats = [
    { number: "500K+", label: "Images Generated", icon: <ImageIcon className="h-5 w-5" /> },
    { number: "15K+", label: "Happy Users", icon: <Users className="h-5 w-5" /> },
    { number: "99.9%", label: "Uptime", icon: <Clock className="h-5 w-5" /> },
    { number: "4.9/5", label: "User Rating", icon: <Star className="h-5 w-5" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Digital Artist & Creator",
      content: "ImageMaster has completely revolutionized my creative workflow. The quality is absolutely incredible and the speed is unmatched!",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Mark Rodriguez", 
      role: "Marketing Director",
      content: "Perfect for creating unique visuals for our campaigns. It saves us hours of work and the results are consistently professional.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Watson",
      role: "Content Creator", 
      content: "The ease of use combined with professional results makes this a must-have tool. I can't imagine working without it now.",
      rating: 5,
      avatar: "EW"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b bg-background/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-primary animate-glow" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse"></div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                ImageMaster
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button className="btn-premium bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <Palette className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button className="btn-premium bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-12">
            <div className="space-y-6">
              <Badge variant="secondary" className="px-6 py-3 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                🚀 Powered by Advanced Nebius AI Technology
              </Badge>
              
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                  Create Stunning
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-primary bg-clip-text text-transparent animate-gradient">
                  AI Images
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Transform your wildest imagination into breathtaking visuals with our cutting-edge AI image generation platform. 
                <span className="text-primary font-semibold"> Professional quality, lightning fast results.</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="btn-premium text-xl px-12 py-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                    <Palette className="h-6 w-6 mr-3" />
                    Go to Dashboard
                    <ArrowRight className="h-6 w-6 ml-3" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="btn-premium text-xl px-12 py-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                    <Sparkles className="h-6 w-6 mr-3" />
                    Start Creating
                    <ArrowRight className="h-6 w-6 ml-3" />
                  </Button>
                </Link>
              )}
              <Button size="lg" variant="outline" className="text-xl px-12 py-8 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
                <Users className="h-6 w-6 mr-3" />
                View Gallery
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-primary">
                    {stat.icon}
                    <span className="text-3xl sm:text-4xl font-bold">{stat.number}</span>
                  </div>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-20">
            <Badge variant="outline" className="px-4 py-2 text-primary border-primary/30">
              ✨ Premium Features
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Why Choose ImageMaster?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the perfect blend of cutting-edge technology, professional quality, and intuitive design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group relative overflow-hidden glass border-0 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="text-center relative z-10">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-base leading-relaxed text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-20">
            <Badge variant="outline" className="px-4 py-2 text-primary border-primary/30">
              💬 What Our Users Say
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Loved by Creators Worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of satisfied creators who have transformed their vision into reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass border-0 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group">
                <CardContent className="pt-8">
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-muted-foreground mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10"></div>
        <div className="absolute inset-0 opacity-30 animate-float"></div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-8">
            <Badge variant="outline" className="px-4 py-2 text-primary border-primary/30 bg-background/50">
              🎨 Ready to Create?
            </Badge>
            
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Start Your Creative Journey Today
            </h2>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join thousands of creators who are already using ImageMaster to bring their wildest imagination to life. 
              <span className="text-primary font-semibold"> Start creating stunning AI images in seconds.</span>
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" className="btn-premium text-xl px-12 py-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                    <Sparkles className="h-6 w-6 mr-3" />
                    Get Started for Free
                    <ArrowRight className="h-6 w-6 ml-3" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-xl py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                ImageMaster
              </span>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              © 2024 ImageMaster. All rights reserved. Empowering creativity through cutting-edge AI technology.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
