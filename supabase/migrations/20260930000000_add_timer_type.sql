-- Add timer_type and total_time_limit columns to quizzes table
ALTER TABLE quizzes 
ADD COLUMN timer_type TEXT DEFAULT 'none' CHECK (timer_type IN ('none', 'per_question', 'total_time')),
ADD COLUMN total_time_limit INTEGER DEFAULT NULL;
