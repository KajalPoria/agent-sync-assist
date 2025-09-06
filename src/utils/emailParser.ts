export interface EmailData {
  content: string;
  type: 'text' | 'image' | 'audio';
  timestamp: Date;
}

export interface ParsedEmailInfo {
  subject?: string;
  eventTitle?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  attendees?: string[];
  priority?: 'low' | 'medium' | 'high';
  description?: string;
  actionRequired?: boolean;
  sender?: string;
  eventDuration?: string;
  isConfirmed?: boolean;
}

export class EmailParser {
  static async parseEmail(emailData: EmailData): Promise<ParsedEmailInfo> {
    const content = emailData.content;
    
    // Extract meeting/event indicators
    const isEvent = this.containsEventKeywords(content);
    
    if (isEvent) {
      return this.extractEventDetails(content);
    }
    
    return this.extractGeneralInfo(content);
  }

  private static containsEventKeywords(content: string): boolean {
    const eventKeywords = [
      'meeting', 'appointment', 'conference', 'call', 'session',
      'workshop', 'seminar', 'presentation', 'interview', 'demo',
      'schedule', 'calendar', 'event', 'gather', 'reunion',
      'invitation', 'rsvp', 'reservation', 'booking', 'huddle'
    ];
    
    const lowerContent = content.toLowerCase();
    return eventKeywords.some(keyword => lowerContent.includes(keyword));
  }

  private static extractEventDetails(content: string): ParsedEmailInfo {
    const result: ParsedEmailInfo = {
      actionRequired: true,
      isConfirmed: false
    };

    // Extract sender (email address)
    const senderMatch = content.match(/From:\s*([^\n<]+|<[^>]+>)/i) || 
                       content.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (senderMatch) {
      result.sender = this.cleanText(senderMatch[1].replace(/<[^>]+>/, '').trim());
    }

    // Extract subject/title
    const subjectMatch = content.match(/Subject:\s*([^\n]+)/i) ||
                        content.match(/(?:meeting|call|conference|session|workshop|seminar|presentation|interview|demo|event)(?:\s+(?:about|on|for|regarding))?\s*[:-\s]*\s*([^.\n]+)/i);
    if (subjectMatch) {
      const subject = subjectMatch[1] || subjectMatch[0];
      result.subject = this.cleanText(subject);
      result.eventTitle = result.subject;
    }

    // Extract date patterns with improved matching
    const datePatterns = [
      /(?:on|at|for|date)\s*[:-\s]*\s*(\w+day,?\s+\w+\s+\d{1,2}(?:st|nd|rd|th)?,?\s*\d{4})/i,
      /(?:on|at|for|date)\s*[:-\s]*\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
      /(?:on|at|for|date)\s*[:-\s]*\s*(\w+\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4})/i,
      /(?:on|at|for|date)\s*[:-\s]*\s*(tomorrow|today|next\s+\w+day|this\s+\w+day)/i,
      /(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i,
      /(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4})/i
    ];

    for (const pattern of datePatterns) {
      const match = content.match(pattern);
      if (match) {
        result.eventDate = this.formatDate(this.cleanText(match[1]));
        break;
      }
    }

