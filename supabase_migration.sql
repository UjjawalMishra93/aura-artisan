-- Supabase Migration: Add Favorites Functionality
-- Run this in your Supabase SQL Editor

-- Step 1: Add is_favorite column to generated_images table
ALTER TABLE generated_images 
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;

-- Step 2: Update existing records to have is_favorite = false
UPDATE generated_images 
SET is_favorite = FALSE 
WHERE is_favorite IS NULL;

-- Step 3: Make the column NOT NULL after setting default values
ALTER TABLE generated_images 
ALTER COLUMN is_favorite SET NOT NULL;

-- Step 4: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_generated_images_is_favorite ON generated_images(is_favorite);
CREATE INDEX IF NOT EXISTS idx_generated_images_user_favorites ON generated_images(user_id, is_favorite);

-- Step 5: Add RLS policy for favorites (if you have RLS enabled)
-- This allows users to only see and modify their own favorites
CREATE POLICY IF NOT EXISTS "Users can manage their own favorites" ON generated_images
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Step 6: Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'generated_images' 
AND column_name = 'is_favorite';
