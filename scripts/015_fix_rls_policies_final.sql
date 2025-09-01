-- Final fix for RLS policies - handle existing policies properly

-- 1. Fix questions RLS policy
DROP POLICY IF EXISTS "questions_public_read" ON public.questions;

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

-- 2. Fix student_answers policies
DROP POLICY IF EXISTS "student_answers_public_insert" ON public.student_answers;
DROP POLICY IF EXISTS "student_answers_public_select" ON public.student_answers;

-- Create insert policy for public submissions
CREATE POLICY "student_answers_public_insert" ON public.student_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      JOIN public.quizzes q ON q.id = qa.quiz_id
      WHERE qa.id = student_answers.attempt_id 
      AND q.is_active = true
    )
  );

-- Create select policy for public access (for debugging and result viewing)
CREATE POLICY "student_answers_public_select" ON public.student_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      JOIN public.quizzes q ON q.id = qa.quiz_id
      WHERE qa.id = student_answers.attempt_id 
      AND q.is_active = true
    )
  );
