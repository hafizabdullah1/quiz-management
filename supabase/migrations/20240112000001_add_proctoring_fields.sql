-- Add proctoring fields to quiz_attempts table
ALTER TABLE quiz_attempts 
ADD COLUMN warnings_count INTEGER DEFAULT 0,
ADD COLUMN is_terminated BOOLEAN DEFAULT FALSE,
ADD COLUMN terminated_reason TEXT;

-- Comment: 
-- warnings_count: Number of times user switched tabs
-- is_terminated: True if the quiz was auto-submitted due to cheating
-- terminated_reason: Reason for termination (e.g., "Tab switching limit exceeded")
