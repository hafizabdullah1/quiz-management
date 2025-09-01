-- Create quiz attempts table (for tracking student attempts)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  browser_fingerprint TEXT -- Simple attempt tracking
);

-- Enable RLS
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Allow teachers to view attempts for their quizzes
CREATE POLICY "quiz_attempts_select_by_teacher" ON public.quiz_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = quiz_attempts.quiz_id 
      AND quizzes.teacher_id = auth.uid()
    )
  );

-- Allow public insert for student submissions
CREATE POLICY "quiz_attempts_public_insert" ON public.quiz_attempts
  FOR INSERT WITH CHECK (true);

-- Create unique index to prevent duplicate attempts from same browser
CREATE UNIQUE INDEX IF NOT EXISTS quiz_attempts_unique_browser 
ON public.quiz_attempts(quiz_id, browser_fingerprint);
