import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Download, Heart, Share2, Copy, CreditCard, Zap, ImageIcon, Clock } from 'lucide-react';
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
}

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
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
        title: 'Image generated!',
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">ImageMaster</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-2">
                <CreditCard className="h-4 w-4" />
                {profile?.credits_remaining || 0} credits
              </Badge>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Generate Image
                </CardTitle>
                <CardDescription>
                  Describe the image you want to create
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="prompt">Image Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="A futuristic cityscape at sunset with flying cars..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                </div>
                <Button 
                  onClick={generateImage}
                  disabled={generating || !profile || profile.credits_remaining <= 0}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Generate Image (1 credit)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credits Remaining</span>
                  <span className="font-semibold">{profile?.credits_remaining || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Images Generated</span>
                  <span className="font-semibold">{profile?.total_credits_used || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <Badge variant={profile?.subscription_tier === 'pro' ? 'default' : 'secondary'}>
                    {profile?.subscription_tier || 'free'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Your Generated Images
                </CardTitle>
                <CardDescription>
                  View and manage your AI-generated images
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingImages ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : images.length === 0 ? (
                  <div className="text-center py-12">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No images generated yet</p>
                    <p className="text-sm text-muted-foreground">Create your first AI masterpiece!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {images.map((image) => (
                      <div key={image.id} className="group relative">
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img
                            src={image.image_url}
                            alt={image.prompt}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        
                        {/* Image Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => downloadImage(image.image_url, image.prompt)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => copyImageUrl(image.image_url)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Image Info */}
                        <div className="mt-3 space-y-2">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {image.prompt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {image.generation_time_ms}ms
                            </span>
                            <span>{new Date(image.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;