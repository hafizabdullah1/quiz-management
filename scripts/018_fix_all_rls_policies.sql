-- Comprehensive fix for all RLS policies to allow proper data fetching

-- 1. Fix questions RLS policy - allow teachers to access questions for their quiz attempts
DROP POLICY IF EXISTS "questions_public_read" ON public.questions;
DROP POLICY IF EXISTS "questions_select_by_teacher" ON public.questions;

-- Create a comprehensive policy for questions
CREATE POLICY "questions_comprehensive_access" ON public.questions
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
DROP POLICY IF EXISTS "student_answers_select_by_teacher" ON public.student_answers;

-- Create comprehensive student_answers policies
CREATE POLICY "student_answers_comprehensive_insert" ON public.student_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      JOIN public.quizzes q ON q.id = qa.quiz_id
      WHERE qa.id = student_answers.attempt_id 
      AND q.is_active = true
    )
  );

CREATE POLICY "student_answers_comprehensive_select" ON public.student_answers
  FOR SELECT USING (
    -- Allow if quiz is active (for students)
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      JOIN public.quizzes q ON q.id = qa.quiz_id
      WHERE qa.id = student_answers.attempt_id 
      AND q.is_active = true
    )
    OR
    -- Allow if teacher owns the quiz (for viewing results)
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      JOIN public.quizzes q ON q.id = qa.quiz_id
      WHERE qa.id = student_answers.attempt_id 
      AND q.teacher_id = auth.uid()
    )
  );

-- 3. Fix quiz_attempts policies
DROP POLICY IF EXISTS "quiz_attempts_public_insert" ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_public_select" ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_public_update" ON public.quiz_attempts;

-- Create comprehensive quiz_attempts policies
CREATE POLICY "quiz_attempts_comprehensive_insert" ON public.quiz_attempts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = quiz_attempts.quiz_id 
      AND quizzes.is_active = true
    )
  );

CREATE POLICY "quiz_attempts_comprehensive_select" ON public.quiz_attempts
  FOR SELECT USING (
    -- Allow if quiz is active (for students)
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = quiz_attempts.quiz_id 
      AND quizzes.is_active = true
    )
    OR
    -- Allow if teacher owns the quiz (for viewing results)
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = quiz_attempts.quiz_id 
      AND quizzes.teacher_id = auth.uid()
    )
  );

CREATE POLICY "quiz_attempts_comprehensive_update" ON public.quiz_attempts
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
