-- Add is_favorite column to generated_images table
ALTER TABLE generated_images 
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;

-- Update existing records to have is_favorite = false
UPDATE generated_images 
SET is_favorite = FALSE 
WHERE is_favorite IS NULL;

-- Make the column NOT NULL after setting default values
ALTER TABLE generated_images 
ALTER COLUMN is_favorite SET NOT NULL;

-- Add an index for better performance when filtering by favorites
CREATE INDEX IF NOT EXISTS idx_generated_images_is_favorite ON generated_images(is_favorite);
CREATE INDEX IF NOT EXISTS idx_generated_images_user_favorites ON generated_images(user_id, is_favorite);
