-- Add time_per_question column to quizzes table
ALTER TABLE quizzes 
ADD COLUMN time_per_question INTEGER DEFAULT 30;

-- Comment: This field stores the time limit per question in seconds. 
-- Default is 30 seconds. Null or 0 could imply no timer if we wanted, 
-- but requirements say "user btaye... like 30 sec".
