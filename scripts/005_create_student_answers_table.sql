-- Create student answers table
CREATE TABLE IF NOT EXISTS public.student_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_answer CHAR(1) NOT NULL CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.student_answers ENABLE ROW LEVEL SECURITY;

-- Allow teachers to view answers for their quiz attempts
CREATE POLICY "student_answers_select_by_teacher" ON public.student_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      JOIN public.quizzes q ON q.id = qa.quiz_id
      WHERE qa.id = student_answers.attempt_id 
      AND q.teacher_id = auth.uid()
    )
  );

-- Allow public insert for student submissions
CREATE POLICY "student_answers_public_insert" ON public.student_answers
  FOR INSERT WITH CHECK (true);
