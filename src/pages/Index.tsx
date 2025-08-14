import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Shield, Infinity, ArrowRight, ImageIcon, Users, Star, Palette, Clock, Download, Globe, Wand2, Layers, Rocket, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useState } from 'react';

const Index = () => {
  const { user } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Theme switch removed. Dark theme is default via CSS.

  const features = [
    {
      icon: <Wand2 className="h-8 w-8" />,
      title: "AI-Powered Generation",
      description: "Create stunning images from text using cutting-edge Nebius AI technology with lightning-fast results",
      color: "text-electric"
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: "Professional Quality",
      description: "Generate high-resolution images perfect for commercial use, marketing, and creative projects",
      color: "text-magenta"
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Advanced optimization delivers your images in seconds, not minutes. Perfect for rapid iteration",
      color: "text-blue"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description: "Enterprise-grade security ensures your creations and data remain protected and confidential",
      color: "text-electric"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Access",
      description: "Access your image gallery from anywhere, with cloud sync and cross-device compatibility",
      color: "text-magenta"
    },
    {
      icon: <Infinity className="h-8 w-8" />,
      title: "Unlimited Creativity",
      description: "Explore endless possibilities with advanced prompting and style controls for unique results",
      color: "text-blue"
    }
  ];

  const stats = [
    { number: "500K+", label: "Images Generated", icon: <ImageIcon className="h-6 w-6" /> },
    { number: "15K+", label: "Happy Users", icon: <Users className="h-6 w-6" /> },
    { number: "99.9%", label: "Uptime", icon: <Clock className="h-6 w-6" /> },
    { number: "4.9/5", label: "User Rating", icon: <Star className="h-6 w-6" /> }
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

  // Sample gallery images for demonstration
  const galleryImages = [
    { id: 1, url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop", prompt: "Futuristic cyberpunk cityscape" },
    { id: 2, url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop", prompt: "Sci-fi robot portrait" },
    { id: 3, url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop", prompt: "Neon-lit street scene" },
    { id: 4, url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=700&fit=crop", prompt: "Digital art masterpiece" },
    { id: 5, url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=450&fit=crop", prompt: "Abstract neon composition" },
    { id: 6, url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=550&fit=crop", prompt: "Futuristic landscape" },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background with AI art collage */}
      <div className="absolute inset-0 overflow-hidden">
        {/* AI-generated image collage background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
        
        {/* Floating electric orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:50px_50px]"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-border/20 bg-background/80 backdrop-blur-xl sticky top-0">
        <div className="container-electric">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="h-7 w-7 text-primary animate-electric-pulse" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse"></div>
              </div>
              <h1 className="text-2xl font-heading font-bold text-foreground animate-text-glow">
                ImageMaster
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button className="btn-electric bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-electric">
                    <Palette className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button className="btn-electric bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-electric">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="container-electric">
          <div className="text-center space-y-16 max-w-5xl mx-auto">
            <div className="space-y-8">
              <Badge className="px-6 py-3 text-sm bg-primary/10 text-primary border-primary/20 font-medium animate-fade-in-up">
                ✨ Powered by Advanced Nebius AI Technology
              </Badge>
              
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold leading-tight text-foreground animate-fade-in-up">
                Create Stunning
                <br />
                <span className="text-gradient animate-text-glow">AI Images</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-fade-in-up">
                Transform your wildest imagination into breathtaking visuals with our cutting-edge AI image generation platform. 
                <span className="text-primary font-semibold"> Professional quality, lightning fast results.</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="text-xl px-10 py-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-electric transition-all duration-300 transform hover:scale-105">
                    <Palette className="h-6 w-6 mr-3" />
                    Go to Dashboard
                    <ArrowRight className="h-6 w-6 ml-3" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="text-xl px-10 py-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-electric transition-all duration-300 transform hover:scale-105">
                    <Sparkles className="h-6 w-6 mr-3" />
                    Start Creating
                    <ArrowRight className="h-6 w-6 ml-3" />
                  </Button>
                </Link>
              )}
              <Button size="lg" variant="outline" className="text-xl px-10 py-8 border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                <Users className="h-6 w-6 mr-3" />
                View Gallery
              </Button>
            </div>

            {/* Hero AI Art Background */}
            <div className="mt-20 relative animate-scale-in">
              <div className="relative mx-auto max-w-6xl">
                <div className="glass-electric rounded-3xl p-8 shadow-cinematic">
                  <div className="aspect-video bg-gradient-to-br from-card to-card/80 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    {/* AI-generated art collage as background */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="grid grid-cols-3 gap-4 h-full">
                        {galleryImages.slice(0, 6).map((image, index) => (
                          <div key={index} className="relative overflow-hidden rounded-lg">
                            <img
                              src={image.url}
                              alt={image.prompt}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative z-10 text-center space-y-6">
                      <div className="inline-flex p-6 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                        <ImageIcon className="h-16 w-16 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                          AI-Generated Art Studio
                        </h3>
                        <p className="text-muted-foreground font-medium">
                          Your creative vision, powered by artificial intelligence
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card/30">
        <div className="container-electric">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-4 card-electric p-8">
                <div className="flex items-center justify-center gap-3 text-primary">
                  {stat.icon}
                  <span className="text-4xl sm:text-5xl font-heading font-bold">{stat.number}</span>
                </div>
                <p className="text-muted-foreground font-medium text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32">
        <div className="container-electric">
          <div className="text-center space-y-8 mb-20">
            <Badge className="px-6 py-3 text-primary border-primary/30 bg-primary/10 font-medium">
              ✨ Premium Features
            </Badge>
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-foreground">
              Why Choose <span className="text-gradient">ImageMaster</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Experience the perfect blend of cutting-edge technology, professional quality, and intuitive design
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <Card key={index} className="card-electric group">
                <CardHeader className="text-center pb-6">
                  <div className={`inline-flex p-4 rounded-2xl bg-muted/50 ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl font-heading font-bold text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed text-center text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-32 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="container-electric">
          <div className="text-center space-y-8 mb-20">
            <Badge className="px-6 py-3 text-accent border-accent/30 bg-accent/10 font-medium">
              🎨 Generated Gallery
            </Badge>
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-foreground">
              Explore Our <span className="text-gradient-secondary">Creative Collection</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Discover the incredible possibilities of AI-generated art
            </p>
          </div>

          <div className="gallery-grid">
            {galleryImages.map((image) => (
              <div key={image.id} className="group">
                <Card className="card-electric overflow-hidden">
                  <div className="relative aspect-[4/5]">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-cover image-electric"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover overlay with actions */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                      <div className="flex gap-3">
                        <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm text-foreground border-white/20 hover:bg-white">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="bg-primary/90 backdrop-blur-sm text-white border-primary/40 hover:bg-primary">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-base font-medium text-foreground line-clamp-2 text-center">
                      {image.prompt}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32">
        <div className="container-electric">
          <div className="text-center space-y-8 mb-20">
            <Badge className="px-6 py-3 text-secondary border-secondary/30 bg-secondary/10 font-medium">
              💬 What Our Users Say
            </Badge>
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-foreground">
              Loved by <span className="text-gradient">Creators Worldwide</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of satisfied creators who have transformed their vision into reality
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="flex items-center justify-center">
              <Card className="card-electric w-full">
                <CardContent className="pt-16 pb-12 px-16">
                  <div className="flex mb-10 justify-center">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-2xl text-foreground mb-10 italic leading-relaxed text-center">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  <div className="flex items-center justify-center gap-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="text-center">
                      <p className="font-heading font-bold text-xl text-foreground">{testimonials[currentTestimonial].name}</p>
                      <p className="text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Navigation arrows */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 border-border/50 hover:border-primary/50 hover:bg-primary/5"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 border-border/50 hover:border-primary/50 hover:bg-primary/5"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
        <div className="container-electric">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <Badge className="px-6 py-3 text-accent border-accent/30 bg-accent/10 font-medium">
              🎨 Ready to Create?
            </Badge>
            
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-foreground">
              Start Your Creative Journey Today
            </h2>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              Join thousands of creators who are already using ImageMaster to bring their wildest imagination to life. 
              <span className="text-primary font-semibold"> Start creating stunning AI images in seconds.</span>
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/auth">
                  <Button size="lg" className="text-xl px-12 py-10 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-electric transition-all duration-300 transform hover:scale-105">
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
      <footer className="border-t border-border/20 bg-card/30 py-20">
        <div className="container-electric">
          <div className="text-center space-y-10">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="h-7 w-7 text-primary animate-electric-pulse" />
              <span className="text-2xl font-heading font-bold text-foreground animate-text-glow">
                ImageMaster
              </span>
            </div>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              © 2024 ImageMaster. All rights reserved. Empowering creativity through cutting-edge AI technology.
            </p>
            <div className="flex items-center justify-center gap-8 text-muted-foreground">
              <span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-primary transition-colors cursor-pointer">Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
