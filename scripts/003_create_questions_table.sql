-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  question_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for questions
CREATE POLICY "questions_select_by_teacher" ON public.questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.teacher_id = auth.uid()
    )
  );

CREATE POLICY "questions_insert_by_teacher" ON public.questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.teacher_id = auth.uid()
    )
  );

CREATE POLICY "questions_update_by_teacher" ON public.questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.teacher_id = auth.uid()
    )
  );

CREATE POLICY "questions_delete_by_teacher" ON public.questions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.teacher_id = auth.uid()
    )
  );

-- Allow public read access for active quizzes (students need to see questions)
CREATE POLICY "questions_public_read" ON public.questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.is_active = true
    )
  );
