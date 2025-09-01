-- Add started_at column to quiz_attempts table
ALTER TABLE public.quiz_attempts 
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing records to have started_at same as completed_at (fallback)
UPDATE public.quiz_attempts 
SET started_at = completed_at 
WHERE started_at IS NULL;
