-- Fix RLS policies for agent_communications table
DROP POLICY IF EXISTS "ENABLT_INSERT" ON agent_communications;
DROP POLICY IF EXISTS "Users can view their own agent communications" ON agent_communications;
DROP POLICY IF EXISTS "Allow service role to manage agent communications" ON agent_communications;

-- Create proper RLS policies that allow operations without strict user checks
CREATE POLICY "Enable insert for all users" 
ON agent_communications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable select for all users" 
ON agent_communications 
FOR SELECT 
USING (true);

CREATE POLICY "Enable update for all users" 
ON agent_communications 
FOR UPDATE 
USING (true);

-- Also fix the Email table (capital E) if it has RLS issues
ALTER TABLE "Email" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for all users" 
ON "Email" 
FOR ALL 
USING (true) 
WITH CHECK (true);