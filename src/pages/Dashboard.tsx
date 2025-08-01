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
import { 
  Sparkles, Download, Heart, Share2, Copy, CreditCard, Zap, ImageIcon, Clock, 
  Palette, Wand2, Settings, Images, User, BarChart3, Filter, Search, Grid3X3, 
  MoreVertical, Trash2, Edit, Star, Layers, Play, Pause
} from 'lucide-react';
import { Navigate } from 'react-router-dom';

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchImages();
    }
  }, [user]);

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
        description: 'Please enter a prompt',
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
        title: 'Image generated successfully!',
        description: `Generated in ${data.generationTime}ms`,
      });

      // Refresh profile and images
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
    link.download = `imagemaster-${prompt.slice(0, 20)}.png`;
    link.click();
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

  const filteredImages = images.filter(image =>
    image.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-l-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading your creative space...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50">
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
              <Badge variant="secondary" className="gap-2 px-4 py-2 bg-primary/10 text-primary border-primary/20">
                <CreditCard className="h-4 w-4" />
                {profile?.credits_remaining || 0} credits
              </Badge>
              <Button variant="outline" onClick={signOut} className="hover:bg-primary/5">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Images className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Generation Panel */}
              <Card className="glass border-0 shadow-2xl">
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">AI Image Generator</CardTitle>
                      <CardDescription className="text-lg">
                        Transform your imagination into stunning visuals
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="prompt" className="text-lg font-semibold">Describe Your Vision</Label>
                    <Textarea
                      id="prompt"
                      placeholder="A majestic dragon soaring through a starlit sky above a mystical forest..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={6}
                      className="text-lg border-primary/20 focus:border-primary/40 bg-background/50"
                    />
                  </div>
                  
                  <Button 
                    onClick={generateImage}
                    disabled={generating || !profile || profile.credits_remaining <= 0}
                    className="w-full h-16 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white shadow-lg btn-premium"
                  >
                    {generating ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-l-transparent mr-3"></div>
                        Generating Magic...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-6 w-6 mr-3" />
                        Generate Image (1 credit)
                      </>
                    )}
                  </Button>

                  {/* Quick Prompts */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-muted-foreground">Quick Prompts</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Futuristic cityscape at sunset",
                        "Magical forest with glowing mushrooms",
                        "Abstract art with vibrant colors", 
                        "Vintage car in the rain"
                      ].map((quickPrompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setPrompt(quickPrompt)}
                          className="text-xs hover:bg-primary/5 border-primary/20"
                        >
                          {quickPrompt}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Panel */}
              <div className="space-y-6">
                <Card className="glass border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Your Creative Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                        <div className="text-3xl font-bold text-blue-600">{profile?.credits_remaining || 0}</div>
                        <div className="text-sm text-muted-foreground">Credits Left</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                        <div className="text-3xl font-bold text-green-600">{profile?.total_credits_used || 0}</div>
                        <div className="text-sm text-muted-foreground">Images Created</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Current Plan</span>
                        <Badge variant={profile?.subscription_tier === 'pro' ? 'default' : 'secondary'} className="capitalize">
                          {profile?.subscription_tier || 'free'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Images in Gallery</span>
                        <span className="font-semibold">{images.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Images Preview */}
                <Card className="glass border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      Recent Creations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {images.slice(0, 4).map((image) => (
                          <div key={image.id} className="aspect-square rounded-lg overflow-hidden group relative">
                            <img
                              src={image.image_url}
                              alt={image.prompt}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button size="sm" variant="secondary" onClick={() => downloadImage(image.image_url, image.prompt)}>
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No images yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Your AI Gallery</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search your images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>

            {loadingImages ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-l-transparent"></div>
              </div>
            ) : filteredImages.length === 0 ? (
              <Card className="glass border-0">
                <CardContent className="text-center py-16">
                  <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-2xl font-semibold mb-2">No images found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery ? 'Try a different search term' : 'Create your first AI masterpiece!'}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => {
                      const generateTab = document.querySelector('[value="generate"]') as HTMLElement;
                      generateTab?.click();
                    }}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start Creating
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((image) => (
                  <Card key={image.id} className="group overflow-hidden glass border-0 hover:shadow-2xl transition-all duration-300">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={image.prompt}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      
                      {/* Action Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => downloadImage(image.image_url, image.prompt)}
                          className="h-9 w-9 p-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => copyImageUrl(image.image_url)}
                          className="h-9 w-9 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteImage(image.id)}
                          className="h-9 w-9 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {image.prompt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {image.generation_time_ms}ms
                        </span>
                        <span>{new Date(image.created_at).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="max-w-2xl mx-auto">
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle className="text-2xl">Profile Settings</CardTitle>
                  <CardDescription>Manage your account and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-xl font-semibold">{user?.email}</h3>
                    <Badge variant="secondary" className="mt-2 capitalize">
                      {profile?.subscription_tier || 'free'} plan
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-2">Account Statistics</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Images</span>
                          <div className="font-semibold">{profile?.total_credits_used || 0}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Credits Remaining</span>
                          <div className="font-semibold">{profile?.credits_remaining || 0}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;