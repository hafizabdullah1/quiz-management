-- Fix RLS policy for questions to allow fetching with student answers
-- The issue is that when fetching student_answers with questions, the RLS policy
-- needs to allow access to questions for student answers

-- Drop the existing public read policy
DROP POLICY IF EXISTS "questions_public_read" ON public.questions;

-- Create a new policy that allows reading questions for student answers
CREATE POLICY "questions_public_read" ON public.questions
  FOR SELECT USING (
    -- Allow if quiz is active (for students taking quiz)
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.is_active = true
    )
    OR
    -- Allow if teacher owns the quiz (for viewing results)
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.teacher_id = auth.uid()
    )
    OR
    -- Allow if question is referenced in student_answers (for result viewing)
    EXISTS (
      SELECT 1 FROM public.student_answers sa
      JOIN public.quiz_attempts qa ON qa.id = sa.attempt_id
      JOIN public.quizzes q ON q.id = qa.quiz_id
      WHERE sa.question_id = questions.id
      AND q.teacher_id = auth.uid()
    )
  );
