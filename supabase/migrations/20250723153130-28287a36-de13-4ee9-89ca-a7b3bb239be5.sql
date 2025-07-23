-- Create form_submissions table
CREATE TABLE public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX idx_form_submissions_submitted_at ON public.form_submissions(submitted_at);
CREATE INDEX idx_form_submissions_email ON public.form_submissions(email);

-- Enable Row Level Security
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous form submissions (for contact forms)
CREATE POLICY "Allow anonymous form submissions" 
ON public.form_submissions 
FOR INSERT 
WITH CHECK (true);

-- Allow reading form submissions (for admin access)
CREATE POLICY "Allow reading form submissions" 
ON public.form_submissions 
FOR SELECT 
USING (true);