-- Fix RLS policy for student_answers to allow public inserts for active quizzes
DROP POLICY IF EXISTS "student_answers_public_insert" ON public.student_answers;

-- Create new policy that allows inserts for active quizzes
CREATE POLICY "student_answers_public_insert" ON public.student_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      JOIN public.quizzes q ON q.id = qa.quiz_id
      WHERE qa.id = student_answers.attempt_id 
      AND q.is_active = true
    )
  );

-- Also add a policy for public select of answers (for students to see their own answers)
CREATE POLICY "student_answers_public_select" ON public.student_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      JOIN public.quizzes q ON q.id = qa.quiz_id
      WHERE qa.id = student_answers.attempt_id 
      AND q.is_active = true
    )
  );
