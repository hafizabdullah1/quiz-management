-- Test script to verify comprehensive data access

-- Test 1: Check if we can access questions for a specific quiz attempt
SELECT 
  qa.id as attempt_id,
  qa.student_name,
  qa.score,
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

-- Test 2: Check if questions are accessible for teachers
SELECT 
  q.id,
  q.question_text,
  q.option_a,
  q.option_b,
  q.option_c,
  q.option_d,
  q.correct_answer,
  quiz.title as quiz_title,
  quiz.teacher_id
FROM public.questions q
JOIN public.quizzes quiz ON quiz.id = q.quiz_id
WHERE quiz.teacher_id = 'c5603487-1491-49cc-abe3-b7f3cbdd2817'
LIMIT 5;

-- Test 3: Check student_answers access
SELECT 
  sa.id,
  sa.attempt_id,
  sa.question_id,
  sa.selected_answer,
  sa.is_correct,
  qa.student_name,
  quiz.title as quiz_title
FROM public.student_answers sa
JOIN public.quiz_attempts qa ON qa.id = sa.attempt_id
JOIN public.quizzes quiz ON quiz.id = qa.quiz_id
WHERE qa.id = '77601722-2b8c-445a-b952-70f082d71258';
