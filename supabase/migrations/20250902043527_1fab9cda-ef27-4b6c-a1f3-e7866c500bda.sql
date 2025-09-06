-- Create edge function for backend session validation
-- This will store session validation logs and agent communication history

-- Create table for session validation logs
CREATE TABLE IF NOT EXISTS public.session_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT NOT NULL,
  user_id TEXT,
  validation_status BOOLEAN NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Create table for agent communication logs
CREATE TABLE IF NOT EXISTS public.agent_communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  delegation_token_id TEXT NOT NULL,
  from_agent TEXT NOT NULL,
  to_agent TEXT NOT NULL,
  email_content TEXT,
  parsed_info JSONB,
  calendar_event_data JSONB,
  user_consent_given BOOLEAN,
  processing_status TEXT CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_communications
ADD CONSTRAINT agent_communications_processing_status_check
CHECK (processing_status IN (
  'pending',
  'processing',
  'completed',
  'failed',
  'token_generated',
  'consent_granted',
  'consent_denied',
  'event_created'
));


-- Enable Row Level Security
ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_communications ENABLE ROW LEVEL SECURITY;
DROP CONSTRAINT IF EXISTS agent_communications_processing_status_check;

-- Create policies for session_logs (admin only for now)
CREATE POLICY "Allow service role to manage session logs" 
ON public.session_logs 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create policies for agent_communications (users can view their own)
CREATE POLICY "Users can view their own agent communications" 
ON public.agent_communications 
FOR SELECT 
USING (true); -- For demo purposes, allow all users to view

CREATE POLICY "Allow service role to manage agent communications" 
ON public.agent_communications 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for agent_communications
CREATE TRIGGER update_agent_communications_updated_at
  BEFORE UPDATE ON public.agent_communications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();