    // Extract time patterns with improved matching
    const timePatterns = [
      /(?:at|time)\s*[:-\s]*\s*(\d{1,2}:\d{2}\s*(?:am|pm|AM|PM)?)/i,
      /(?:from|between)\s+(\d{1,2}:\d{2}\s*(?:am|pm|AM|PM)?)\s+(?:to|until|till|-)\s+(\d{1,2}:\d{2}\s*(?:am|pm|AM|PM)?)/i,
      /(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM))/i,
      /(\d{1,2}:\d{2})/,
      /(?:at|@)\s+(\d{1,2}(?::\d{2})?\s*(?:o'clock)?)/i
    ];

    for (const pattern of timePatterns) {
      const match = content.match(pattern);
      if (match) {
        if (match[2]) {
          // Handle time ranges
          result.eventTime = this.formatTime(this.cleanText(match[1])) + ' - ' + this.formatTime(this.cleanText(match[2]));
          result.eventDuration = this.calculateDuration(match[1], match[2]);
        } else {
          result.eventTime = this.formatTime(this.cleanText(match[1]));
        }
        break;
      }
    }

    // Extract location with improved patterns
    const locationPatterns = [
      /(?:at|in|location|venue|room|place|address)\s*[:-\s]*\s*([^.\n,;]+(?:,?\s*[^.\n,;]+)*)/i,
      /(?:join|meet)\s+(?:us|me)\s+(?:at|in)\s+([^.\n,;]+)/i,
      /(?:conference room|meeting room|room)\s+([A-Za-z0-9]+)/i,
      /(?:https?:\/\/[^\s]+|meet\.google\.com\/[a-z0-9-]+|zoom\.us\/j\/\d+)/i
    ];

    for (const pattern of locationPatterns) {
      const match = content.match(pattern);
      if (match) {
        result.location = this.cleanText(match[1]);
        break;
      }
    }

    // Extract attendees (email addresses and names)
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const emails = content.match(emailRegex);
    if (emails) {
      result.attendees = [...new Set(emails)]; // Remove duplicates
    }

    // Extract names that might be attendees
    const namePatterns = [
      /(?:with|attendees?|participants?|invitees?|to|cc|bcc)\s*[:-\s]*\s*((?:[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s*,\s*)?)+)/i,
      /(?:please join|inviting)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i
    ];

    for (const pattern of namePatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        const names = match[1].split(/,|\band\b/).map(name => this.cleanText(name));
        if (!result.attendees) result.attendees = [];
        result.attendees.push(...names.filter(name => name.length > 0));
      }
    }

    // Determine priority
    result.priority = this.determinePriority(content);

    // Check if event is confirmed
    result.isConfirmed = /confirmed|accepted|approved|scheduled|booked/i.test(content) && 
                        !/not confirmed|pending|tentative|maybe/i.test(content);

    // Extract description (more comprehensive)
    const descriptionMatch = content.match(/(?:agenda|details|description|about)\s*[:-\s]*\s*([^]{50,300})/i) ||
                           content.match(/(?:\n\n|\r\n\r\n)([^\n]{50,300})/);
    if (descriptionMatch) {
      result.description = this.cleanText(descriptionMatch[1]);
    } else {
      // Fallback: first meaningful paragraph
      const paragraphs = content.split(/\n\s*\n/);
      if (paragraphs.length > 1) {
        result.description = this.cleanText(paragraphs[1].substring(0, 200));
      }
    }

