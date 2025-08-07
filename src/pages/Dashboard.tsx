import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AnimatedLoader } from '@/components/AnimatedLoader';
import { ImageCarousel } from '@/components/ImageCarousel';
import { QuickPrompts } from '@/components/QuickPrompts';
import { 
  Sparkles, Download, Copy, CreditCard, Zap, ImageIcon, Clock, 
  Palette, Wand2, Settings, Images, User, BarChart3, Filter, Search, 
  MoreVertical, Trash2, Star, Crown, Bell, TrendingUp, Eye, 
  Calendar, Lightbulb, Shuffle, Plus
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Profile {
  credits_remaining: number;
  subscription_tier: string;
  total_credits_used: number;
}

interface GeneratedImage {
  id: string;
  prompt: string;
  image_url: string;
  created_at: string;
  generation_time_ms: number;
  is_public: boolean;
}

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchImages();
      checkSubscription();
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      
      if (data) {
        await fetchProfile();
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const fetchProfile = async () => {
    const { data, error } = await (supabase as any)
      .from('profiles')
      .select('credits_remaining, subscription_tier, total_credits_used')
      .eq('id', user?.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
  };

  const fetchImages = async () => {
    setLoadingImages(true);
    const { data, error } = await (supabase as any)
      .from('generated_images')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching images:', error);
    } else {
      setImages(data || []);
    }
    setLoadingImages(false);
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt to generate an image',
        variant: 'destructive',
      });
      return;
    }

    if (!profile || profile.credits_remaining <= 0) {
      toast({
        title: 'No credits remaining',
        description: 'Please upgrade your plan to generate more images',
        variant: 'destructive',
      });
      return;
    }

    setGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt },
      });

      if (error) {
        throw error;
      }

      toast({
        title: '✨ Image generated successfully!',
        description: `Your masterpiece was created in ${data.generationTime}ms`,
      });

      fetchProfile();
      fetchImages();
      setPrompt('');
    } catch (error: any) {
      toast({
        title: 'Generation failed',
        description: error.message || 'Failed to generate image',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  const downloadImage = (imageUrl: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `imagemaster-${prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.png`;
    link.click();
    
    toast({
      title: 'Download started',
      description: 'Your image is being downloaded',
    });
  };

  const copyImageUrl = (imageUrl: string) => {
    navigator.clipboard.writeText(imageUrl);
    toast({
      title: 'Copied!',
      description: 'Image URL copied to clipboard',
    });
  };

  const deleteImage = async (imageId: string) => {
    const { error } = await (supabase as any)
      .from('generated_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Image deleted',
        description: 'Image has been removed from your gallery',
      });
      fetchImages();
    }
  };

  const handleFavorite = (imageId: string) => {
    // TODO: Implement favorites functionality
    toast({
      title: 'Coming soon!',
      description: 'Favorites feature will be available soon',
    });
  };

  const generateRandomPrompt = () => {
    const prompts = [
      "A mystical forest with bioluminescent creatures",
      "Steampunk airship floating above Victorian city",
      "Digital art of a cosmic nebula with star formation",
      "Underwater city with jellyfish and coral gardens",
      "Ancient temple hidden in misty mountains",
      "Robot artist painting a self-portrait",
      "Crystal cave with rainbow reflections",
      "Flying whales in a surreal sky landscape"
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(randomPrompt);
  };

  const filteredImages = images.filter(image =>
    image.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <AnimatedLoader message="Loading your creative space..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getSubscriptionColor = (tier: string) => {
    switch (tier) {
      case 'pro':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'pro_plus':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Enhanced Header */}
        <header className="border-b bg-background/95 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Logo size="md" />
              
              <div className="flex items-center gap-6">
                {/* Credits Badge */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="secondary" 
                      className={`gap-2 px-6 py-3 text-white shadow-lg ${getSubscriptionColor(profile?.subscription_tier || 'free')}`}
                    >
                      <CreditCard className="h-5 w-5" />
                      <span className="font-semibold">{profile?.credits_remaining || 0}</span>
                      <span className="text-sm opacity-90">credits</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Credits remaining for image generation</p>
                  </TooltipContent>
                </Tooltip>

                {/* Notification Bell */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="hover:bg-primary/5 border-primary/20 relative">
                      <Bell className="h-5 w-5" />
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Sign Out */}
                <Button variant="outline" onClick={signOut} className="hover:bg-primary/5 border-primary/20">
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Tabs defaultValue="generate" className="w-full">
            {/* Enhanced Tab Navigation */}
            <TabsList className="grid w-full grid-cols-4 mb-12 bg-card/50 backdrop-blur-sm shadow-lg h-16 p-2">
              <TabsTrigger value="generate" className="flex items-center gap-3 h-12 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Wand2 className="h-5 w-5" />
                Generate
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center gap-3 h-12 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Images className="h-5 w-5" />
                Gallery
              </TabsTrigger>
              <TabsTrigger value="plans" className="flex items-center gap-3 h-12 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Crown className="h-5 w-5" />
                Plans
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-3 h-12 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <User className="h-5 w-5" />
                Profile
              </TabsTrigger>
            </TabsList>

            {/* Generate Tab */}
            <TabsContent value="generate" className="space-y-12">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Main Generation Panel */}
                <div className="xl:col-span-2 space-y-8">
                  {/* Enhanced Generation Card */}
                  <Card className="glass border-0 shadow-elevation overflow-hidden">
                    <CardHeader className="space-y-6 bg-gradient-to-r from-primary/5 to-purple-500/5">
                      <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg">
                          <Zap className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            AI Image Generator
                          </CardTitle>
                          <CardDescription className="text-lg text-muted-foreground">
                            Transform your imagination into stunning visuals with AI magic
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-8 p-8">
                      {/* Enhanced Prompt Input */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="prompt" className="text-xl font-semibold flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-primary" />
                            Enter your scene description
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={generateRandomPrompt}
                                className="gap-2 hover:bg-primary/5 border-primary/20"
                              >
                                <Shuffle className="h-4 w-4" />
                                Random
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Generate a random prompt for inspiration</TooltipContent>
                          </Tooltip>
                        </div>
                        
                        <div className="relative">
                          <Textarea
                            id="prompt"
                            placeholder="A majestic dragon soaring through a starlit sky above a mystical forest with glowing crystal trees..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={6}
                            className="text-lg border-2 border-primary/20 focus:border-primary/40 bg-background/80 backdrop-blur-sm resize-none shadow-lg rounded-xl"
                          />
                          <div className="absolute bottom-4 right-4 text-sm text-muted-foreground">
                            {prompt.length} characters
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Generate Button */}
                      <Button 
                        onClick={generateImage}
                        disabled={generating || !profile || profile.credits_remaining <= 0}
                        className="w-full h-20 text-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white shadow-elevation btn-premium rounded-xl"
                      >
                        {generating ? (
                          <AnimatedLoader message="Creating your masterpiece..." />
                        ) : (
                          <>
                            <Sparkles className="h-8 w-8 mr-4" />
                            Generate Image (1 credit)
                            <Zap className="h-6 w-6 ml-4" />
                          </>
                        )}
                      </Button>

                      {/* Latest Creation Preview */}
                      {images.length > 0 && (
                        <div className="space-y-6 border-t pt-8">
                          <div className="flex items-center gap-3">
                            <Star className="h-6 w-6 text-primary" />
                            <Label className="text-xl font-semibold">Latest Creation</Label>
                          </div>
                          
                          <Card className="glass border-2 border-primary/20 overflow-hidden shadow-lg">
                            <div className="aspect-video relative bg-gradient-to-br from-primary/5 to-purple-500/5">
                              <img
                                src={images[0].image_url}
                                alt={images[0].prompt}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              
                              {/* Enhanced Action Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="space-y-4">
                                  <p className="text-white font-semibold text-lg line-clamp-2 bg-black/40 backdrop-blur-sm rounded-lg p-3">
                                    {images[0].prompt}
                                  </p>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-white/90">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-sm">{images[0].generation_time_ms}ms</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm">
                                          {new Date(images[0].created_at).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => downloadImage(images[0].image_url, images[0].prompt)}
                                        className="bg-white/20 backdrop-blur-sm text-white border-white/20 hover:bg-white/30"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => copyImageUrl(images[0].image_url)}
                                        className="bg-white/20 backdrop-blur-sm text-white border-white/20 hover:bg-white/30"
                                      >
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Enhanced Quick Prompts */}
                  <QuickPrompts onPromptSelect={setPrompt} />
                </div>

                {/* Enhanced Stats & Recent Panel */}
                <div className="space-y-8">
                  {/* Creative Stats */}
                  <Card className="glass border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <BarChart3 className="h-6 w-6 text-primary" />
                        Your Creative Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 shadow-lg">
                          <div className="text-4xl font-bold text-blue-600 mb-2">{profile?.credits_remaining || 0}</div>
                          <div className="text-sm text-muted-foreground font-medium">Credits Left</div>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 shadow-lg">
                          <div className="text-4xl font-bold text-green-600 mb-2">{profile?.total_credits_used || 0}</div>
                          <div className="text-sm text-muted-foreground font-medium">Images Created</div>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 shadow-lg">
                          <div className="text-4xl font-bold text-purple-600 mb-2">{images.length}</div>
                          <div className="text-sm text-muted-foreground font-medium">Gallery Size</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 border-t pt-6">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground font-medium">Current Plan</span>
                          <Badge 
                            variant={profile?.subscription_tier === 'free' ? 'secondary' : 'default'} 
                            className="capitalize font-semibold"
                          >
                            {profile?.subscription_tier || 'free'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Creations Preview */}
                  <Card className="glass border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <ImageIcon className="h-6 w-6 text-primary" />
                        Recent Creations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {images.slice(0, 4).map((image) => (
                            <div key={image.id} className="aspect-square rounded-xl overflow-hidden group relative shadow-lg">
                              <img
                                src={image.image_url}
                                alt={image.prompt}
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => downloadImage(image.image_url, image.prompt)}
                                  className="bg-white/20 backdrop-blur-sm text-white border-white/20"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
                          <p className="text-muted-foreground font-medium">No images yet</p>
                          <p className="text-sm text-muted-foreground">Start creating to see your work here!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Enhanced Gallery Tab */}
            <TabsContent value="gallery" className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Complete History</h2>
                  <p className="text-muted-foreground">All your generated images in one place</p>
                </div>
                
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search your creations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 border-primary/20 focus:border-primary/40"
                    />
                  </div>
                  <Badge variant="outline" className="gap-2">
                    <ImageIcon className="h-4 w-4" />
                    {filteredImages.length} images
                  </Badge>
                </div>
              </div>

              {loadingImages ? (
                <div className="flex justify-center py-20">
                  <AnimatedLoader message="Loading your gallery..." />
                </div>
              ) : (
                <ImageCarousel
                  images={filteredImages}
                  onDownload={downloadImage}
                  onCopy={copyImageUrl}
                  onDelete={deleteImage}
                  onFavorite={handleFavorite}
                />
              )}
            </TabsContent>

            {/* Plans Tab */}
            <TabsContent value="plans">
              <SubscriptionPlans currentPlan={profile?.subscription_tier || 'free'} onPlanChange={checkSubscription} />
            </TabsContent>

            {/* Enhanced Profile Tab */}
            <TabsContent value="profile" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <User className="h-6 w-6 text-primary" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                        <p className="text-lg font-semibold">{user?.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Subscription</Label>
                        <Badge className={`capitalize font-semibold ${getSubscriptionColor(profile?.subscription_tier || 'free')} text-white`}>
                          {profile?.subscription_tier || 'free'}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                        <p className="text-lg font-semibold">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <TrendingUp className="h-6 w-6 text-primary" />
                      Usage Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Images Created</span>
                        <span className="text-2xl font-bold text-primary">{profile?.total_credits_used || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Credits Remaining</span>
                        <span className="text-2xl font-bold text-green-600">{profile?.credits_remaining || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Gallery Size</span>
                        <span className="text-2xl font-bold text-blue-600">{images.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Dashboard;