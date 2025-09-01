-- Create teachers table that references auth.users
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teachers
CREATE POLICY "teachers_select_own" ON public.teachers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "teachers_insert_own" ON public.teachers
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "teachers_update_own" ON public.teachers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "teachers_delete_own" ON public.teachers
  FOR DELETE USING (auth.uid() = id);
