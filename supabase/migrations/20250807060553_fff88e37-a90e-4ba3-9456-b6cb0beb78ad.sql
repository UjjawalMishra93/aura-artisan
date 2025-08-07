-- Update the handle_new_user function to properly set free plan defaults
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Insert profile with free plan defaults
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name,
    subscription_tier,
    credits_remaining,
    total_credits_used
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'free',
    1,
    0
  );
  
  -- Also insert into subscribers table for consistency
  INSERT INTO public.subscribers (
    user_id,
    email,
    subscribed,
    subscription_tier,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    false,
    'free',
    now(),
    now()
  );
  
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();