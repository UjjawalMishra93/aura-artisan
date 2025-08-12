import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { Check, Zap, Crown, Star } from 'lucide-react';

interface SubscriptionPlansProps {
  currentPlan?: string;
  onPlanChange?: () => void;
}

const SubscriptionPlans = ({ currentPlan = 'free', onPlanChange }: SubscriptionPlansProps) => {
  const [loading, setLoading] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out our AI image generator',
      features: [
        '1 image generation',
        'Basic image quality',
        'Public gallery access',
        'Community support'
      ],
      credits: 1,
      icon: Star,
      popular: false,
      buttonText: 'Current Plan',
      disabled: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      description: 'Great for regular users and small projects',
        features: [
        '3 image generations per month',
        'High-quality images',
        'Private gallery',
        'Priority support',
        'Download in multiple formats'
      ],
      credits: 3,
      icon: Zap,
      popular: true,
      buttonText: 'Upgrade to Pro',
      disabled: false
    },
    {
      id: 'pro_plus',
      name: 'Pro Plus',
      price: '$50',
      period: 'per month',
      description: 'Perfect for professionals and businesses',
        features: [
        '1000 image generations',
        'Premium image quality',
        'Advanced editing tools',
        '24/7 priority support',
        'Commercial usage rights',
        'API access'
      ],
      credits: 1000,
      icon: Crown,
      popular: false,
      buttonText: 'Upgrade to Pro Plus',
      disabled: false
    }
  ];

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to upgrade your plan',
        variant: 'destructive',
      });
      return;
    }

    if (planId === 'free' || planId === currentPlan) return;

    setLoading(planId);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: planId }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      if (data.url) {
        const checkoutWindow = window.open(data.url, '_blank');
        
        // Show success message with instructions
        toast({
          title: 'Checkout opened',
          description: 'Complete your payment in the new tab. After payment, refresh this page or click "Refresh Subscription" to see your updated plan.',
          duration: 8000,
        });
        
        // Listen for payment completion (optional - can be removed if not needed)
        if (checkoutWindow) {
          const checkPaymentStatus = setInterval(async () => {
            try {
              if (checkoutWindow.closed) {
                clearInterval(checkPaymentStatus);
                // Give some time for webhook to process
                setTimeout(() => {
                  toast({
                    title: 'Payment completed',
                    description: 'Click "Refresh Subscription" to see your updated plan and credits.',
                    duration: 5000,
                  });
                }, 2000);
              }
            } catch (error) {
              clearInterval(checkPaymentStatus);
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: 'Error',
        description: 'Failed to create checkout session. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading('');
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    setLoading('manage');
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error accessing customer portal:', error);
      toast({
        title: 'Error',
        description: 'Failed to access customer portal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Choose Your Plan
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your AI image generation needs. Upgrade or downgrade anytime.
        </p>
        
        {/* Payment completion notice */}
        {currentPlan === 'free' && (
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Just completed a payment?</strong> If you don't see your updated plan, click the "Refresh Subscription Status" button below.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = currentPlan === plan.id;
          const isSubscribed = currentPlan === 'pro' || currentPlan === 'pro_plus';
          
          return (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-primary shadow-lg scale-105' 
                  : isCurrentPlan 
                    ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20' 
                    : 'hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-purple-600 text-white">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center space-y-4">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                  plan.popular ? 'bg-primary text-white' : 'bg-muted'
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                
                <div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-primary">{plan.credits}</div>
                    <div className="text-sm text-muted-foreground">
                      image{plan.credits !== 1 ? 's' : ''} per month
                    </div>
                  </div>

                  {isCurrentPlan ? (
                    <div className="space-y-2">
                      <Button disabled className="w-full bg-green-500 text-white">
                        <Check className="h-4 w-4 mr-2" />
                        Current Plan
                      </Button>
                      {(currentPlan === 'pro' || currentPlan === 'pro_plus') && (
                        <Button 
                          variant="outline" 
                          onClick={handleManageSubscription}
                          disabled={loading === 'manage'}
                          className="w-full"
                        >
                          {loading === 'manage' ? 'Loading...' : 'Manage Subscription'}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={loading === plan.id || plan.disabled}
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500' 
                          : ''
                      }`}
                    >
                      {loading === plan.id ? (
                        'Processing...'
                      ) : (
                        plan.buttonText
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center space-y-4">
        {/* Manual refresh button for all users */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="outline" 
            onClick={onPlanChange}
            className="text-muted-foreground hover:text-foreground"
          >
            🔄 Refresh Subscription Status
          </Button>
          
          <p className="text-sm text-muted-foreground max-w-md">
            If you've recently completed a payment but don't see your updated plan, click this button to refresh your subscription status.
          </p>
        </div>
        
        {/* Manage subscription button for subscribed users */}
        {(currentPlan === 'pro' || currentPlan === 'pro_plus') && (
          <Button 
            variant="outline" 
            onClick={handleManageSubscription}
            disabled={loading === 'manage'}
            className="text-muted-foreground hover:text-foreground"
          >
            {loading === 'manage' ? 'Loading...' : 'Manage Your Subscription'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlans;