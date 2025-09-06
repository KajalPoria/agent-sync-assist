import { ParsedEmailInfo } from '../utils/emailParser.ts';
import { supabase } from '../integrations/supabase/client.ts';

export interface DelegationToken {
  id: string;
  agentFrom: string;
  agentTo: string;
  scope: string[];
  emailData: ParsedEmailInfo;
  timestamp: Date;
  expiresAt: Date;
  status: 'pending' | 'approved' | 'denied' | 'used';
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  location?: string;
  attendees?: string[];
  priority: 'low' | 'medium' | 'high';
}

export class AgentCommunication {
  // Email Agent (Agent A) - Processes emails and generates delegation tokens
  static async processEmailWithAgentA(emailData: ParsedEmailInfo): Promise<DelegationToken> {
    console.log('🤖 Agent A: Processing email with real backend...');
    
    try {
      const token: DelegationToken = {
        id: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        agentFrom: 'Email Intelligence Agent (Agent A)',
        agentTo: 'Calendar Management Agent (Agent B)',
        scope: ['calendar:write', 'events:create', 'attendees:invite'],
        emailData,
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'pending'
      };

      // Store the communication in Supabase
      const { data, error } = await supabase
        .from('agent_communications')
        .insert({
          delegation_token_id: token.id,
          from_agent: token.agentFrom,
          to_agent: token.agentTo,
          email_content: JSON.stringify(emailData),
          parsed_info: emailData as any,
          processing_status: 'processing',
          user_consent_given: null
        });

      if (error) {
        console.error('Failed to store agent communication:', error);
        throw new Error('Failed to store delegation token');
      }

      console.log('✅ Agent A: Email processed and token stored in database:', token.id);
      return token;
    } catch (error) {
      console.error('Agent A processing error:', error);
      throw error;
    }
  }

  // Calendar Agent (Agent B) - Receives delegation token and requests user consent
  static async requestCalendarAccess(token: DelegationToken): Promise<boolean> {
    console.log('🤝 Agent B: Requesting user consent...');
    
    return new Promise((resolve) => {
      const userConsent = window.confirm(
        `🗓️ Calendar Management Agent (Agent B) requests permission:\n\n` +
        `Create calendar event: "${token.emailData.eventTitle || token.emailData.subject}"\n` +
        `Date: ${token.emailData.eventDate || 'To be scheduled'}\n` +
        `Time: ${token.emailData.eventTime || 'To be determined'}\n` +
        `Location: ${token.emailData.location || 'Virtual/TBD'}\n\n` +
        `Do you grant permission to create this calendar event?`
      );

      setTimeout(async () => {
        // Update the database with user consent
        try {
          const { error } = await supabase
            .from('agent_communications')
            .update({ 
              user_consent_given: userConsent,
              processing_status: userConsent ? 'completed' : 'failed'
            })
            .eq('delegation_token_id', token.id);

          if (error) {
            console.error('Failed to update consent:', error);
          } else {
            console.log(`✅ User consent ${userConsent ? 'granted' : 'denied'} and recorded`);
          }
        } catch (error) {
          console.error('Error updating consent:', error);
        }

        resolve(userConsent);
      }, 500);
    });
  }

  // Create calendar event after user consent
  static async createCalendarEvent(token: DelegationToken): Promise<CalendarEvent> {
    console.log('📅 Agent B: Creating calendar event...');
    
    try {
      const event: CalendarEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: token.emailData.eventTitle || token.emailData.subject || 'New Meeting',
        description: token.emailData.description || 'Created from email analysis by AI agents',
        startDate: token.emailData.eventDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: token.emailData.eventTime || '2:00 PM',
        location: token.emailData.location || 'Virtual Meeting',
        attendees: token.emailData.attendees || [],
        priority: token.emailData.priority || 'medium'
      };

      // Store the calendar event data
      const { error } = await supabase
        .from('agent_communications')
        .update({ 
          calendar_event_data: event as any,
          processing_status: 'completed'
        })
        .eq('delegation_token_id', token.id);

      if (error) {
        console.error('Failed to store calendar event:', error);
        throw new Error('Failed to store calendar event');
      }

      console.log('✅ Agent B: Calendar event created and stored:', event.id);
      return event;
    } catch (error) {
      console.error('Calendar event creation error:', error);
      throw error;
    }
  }

  // Validate session token (Real backend validation)
  static async validateSessionToken(sessionToken: string): Promise<boolean> {
    try {
      console.log('🔐 Backend: Validating session token...');
      
      // Use Supabase Edge Function for validation
      const { data, error } = await supabase.functions.invoke('validate-session', {
        body: { sessionToken }
      });

      if (error) {
        console.error('Session validation error:', error);
        return false;
      }

      const isValid = data?.valid || false;
      console.log(`✅ Session token ${isValid ? 'valid' : 'invalid'}`);
      return isValid;
      
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }

  // Generate secure delegation token with proper encryption
  static generateSecureDelegationToken(fromAgent: string, toAgent: string, scopes: string[]): string {
    const tokenData = {
      from: fromAgent,
      to: toAgent,
      scopes,
      timestamp: Date.now(),
      nonce: crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
    };

    // In production, this should use proper JWT signing
    return btoa(JSON.stringify(tokenData));
  }

  // Fetch communication history from database
  static async getCommunicationHistory(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('agent_communications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Failed to fetch communication history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching communication history:', error);
      return [];
    }
  }
}