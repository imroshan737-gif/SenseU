CREATE TABLE public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL,
  title TEXT,
  completed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated users to insert their own sessions
CREATE POLICY "Users can insert own sessions"
  ON public.sessions
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Users can only read their own sessions
CREATE POLICY "Users can read own sessions"
  ON public.sessions
  FOR SELECT
  USING (auth.uid() = user_id);