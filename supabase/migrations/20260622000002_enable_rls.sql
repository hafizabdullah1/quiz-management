-- Enable Row Level Security
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to be safe and idempotent)
DROP POLICY IF EXISTS "Teachers can manage their own quizzes" ON quizzes;
DROP POLICY IF EXISTS "Teachers can manage their questions" ON questions;
DROP POLICY IF EXISTS "Teachers can read quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Teachers can read student answers" ON student_answers;

-- Quizzes: Teachers can do everything to their own quizzes
CREATE POLICY "Teachers can manage their own quizzes" ON quizzes
FOR ALL USING (auth.uid() = teacher_id);

-- Questions: Teachers can manage questions for their quizzes
CREATE POLICY "Teachers can manage their questions" ON questions
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM quizzes 
        WHERE quizzes.id = questions.quiz_id 
        AND quizzes.teacher_id = auth.uid()
    )
);

-- Quiz Attempts: Teachers can read/manage attempts for their quizzes
CREATE POLICY "Teachers can read quiz attempts" ON quiz_attempts
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM quizzes 
        WHERE quizzes.id = quiz_attempts.quiz_id 
        AND quizzes.teacher_id = auth.uid()
    )
);

-- Student Answers: Teachers can read/manage answers for attempts on their quizzes
CREATE POLICY "Teachers can read student answers" ON student_answers
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM quiz_attempts
        JOIN quizzes ON quizzes.id = quiz_attempts.quiz_id
        WHERE quiz_attempts.id = student_answers.attempt_id
        AND quizzes.teacher_id = auth.uid()
    )
);

-- Note: Students (anon users) have NO direct access to these tables.
-- All student operations (fetching questions, starting quiz, submitting) 
-- will be handled by secure Next.js API routes using the Service Role Key.
