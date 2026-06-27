-- Create question_bank table
CREATE TABLE IF NOT EXISTS public.question_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  category TEXT DEFAULT NULL,
  difficulty TEXT DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;

-- RLS Policies for question_bank
CREATE POLICY "question_bank_select_own" ON public.question_bank
  FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "question_bank_insert_own" ON public.question_bank
  FOR INSERT WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "question_bank_update_own" ON public.question_bank
  FOR UPDATE USING (auth.uid() = teacher_id);

CREATE POLICY "question_bank_delete_own" ON public.question_bank
  FOR DELETE USING (auth.uid() = teacher_id);
