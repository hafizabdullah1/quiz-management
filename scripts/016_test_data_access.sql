-- Test script to check if data is accessible with current RLS policies

-- Check if we can access student_answers
SELECT COUNT(*) as student_answers_count FROM public.student_answers;

-- Check if we can access questions
SELECT COUNT(*) as questions_count FROM public.questions;

-- Check if we can access quiz_attempts
SELECT COUNT(*) as quiz_attempts_count FROM public.quiz_attempts;

-- Test the join that should work in the view details page
-- This simulates what the Supabase query should return
SELECT 
  qa.id as attempt_id,
  qa.student_name,
  qa.student_email,
  qa.score,
  qa.total_questions,
  qa.completed_at,
  sa.id as answer_id,
  sa.question_id,
  sa.selected_answer,
  sa.is_correct,
  q.question_text,
  q.option_a,
  q.option_b,
  q.option_c,
  q.option_d,
  q.correct_answer
FROM public.quiz_attempts qa
LEFT JOIN public.student_answers sa ON sa.attempt_id = qa.id
LEFT JOIN public.questions q ON q.id = sa.question_id
WHERE qa.id = '77601722-2b8c-445a-b952-70f082d71258'
ORDER BY sa.id;
