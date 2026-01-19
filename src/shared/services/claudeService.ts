/**
 * Claude AI Service for enterprise account research and insights
 */

import Anthropic from "@anthropic-ai/sdk";
import {
  Account,
  Contact,
  AccountResearchOutput,
  OutreachMessage,
} from "../types.js";

const client = new Anthropic();

export class ClaudeService {
  /**
   * Analyze an account for comprehensive research insights
   */
  static async analyzeAccount(
    account: Account,
    contacts: Contact[]
  ): Promise<AccountResearchOutput> {
    const accountContext = `
Account Information:
- Company: ${account.companyName}
- Industry: ${account.industry}
- Size: ${account.companySize}
- Location: ${account.location}
- Website: ${account.website || "N/A"}
- Description: ${account.description}

Key Personnel:
${contacts.map((c) => `- ${c.firstName} ${c.lastName} (${c.title})`).join("\n")}

Previous Notes:
${account.researchNotes || "No previous notes"}
    `;

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens:2000,
      messages: [
        {
          role: "user",
          content:`You are an expert B2B sales analyst.  Analyze this enterprise account and provide: 
1. Executive Summary (2-3 sentences)
2. Key Insights (3-5 bullet points about the company's business, market position, tech stack)
3. Potential Pain Points (3-5 areas where they might need solutions)
4. Buying Indicators (signs they are actively looking for solutions)
5. Recommended Sales Approach (personalized strategy for this specific account)
6. Next Steps (3-4 concrete actions to take)

${accountContext}

Format your response as structured JSON with keys: summary, keyInsights, painPoints, buyingIndicators, recommendedApproach, nextSteps`,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    try {
      const parsed = JSON.parse(responseText);
      return {
        accountId: account.id,
        ...parsed,
      };
    } catch {
      return {
        accountId: account.id,
        summary: responseText,
        keyInsights: [],
        painPoints: [],
        buyingIndicators: [],
        recommendedApproach: "",
        nextSteps: [],
      };
    }
  }

  /**
   * Generate personalized outreach messages
   */
  static async generateOutreachMessage(
    contact: Contact,
    account: Account,
    context: string,
    messageType: "email" | "phone" | "linkedin"
  ): Promise<OutreachMessage> {
    const prompts = {
      email: `Draft a personalized, professional email to ${contact.firstName} ${contact.lastName}, ${contact.title} at ${account.companyName}. 

Context about the account and previous interactions:
${context}

Requirements:
- Subject line that stands out
- Personalized opening that references something specific about them/their company
- Clear value proposition
- Single, specific call-to-action
- Professional but conversational tone
- 150-200 words for body

Format as: 
Subject: [subject]
Body: [email body]`,

      phone: `Draft a concise phone script (60-90 seconds) to call ${contact.firstName} ${contact.lastName}, ${contact.title} at ${account.companyName}.

Context:
${context}

Include: 
- Opening hook (who you are, why you're calling)
- 1-2 sentence value proposition
- Questions to understand their situation
- Soft close asking for a brief meeting
- Handle potential objections

Format as a conversational script with stage directions.`,

      linkedin: `Draft a LinkedIn connection request message and follow-up to ${contact.firstName} ${contact.lastName}, ${contact.title} at ${account.companyName}.

Context:
${context}

Requirements:
- Connection request note (150 characters max)
- First message after connection (150-200 words)
- References to shared connections or mutual interests
- Value-first approach
- Call-to-action for brief conversation`,
    };

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: prompts[messageType],
        },
      ],
    });

    const content =
      message.content[0].type === "text" ? message. content[0].text : "";

    return {
      id: `msg_${Date.now()}`,
      contactId: contact.id,
      messageType,
      content,
      sentiment: "professional",
      generatedAt: new Date(),
      customized: true,
    };
  }

  /**
   * Process meeting notes and extract insights
   */
  static async processMeetingTranscript(
    transcript: string,
    accountContext: string
  ): Promise<{
    summary: string;
    actionItems: string[];
    nextSteps: string[];
    sentiment: string;
  }> {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens:1500,
      messages: [
        {
          role: "user",
          content: `Analyze this meeting transcript and provide: 
1. A brief summary (2-3 sentences) of what was discussed
2. Key action items (what needs to be done and by whom)
3. Next steps in the sales process
4. Overall sentiment/tone of the meeting

Account Context:
${accountContext}

Transcript: 
${transcript}

Format as JSON with keys: summary, actionItems, nextSteps, sentiment`,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    try {
      return JSON.parse(responseText);
    } catch {
      return {
        summary: responseText,
        actionItems: [],
        nextSteps: [],
        sentiment: "neutral",
      };
    }
  }

  /**
   * Create an enterprise account strategy plan
   */
  static async createAccountPlan(
    account: Account,
    contacts: Contact[],
    objectives: string
  ): Promise<string> {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2500,
      messages: [
        {
          role: "user",
          content: `Create a comprehensive enterprise account plan for ${account.companyName}. 

Account Details:
- Industry: ${account.industry}
- Size: ${account.companySize}
- Location: ${account.location}

Key Contacts:
${contacts.map((c) => `- ${c.firstName} ${c.lastName} (${c.title})`).join("\n")}

Business Objectives:
${objectives}

Please provide:
1. Executive Summary
2. Account Overview & Opportunity Assessment
3. Stakeholder Analysis (decision makers, influencers, users)
4. Value Proposition & Differentiation
5. Sales Strategy (phases, tactics, timeline)
6. Key Messages for Different Personas
7. Risk Mitigation
8. Success Metrics & KPIs
9. 90-Day Action Plan

Format as a detailed markdown document suitable for a sales team.`,
        },
      ],
    });

    return message.content[0].type === "text" ? message.content[0].text : "";
  }
}
