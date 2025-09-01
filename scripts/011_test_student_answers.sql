-- Test script to check student_answers table and RLS policies

-- Check if there are any student_answers in the table
SELECT COUNT(*) as total_answers FROM public.student_answers;

-- Check if there are any quiz_attempts
SELECT COUNT(*) as total_attempts FROM public.quiz_attempts;

-- Check the structure of student_answers table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'student_answers' 
AND table_schema = 'public';

-- Check RLS policies on student_answers
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'student_answers';

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'student_answers' 
AND schemaname = 'public';
