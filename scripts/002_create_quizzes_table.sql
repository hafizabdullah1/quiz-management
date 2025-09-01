-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT DEFAULT 'Please read each question carefully and select the best answer.',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quizzes
CREATE POLICY "quizzes_select_own" ON public.quizzes
  FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "quizzes_insert_own" ON public.quizzes
  FOR INSERT WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "quizzes_update_own" ON public.quizzes
  FOR UPDATE USING (auth.uid() = teacher_id);

CREATE POLICY "quizzes_delete_own" ON public.quizzes
  FOR DELETE USING (auth.uid() = teacher_id);

-- Allow public read access for quiz taking (students need to access quiz details)
CREATE POLICY "quizzes_public_read" ON public.quizzes
  FOR SELECT USING (is_active = true);
