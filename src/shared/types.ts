/**
 * Shared TypeScript types across the application
 */

export interface Account {
  id: string;
  linkedinUrl: string;
  companyName: string;
  industry: string;
  companySize: string;
  annualRevenue?:  string;
  location:  string;
  website?: string;
  description:  string;
  keyPersonnel: Contact[];
  createdAt: Date;
  updatedAt: Date;
  researchNotes?:  string;
}

export interface Contact {
  id: string;
  linkedinUrl: string;
  firstName: string;
  lastName: string;
  title: string;
  email?:  string;
  phone?: string;
  accountId:  string;
  stage: "prospect" | "engaged" | "qualified" | "opportunity";
  lastInteraction?:  Date;
}

export interface AccountResearchOutput {
  accountId: string;
  summary: string;
  keyInsights: string[];
  painPoints: string[];
  buyingIndicators: string[];
  recommendedApproach: string;
  nextSteps: string[];
}

export interface ProspectingTemplate {
  id: string;
  type: "email" | "phone" | "linkedin";
  name: string;
  template: string;
  variables: string[];
}

export interface OutreachMessage {
  id: string;
  contactId: string;
  messageType: "email" | "phone" | "linkedin";
  content: string;
  sentiment: string;
  generatedAt: Date;
  customized: boolean;
}

export interface EnterpriseAccountPlan {
  id: string;
  accountId: string;
  objective: string;
  stakeholders: Contact[];
  timeline: string;
  strategy: string;
  tactics: string[];
  successMetrics: string[];
  risks: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MeetingNote {
  id: string;
  accountId: string;
  contactId?:  string;
  audioUrl?: string;
  transcript:  string;
  summary: string;
  actionItems: string[];
  nextSteps: string[];
  recordedAt: Date;
}

export interface LinkedInNavigatorSync {
  id: string;
  accountIds: string[];
  contactIds: string[];
  syncedAt: Date;
  status: "pending" | "syncing" | "completed" | "failed";
  lastSyncedAt?: Date;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
