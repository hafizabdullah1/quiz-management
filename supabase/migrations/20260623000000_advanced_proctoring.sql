-- Add detailed proctoring tracking to quiz_attempts

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS tab_switches_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS window_blurs_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS fullscreen_leaves_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS proctoring_logs JSONB DEFAULT '[]'::jsonb;

-- Comment:
-- tab_switches_count: Number of times user switched to a different browser tab
-- window_blurs_count: Number of times user clicked outside the browser window entirely
-- fullscreen_leaves_count: Number of times user exited fullscreen mode
-- proctoring_logs: Array of specific violation events with timestamps
