-- Fix RLS policy for quiz_attempts to allow score updates
-- The issue is that the score update might be blocked by RLS policies

-- Check current policies on quiz_attempts
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'quiz_attempts';

-- Add a policy to allow public updates for score and completion
CREATE POLICY "quiz_attempts_public_update" ON public.quiz_attempts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = quiz_attempts.quiz_id 
      AND quizzes.is_active = true
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = quiz_attempts.quiz_id 
      AND quizzes.is_active = true
    )
  );
