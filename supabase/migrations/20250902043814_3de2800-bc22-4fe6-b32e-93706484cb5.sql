-- Fix RLS policy issues by ensuring all tables have proper policies

-- Check if Email table exists and add policies if needed
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Email') THEN
        -- Add basic policies for Email table
        CREATE POLICY IF NOT EXISTS "Enable read access for authenticated users" 
        ON public."Email" 
        FOR SELECT 
        USING (auth.role() = 'authenticated');
        
        CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users" 
        ON public."Email" 
        FOR INSERT 
        WITH CHECK (auth.role() = 'authenticated');
    END IF;
END
$$;

-- Ensure our agent communication tables have complete policies
DROP POLICY IF EXISTS "Users can view their own agent communications" ON public.agent_communications;

-- Create comprehensive policies for agent_communications
CREATE POLICY "Authenticated users can view agent communications" 
ON public.agent_communications 
FOR SELECT 
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Authenticated users can insert agent communications" 
ON public.agent_communications 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Service role can update agent communications" 
ON public.agent_communications 
FOR UPDATE 
USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete agent communications" 
ON public.agent_communications 
FOR DELETE 
USING (auth.role() = 'service_role');

-- Add policies for session_logs
CREATE POLICY "Authenticated users can view session logs" 
ON public.session_logs 
FOR SELECT 
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Service role can insert session logs" 
ON public.session_logs 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');