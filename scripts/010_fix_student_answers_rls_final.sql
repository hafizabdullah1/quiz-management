-- Fix RLS policy for student_answers to allow teachers to view answers
DROP POLICY IF EXISTS "student_answers_select_by_teacher" ON public.student_answers;

-- Create new policy that allows teachers to view answers for their quiz attempts
CREATE POLICY "student_answers_select_by_teacher" ON public.student_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      JOIN public.quizzes q ON q.id = qa.quiz_id
      WHERE qa.id = student_answers.attempt_id 
      AND q.teacher_id = auth.uid()
    )
  );

-- Also ensure the public insert policy is correct
DROP POLICY IF EXISTS "student_answers_public_insert" ON public.student_answers;

CREATE POLICY "student_answers_public_insert" ON public.student_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      JOIN public.quizzes q ON q.id = qa.quiz_id
      WHERE qa.id = student_answers.attempt_id 
      AND q.is_active = true
    )
  );
