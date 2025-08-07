-- Update credit limits in the database
-- Update existing free users to have 1 credit
UPDATE public.profiles 
SET credits_remaining = 1 
WHERE subscription_tier = 'free';

-- Update existing pro users to have 3 credits  
UPDATE public.profiles 
SET credits_remaining = 3 
WHERE subscription_tier = 'pro';

-- Update existing pro_plus users to have 1000 credits
UPDATE public.profiles 
SET credits_remaining = 1000 
WHERE subscription_tier = 'pro_plus';