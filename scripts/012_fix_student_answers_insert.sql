-- Fix the student_answers insert policy to allow public inserts for active quizzes
DROP POLICY IF EXISTS "student_answers_public_insert" ON public.student_answers;

-- Create a more specific policy for public inserts
CREATE POLICY "student_answers_public_insert" ON public.student_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      JOIN public.quizzes q ON q.id = qa.quiz_id
      WHERE qa.id = student_answers.attempt_id 
      AND q.is_active = true
    )
  );

-- Also add a policy for public select (for debugging)
CREATE POLICY "student_answers_public_select" ON public.student_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      JOIN public.quizzes q ON q.id = qa.quiz_id
      WHERE qa.id = student_answers.attempt_id 
      AND q.is_active = true
    )
  );