    return result;
  }

  private static extractGeneralInfo(content: string): ParsedEmailInfo {
    const result: ParsedEmailInfo = {
      actionRequired: false,
      isConfirmed: false
    };

    // Extract subject from first line or header
    const subjectMatch = content.match(/Subject:\s*([^\n]+)/i);
    if (subjectMatch) {
      result.subject = this.cleanText(subjectMatch[1]);
    } else {
      const firstLine = content.split('\n')[0];
      if (firstLine && firstLine.length > 5) {
        result.subject = this.cleanText(firstLine);
      }
    }

    // Extract sender
    const senderMatch = content.match(/From:\s*([^\n<]+|<[^>]+>)/i);
    if (senderMatch) {
      result.sender = this.cleanText(senderMatch[1].replace(/<[^>]+>/, '').trim());
    }

    // Extract description (first meaningful content)
    const contentWithoutHeaders = content.replace(/^(From|To|Subject|Date):.*\n?/gmi, '');
    const firstParagraph = contentWithoutHeaders.split(/\n\s*\n/)[0];
    if (firstParagraph) {
      result.description = this.cleanText(firstParagraph.substring(0, 250));
    }

    // Check if action is required
    const actionKeywords = [
      'urgent', 'asap', 'immediate', 'required', 'deadline', 
      'respond', 'reply', 'confirm', 'action needed', 'please review',
      'feedback requested', 'your input', 'need your', 'awaiting your'
    ];
    
    const lowerContent = content.toLowerCase();
    result.actionRequired = actionKeywords.some(keyword => lowerContent.includes(keyword));
    
    result.priority = this.determinePriority(content);

    return result;
  }

  private static determinePriority(content: string): 'low' | 'medium' | 'high' {
    const highPriorityKeywords = ['urgent', 'asap', 'immediate', 'critical', 'emergency', 'important!'];
    const mediumPriorityKeywords = ['important', 'deadline', 'soon', 'required', 'follow up', 'action required'];

    const lowerContent = content.toLowerCase();
    
    if (highPriorityKeywords.some(keyword => lowerContent.includes(keyword))) {
      return 'high';
    }
    
    if (mediumPriorityKeywords.some(keyword => lowerContent.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  }

  private static cleanText(text: string): string {
    return text.trim()
               .replace(/\s+/g, ' ')
               .replace(/[^\w\s:@./-]/g, '')
               .replace(/\s*[,;]\s*/g, ', ')
               .replace(/\s*\.\s*$/, '');
  }

  private static formatDate(dateString: string): string {
    // Simple date formatting - in a real implementation, you'd use a library like date-fns
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    } catch (e) {
      // Fallback to original string if parsing fails
    }
    return dateString;
  }

  private static formatTime(timeString: string): string {
    // Simple time formatting
    const time = timeString.toLowerCase().replace(/\s/g, '');
    
    // Handle formats like "2pm" -> "2:00 PM"
    if (/^\d{1,2}(am|pm)$/i.test(time)) {
      const hour = parseInt(time.match(/\d+/)?.[0] || '0');
      const period = time.match(/(am|pm)/i)?.[0].toUpperCase() || '';
      return `${hour}:00 ${period}`;
    }
    
    // Handle formats like "2:30pm" -> "2:30 PM"
    if (/^\d{1,2}:\d{2}(am|pm)$/i.test(time)) {
      const parts = time.split(/(am|pm)/i);
      return parts[0] + ' ' + parts[1].toUpperCase();
    }
    
    // Add AM/PM if missing but contains numbers
    if (/\d{1,2}:\d{2}/.test(time) && !/(am|pm)/i.test(time)) {
      const [hourStr, minuteStr] = time.split(':');
      const hour = parseInt(hourStr);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minuteStr} ${period}`;
    }
    
    return timeString;
  }

  private static calculateDuration(startTime: string, endTime: string): string {
    try {
      const start = this.parseTime(startTime);
      const end = this.parseTime(endTime);
      
      if (start && end) {
        const diffMs = end.getTime() - start.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffHours > 0) {
          return `${diffHours}h ${diffMinutes}m`;
        } else {
          return `${diffMinutes}m`;
        }
      }
    } catch (e) {
      // Duration calculation failed
    }
    return '';
  }

  private static parseTime(timeString: string): Date | null {
    // Simple time parsing - in a real implementation, use a proper library
    const now = new Date();
    const time = timeString.toLowerCase().replace(/\s/g, '');
    
    let hours = 0, minutes = 0;
    
    if (/(\d{1,2}):(\d{2})(am|pm)?/.test(time)) {
      const match = time.match(/(\d{1,2}):(\d{2})(am|pm)?/);
      hours = parseInt(match![1]);
      minutes = parseInt(match![2]);
      
      if (match![3] === 'pm' && hours < 12) hours += 12;
      if (match![3] === 'am' && hours === 12) hours = 0;
    } else if (/(\d{1,2})(am|pm)/.test(time)) {
      const match = time.match(/(\d{1,2})(am|pm)/);
      hours = parseInt(match![1]);
      minutes = 0;
      
      if (match![2] === 'pm' && hours < 12) hours += 12;
      if (match![2] === 'am' && hours === 12) hours = 0;
    } else {
      return null;
    }
    
    const date = new Date(now);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
}