-- Check RLS policies on questions table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'questions';

-- Check if RLS is enabled on questions table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'questions' 
AND schemaname = 'public';

-- Check if there are any questions in the table
SELECT COUNT(*) as total_questions FROM public.questions;

-- Check if questions are accessible by teachers
SELECT q.id, q.question_text, q.teacher_id 
FROM public.questions q 
LIMIT 5;
