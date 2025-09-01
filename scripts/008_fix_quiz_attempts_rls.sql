-- Fix RLS policy for quiz_attempts to allow public inserts for active quizzes
DROP POLICY IF EXISTS "quiz_attempts_public_insert" ON public.quiz_attempts;

-- Create new policy that allows inserts for active quizzes
CREATE POLICY "quiz_attempts_public_insert" ON public.quiz_attempts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = quiz_attempts.quiz_id 
      AND quizzes.is_active = true
    )
  );

-- Also add a policy for public select of attempts (for students to see their own attempts)
CREATE POLICY "quiz_attempts_public_select" ON public.quiz_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = quiz_attempts.quiz_id 
      AND quizzes.is_active = true
    )
  );
