import { useState, useEffect, useCallback } from 'react';
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
  MoreVertical, Trash2, Star, Bell, TrendingUp, Eye, 
  Calendar, Lightbulb, Shuffle, Plus, LogOut, Loader2, Heart, RefreshCw
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
  is_favorite: boolean;
}

// Custom hook to manage subscription checking
const useSubscriptionCheck = (user: any) => {
  const [lastCheck, setLastCheck] = useState<number | null>(null);
  
  const shouldCheckSubscription = useCallback(() => {
    if (!user) return false;
    
    // Check if we have a recent subscription check
    const lastSubscriptionCheck = localStorage.getItem(`subscription-check-${user.id}`);
    if (lastSubscriptionCheck) {
      const currentTime = Date.now();
      const oneHour = 60 * 60 * 1000;
      
      // If it's been less than an hour, don't check again
      if ((currentTime - parseInt(lastSubscriptionCheck)) < oneHour) {
        return false;
      }
    }
    
    // Check if we need to verify subscription
    return !lastCheck || (Date.now() - (lastCheck || 0)) > 60 * 60 * 1000;
  }, [user, lastCheck]);
  
  const markSubscriptionChecked = useCallback(() => {
    setLastCheck(Date.now());
    if (user?.id) {
      localStorage.setItem(`subscription-check-${user.id}`, Date.now().toString());
    }
  }, [user?.id]);
  
  return { shouldCheckSubscription, markSubscriptionChecked };
};

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { toast } = useToast();
  
  const { shouldCheckSubscription, markSubscriptionChecked } = useSubscriptionCheck(user);

  useEffect(() => {
    if (user && !subscriptionChecked) {
      // Check if we have cached profile data first
      const cachedProfile = localStorage.getItem(`profile-cache-${user.id}`);
      if (cachedProfile) {
        try {
          const parsedProfile = JSON.parse(cachedProfile);
          const cacheTime = localStorage.getItem(`profile-cache-time-${user.id}`);
          const currentTime = Date.now();
          const tenMinutes = 10 * 60 * 1000; // 10 minutes
          
          // If cache is less than 10 minutes old, use it
          if (cacheTime && (currentTime - parseInt(cacheTime)) < tenMinutes) {
            console.log('Using cached profile data');
            setProfile(parsedProfile);
            setSubscriptionChecked(true);
            return;
          }
        } catch (error) {
          console.error('Error parsing cached profile:', error);
        }
      }
      
      fetchProfile();
      fetchImages();
      
      // Only check subscription if:
      // 1. We don't have profile data yet, OR
      // 2. It's been more than an hour since last check
      if (!profile || shouldCheckSubscription()) {
        // Add a small delay to prevent immediate calls on page refresh
        const timeoutId = setTimeout(() => {
          checkSubscription();
          // Store the current timestamp
          markSubscriptionChecked();
        }, 1000); // 1 second delay
        
        // Cleanup timeout if component unmounts
        return () => clearTimeout(timeoutId);
      }
      
      setSubscriptionChecked(true);
    } else if (user && subscriptionChecked) {
      // Only fetch if we don't have recent data
      const lastProfileFetch = localStorage.getItem(`profile-fetch-${user.id}`);
      const currentTime = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (!lastProfileFetch || (currentTime - parseInt(lastProfileFetch)) >= fiveMinutes) {
        fetchProfile();
      }
      
      fetchImages();
    }
  }, [user, subscriptionChecked, profile, shouldCheckSubscription, markSubscriptionChecked]);

  // Cleanup localStorage when user signs out
  useEffect(() => {
    if (!user) {
      // Clear all cached data when user signs out
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('subscription-check-') || 
            key.startsWith('subscription-cache-') ||
            key.startsWith('profile-fetch-') || 
            key.startsWith('profile-cache-')) {
          localStorage.removeItem(key);
        }
      });
    }
  }, [user]);

  // Check for payment completion and show helpful messages
  useEffect(() => {
    if (user && profile) {
      // Check if user recently completed payment but still shows old plan
      const lastPaymentCheck = localStorage.getItem(`last-payment-check-${user.id}`);
      const currentTime = Date.now();
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours
      
      if (!lastPaymentCheck || (currentTime - parseInt(lastPaymentCheck)) > oneDay) {
        // Show helpful message for users who might have completed payment
        if (profile.subscription_tier === 'free' && profile.credits_remaining === 1) {
          toast({
            title: 'Payment Completed?',
            description: 'If you recently completed a payment but still see Free plan, click the refresh button (🔄) to update your subscription status.',
            duration: 10000,
          });
        }
        
        // Update last payment check time
        localStorage.setItem(`last-payment-check-${user.id}`, currentTime.toString());
      }
    }
  }, [user, profile, toast]);

  const checkSubscription = async () => {
    // Prevent multiple simultaneous calls
    if (isCheckingSubscription) {
      console.log('Subscription check already in progress, skipping...');
      return;
    }
    
    try {
      setIsCheckingSubscription(true);
      console.log('Checking subscription status...');
      
      // Clear any cached subscription data to force a fresh check
      if (user?.id) {
        localStorage.removeItem(`subscription-cache-${user.id}`);
        localStorage.removeItem(`subscription-check-${user.id}`);
      }
      
      // Call the subscription check function
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) {
        console.error('Supabase function error:', error);
        // Fallback: try to fetch profile directly
        await fetchProfile();
        return;
      }
      
      console.log('Subscription check result:', data);
      
      // Always fetch profile after subscription check to ensure we have the latest data
      await fetchProfile();
      
      // Show success message
      toast({
        title: 'Subscription Status Updated',
        description: 'Your subscription status has been refreshed. Check your plan and credits above.',
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error checking subscription:', error);
      
      // Show error message but still try to fetch profile
      toast({
        title: 'Subscription Check Failed',
        description: 'Unable to verify subscription status, but trying to fetch your profile data.',
        variant: 'destructive',
        duration: 5000,
      });
      
      // Fallback: fetch profile anyway
      await fetchProfile();
    } finally {
      setIsCheckingSubscription(false);
    }
  };



  const fetchProfile = async () => {
    if (!user?.id) {
      console.log('No user ID available, skipping profile fetch');
      return;
    }
    
    try {
      console.log('Fetching profile data...');
      
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('credits_remaining, subscription_tier, total_credits_used')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      console.log('Profile data fetched:', data);
      
      if (data) {
        setProfile(data);
        
        // Store the timestamp of this fetch
        const currentTime = Date.now();
        localStorage.setItem(`profile-fetch-${user.id}`, currentTime.toString());
        localStorage.setItem(`profile-cache-${user.id}`, JSON.stringify(data));
        localStorage.setItem(`profile-cache-time-${user.id}`, currentTime.toString());
        
        // Clear subscription cache to ensure fresh data on next check
        localStorage.removeItem(`subscription-cache-${user.id}`);
        localStorage.removeItem(`subscription-check-${user.id}`);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      
      // Show error message
      toast({
        title: 'Profile Update Failed',
        description: 'Unable to fetch your profile data. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
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

      // Update local state immediately for better UX
      if (profile && data.creditsRemaining !== undefined) {
        setProfile(prev => prev ? {
          ...prev,
          credits_remaining: data.creditsRemaining
        } : null);
      }

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

  const handleFavorite = async (imageId: string) => {
    try {
      // Find the current image
      const currentImage = images.find(img => img.id === imageId);
      if (!currentImage) {
        console.error('Image not found:', imageId);
        toast({
          title: 'Error',
          description: 'Image not found. Please refresh the page and try again.',
          variant: 'destructive',
        });
        return;
      }

      // Toggle the favorite status
      const newFavoriteStatus = !currentImage.is_favorite;

      console.log('Updating favorite status:', {
        imageId,
        currentStatus: currentImage.is_favorite,
        newStatus: newFavoriteStatus
      });

      // Update the database
      const { data, error } = await (supabase as any)
        .from('generated_images')
        .update({ is_favorite: newFavoriteStatus })
        .eq('id', imageId)
        .select(); // Add select to get the updated data

      if (error) {
        console.error('Supabase error:', error);
        
        // Provide specific error messages based on error type
        let errorMessage = 'Failed to update favorite status. Please try again.';
        
        if (error.code === '42501') {
          errorMessage = 'Permission denied. Please check your account status.';
        } else if (error.code === '23505') {
          errorMessage = 'Duplicate favorite entry. Please refresh and try again.';
        } else if (error.message) {
          errorMessage = `Database error: ${error.message}`;
        }
        
        throw new Error(errorMessage);
      }

      console.log('Database update successful:', data);

      // Update local state immediately for better UX
      setImages(prevImages => 
        prevImages.map(img => 
          img.id === imageId 
            ? { ...img, is_favorite: newFavoriteStatus }
            : img
        )
      );

      // Show success message
      toast({
        title: newFavoriteStatus ? '❤️ Added to favorites!' : '💔 Removed from favorites',
        description: newFavoriteStatus 
          ? 'Image has been added to your favorites' 
          : 'Image has been removed from your favorites',
      });

    } catch (error: any) {
      console.error('Error updating favorite status:', error);
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to update favorite status. Please try again.',
        variant: 'destructive',
      });
    }
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

  const filteredImages = images.filter(image => {
    const matchesSearch = image.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorites = showFavoritesOnly ? image.is_favorite : true;
    return matchesSearch && matchesFavorites;
  });

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
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated background with subtle gradients and noise texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)] animate-float-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.02),transparent_50%)] animate-float-slower"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.02),transparent_50%)] animate-float-slow"></div>
        
        {/* Subtle animated noise texture */}
        <div className="absolute inset-0 opacity-[0.015]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:20px_20px] animate-pulse"></div>
        </div>
        
        {/* Content container */}
        <div className="relative z-10">

        
        {/* Enhanced Header with Gradient Background */}
        <header className="border-b border-primary/10 bg-gradient-to-r from-background/95 via-background/90 to-primary/5 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Logo size="md" />
              
              <div className="flex items-center gap-6">
                                {/* Credits Badge with Refresh */}
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        variant="secondary" 
                        className={`gap-2 px-6 py-3 text-white shadow-lg relative group ${getSubscriptionColor(profile?.subscription_tier || 'free')}`}
                      >
                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          <span className="font-semibold">{profile?.credits_remaining || 0}</span>
                          <span className="text-sm opacity-90">credits</span>
                        </div>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Credits remaining for image generation</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  {/* Subscription Tier Badge */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        variant="outline" 
                        className="gap-2 px-3 py-1 text-xs border-primary/30 text-primary"
                      >
                        <Star className="h-3 w-3" />
                        {profile?.subscription_tier || 'Free'}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your current subscription tier</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  {/* Refresh Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={checkSubscription}
                        disabled={isCheckingSubscription}
                        className="h-8 w-8 hover-primary-light border-primary/20"
                      >
                        {isCheckingSubscription ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Refresh subscription status</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Notification Bell */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="hover-primary-light border-primary/20 relative group">
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 rounded-lg bg-primary/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <Bell className="h-5 w-5" />
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Sign Out */}
                <Button variant="outline" onClick={signOut} className="hover-primary-light border-primary/20 group relative">
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-primary/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Tabs defaultValue="generate" className="w-full">
            {/* Enhanced Tab Navigation with Glow Effects */}
            <TabsList className="grid w-full grid-cols-5 mb-12 bg-card/50 backdrop-blur-sm shadow-lg h-16 p-2 border border-primary/10">
              <TabsTrigger value="generate" className="flex items-center gap-3 h-12 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground group relative transition-all duration-300 hover-primary-medium">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <Wand2 className="h-5 w-5" />
                  Generate
                </div>
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center gap-3 h-12 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground group relative transition-all duration-300 hover-primary-medium">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <Images className="h-5 w-5" />
                  Gallery
                </div>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-3 h-12 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground group relative transition-all duration-300 hover-primary-medium">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <Heart className="h-5 w-5" />
                  Favorites
                </div>
              </TabsTrigger>
              <TabsTrigger value="plans" className="flex items-center gap-3 h-12 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground group relative transition-all duration-300 hover-primary-medium">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <CreditCard className="h-5 w-5" />
                  Plans
                </div>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-3 h-12 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground group relative transition-all duration-300 hover-primary-medium">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <User className="h-5 w-5" />
                  Profile
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Generate Tab */}
            <TabsContent value="generate" className="space-y-12">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Main Generation Panel */}
                <div className="xl:col-span-2 space-y-8">
                  {/* Enhanced Generation Card with Premium Effects */}
                  <Card className="glass border border-primary/20 shadow-elevation overflow-hidden relative group card-glow">
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/10 to-pink-500/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <CardHeader className="space-y-6 bg-gradient-to-r from-primary/5 via-purple-500/10 to-pink-500/5 relative z-10">
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
                    
                    <CardContent className="space-y-8 p-8 relative z-10">
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
                                className="gap-2 hover-primary-light border-primary/20 group relative"
                              >
                                {/* Subtle glow effect */}
                                <div className="absolute inset-0 rounded-lg bg-primary/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10 flex items-center gap-2">
                                  <Shuffle className="h-4 w-4" />
                                  Random
                                </div>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Generate a random prompt for inspiration</TooltipContent>
                          </Tooltip>
                        </div>
                        
                        <div className="relative group">
                          <Textarea
                            id="prompt"
                            placeholder="A majestic dragon soaring through a starlit sky above a mystical forest with glowing crystal trees..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={6}
                            className="text-lg border-2 border-primary/20 focus:border-primary/40 bg-background/80 backdrop-blur-sm resize-none shadow-lg rounded-xl transition-all duration-300 group-hover:border-primary/30 group-focus-within:border-primary/50 group-focus-within:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                          />
                          {/* Subtle glow effect on focus */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-purple-500/10 to-pink-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-xl"></div>
                          <div className="absolute bottom-4 right-4 text-sm text-muted-foreground">
                            {prompt.length} characters
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Generate Button with Neon Glow */}
                      <Button 
                        onClick={generateImage}
                        disabled={generating || !profile || profile.credits_remaining <= 0}
                        className="w-full h-20 text-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-white shadow-elevation btn-premium btn-glow rounded-xl relative overflow-hidden group"
                      >
                        {/* Neon glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/30 to-pink-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/20 to-pink-500/10 rounded-xl blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-700"></div>
                        
                        {/* Animated border glow */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-[2px] rounded-xl bg-gradient-to-r from-primary to-purple-600"></div>
                        
                        {/* Content with relative positioning */}
                        <div className="relative z-10 flex items-center justify-center">
                        {generating ? (
                          <AnimatedLoader message="Creating your masterpiece..." />
                        ) : (
                          <>
                            <Sparkles className="h-8 w-8 mr-4" />
                            Generate Image (1 credit)
                            <Zap className="h-6 w-6 ml-4" />
                          </>
                        )}
                        </div>
                      </Button>

                      {/* Latest Creation Preview */}
                      {images.length > 0 && (
                        <div className="space-y-6 border-t pt-8">
                          <div className="flex items-center gap-3">
                            <Star className="h-6 w-6 text-primary" />
                            <Label className="text-xl font-semibold">Latest Creation</Label>
                          </div>
                          
                          <Card className="glass border-2 border-primary/20 overflow-hidden shadow-lg relative group card-glow">
                            {/* Subtle glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/20 to-pink-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="aspect-video relative bg-gradient-to-br from-primary/5 to-purple-500/5">
                              <img
                                src={images[0].image_url}
                                alt={images[0].prompt}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                              
                              {/* Clean action overlay: only buttons (no text) */}
                              <div className="absolute bottom-0 right-0 p-6">
                                <div className="flex items-center gap-3">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => downloadImage(images[0].image_url, images[0].prompt)}
                                    className="bg-white/20 backdrop-blur-sm text-white border-white/20 hover-white-dark group relative"
                                  >
                                    {/* Subtle glow effect */}
                                    <div className="absolute inset-0 rounded-lg bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative z-10">
                                      <Download className="h-4 w-4" />
                                    </div>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => window.open(images[0].image_url, '_blank')}
                                    className="bg-white/20 backdrop-blur-sm text-white border-white/20 hover-white-dark group relative"
                                  >
                                    {/* Subtle glow effect */}
                                    <div className="absolute inset-0 rounded-lg bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative z-10">
                                      <Eye className="h-4 w-4" />
                                    </div>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleFavorite(images[0].id)}
                                    className={`${
                                      images[0].is_favorite 
                                        ? 'bg-pink-500/20 border-pink-500/40 hover-pink-dark' 
                                        : 'bg-white/20 border-white/20 hover-white-dark'
                                    } backdrop-blur-sm text-white group relative`}
                                  >
                                    {/* Subtle glow effect */}
                                    <div className="absolute inset-0 rounded-lg bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative z-10">
                                      <Heart className={`h-4 w-4 ${images[0].is_favorite ? 'fill-current text-pink-400' : ''}`} />
                                    </div>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}

                      {/* Favorites Section */}
                      {images.filter(img => img.is_favorite).length > 0 && (
                        <div className="space-y-6 border-t pt-8">
                          <div className="flex items-center gap-3">
                            <Heart className="h-6 w-6 text-pink-500 fill-current" />
                            <Label className="text-xl font-semibold">Your Favorites</Label>
                            <Badge variant="secondary" className="bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950/30 dark:text-pink-300 dark:border-pink-800">
                              {images.filter(img => img.is_favorite).length} images
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {images
                              .filter(img => img.is_favorite)
                              .slice(0, 6) // Show max 6 favorites
                              .map((image) => (
                                <Card key={image.id} className="glass border-2 border-pink-200/30 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                                  <div className="aspect-square relative bg-gradient-to-br from-pink-500/5 to-red-500/5">
                                    <img
                                      src={image.image_url}
                                      alt={image.prompt}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    {/* Favorite Badge */}
                                    <div className="absolute top-3 right-3">
                                      <Badge className="bg-pink-500 text-white border-0 shadow-lg">
                                        <Heart className="h-3 w-3 fill-current mr-1" />
                                        Favorite
                                      </Badge>
                                    </div>
                                    
                                    {/* Hover Actions */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="secondary"
                                          onClick={() => downloadImage(image.image_url, image.prompt)}
                                          className="bg-white/20 backdrop-blur-sm text-white border-white/20 hover-white-dark"
                                        >
                                          <Download className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="secondary"
                                          onClick={() => copyImageUrl(image.image_url)}
                                          className="bg-white/20 backdrop-blur-sm text-white border-white/20 hover-white-dark"
                                        >
                                          <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="secondary"
                                          onClick={() => handleFavorite(image.id)}
                                          className="bg-pink-500/20 backdrop-blur-sm text-white border-pink-500/40 hover-pink-dark"
                                        >
                                          <Heart className="h-4 w-4 fill-current" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <CardContent className="p-3">
                                    <p className="text-sm font-medium line-clamp-2 text-center">
                                      {image.prompt}
                                    </p>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                          
                          {images.filter(img => img.is_favorite).length > 6 && (
                            <div className="text-center">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  // Switch to gallery tab and show favorites
                                  const galleryTab = document.querySelector('[data-value="gallery"]') as HTMLElement;
                                  if (galleryTab) {
                                    galleryTab.click();
                                    setShowFavoritesOnly(true);
                                  }
                                }}
                                className="gap-2 hover:bg-pink-100 dark:hover:bg-pink-900/40"
                              >
                                <Heart className="h-4 w-4" />
                                View All Favorites
                              </Button>
                            </div>
                          )}
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
                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/20 shadow-lg">
                          <div className="text-4xl font-bold text-pink-600 mb-2">{images.filter(img => img.is_favorite).length}</div>
                          <div className="text-sm text-muted-foreground font-medium">Favorites</div>
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
                              
                              {/* Favorite Indicator */}
                              {image.is_favorite && (
                                <div className="absolute top-2 right-2">
                                  <Badge className="bg-pink-500 text-white border-0 shadow-lg text-xs px-2 py-1">
                                    <Heart className="h-3 w-3 fill-current mr-1" />
                                    Fav
                                  </Badge>
                                </div>
                              )}
                              
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => downloadImage(image.image_url, image.prompt)}
                                    className="bg-white/20 backdrop-blur-sm text-white border-white/20"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleFavorite(image.id)}
                                    className={`${
                                      image.is_favorite 
                                        ? 'bg-pink-500/20 border-pink-500/40 hover-pink-dark' 
                                        : 'bg-white/20 border-white/20 hover-white-dark'
                                    } backdrop-blur-sm text-white`}
                                  >
                                    <Heart className={`h-4 w-4 ${image.is_favorite ? 'fill-current text-pink-400' : ''}`} />
                                  </Button>
                                </div>
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
                  
                  {/* Favorites Toggle */}
                  <Button
                    variant={showFavoritesOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`gap-2 transition-all duration-200 ${
                      showFavoritesOnly 
                        ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg' 
                        : 'hover:bg-pink-100 dark:hover:bg-pink-900/40'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                    {showFavoritesOnly ? 'All Images' : 'Favorites Only'}
                  </Button>
                  
                  <Badge variant="outline" className="gap-2">
                    <ImageIcon className="h-4 w-4" />
                    {filteredImages.length} images
                  </Badge>
                  
                  {/* Favorites Count Badge */}
                  <Badge variant="secondary" className="gap-2 bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950/30 dark:text-pink-300 dark:border-pink-800">
                    <Heart className="h-4 w-4" />
                    {images.filter(img => img.is_favorite).length} favorites
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

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Your Favorites</h2>
                  <p className="text-muted-foreground">All your favorite AI-generated images in one place</p>
                </div>
                
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search your favorites..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 border-primary/20 focus:border-primary/40"
                    />
                  </div>
                  
                  <Badge variant="secondary" className="gap-2 bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950/30 dark:text-pink-300 dark:border-pink-800">
                    <Heart className="h-4 w-4" />
                    {images.filter(img => img.is_favorite).length} favorites
                  </Badge>
                </div>
              </div>

              {loadingImages ? (
                <div className="flex justify-center py-20">
                  <AnimatedLoader message="Loading your favorites..." />
                </div>
              ) : images.filter(img => img.is_favorite).length === 0 ? (
                <Card className="glass border-2 border-dashed border-pink-200/50">
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center space-y-4">
                      <Heart className="h-16 w-16 text-pink-300 mx-auto animate-pulse" />
                      <p className="text-muted-foreground font-medium">No favorites yet</p>
                      <p className="text-sm text-muted-foreground">Start creating and favoriting your favorite images!</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Switch to generate tab
                          const generateTab = document.querySelector('[data-value="generate"]') as HTMLElement;
                          if (generateTab) {
                            generateTab.click();
                          }
                        }}
                        className="gap-2 hover:bg-pink-100 dark:hover:bg-pink-900/40"
                      >
                        <Wand2 className="h-4 w-4" />
                        Generate Images
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <ImageCarousel
                  images={images.filter(img => img.is_favorite).filter(image => 
                    image.prompt.toLowerCase().includes(searchQuery.toLowerCase())
                  )}
                  onDownload={downloadImage}
                  onCopy={copyImageUrl}
                  onDelete={deleteImage}
                  onFavorite={handleFavorite}
                />
              )}
            </TabsContent>

            {/* Plans Tab */}
            <TabsContent value="plans">
              <SubscriptionPlans 
                currentPlan={profile?.subscription_tier || 'free'} 
                onPlanChange={checkSubscription}
              />
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
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Favorites</span>
                        <span className="text-2xl font-bold text-pink-600">{images.filter(img => img.is_favorite).length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Dashboard;