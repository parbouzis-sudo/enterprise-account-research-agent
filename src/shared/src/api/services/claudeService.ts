/**
 * Claude AI Service for enterprise account research and insights
 */

import { Anthropic } from "anthropic";
import {
  Account,
  Contact,
  AccountResearchOutput,
  OutreachMessage,
} from "@shared/types. js";

const client = new Anthropic();

export class ClaudeService {
  /**
   * Analyze an account for comprehensive research insights
   */
  static async analyzeAccount(
    account: Account,
    contacts: Contact[]
  ): Promise<AccountResearchOutput> {
    if (!account || !account.companyName) {
      throw new Error("Invalid account data: account and companyName are required");
    }

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

    try {
      const message = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens:  2000,
        messages: [
          {
            role: "user",
            content:  `You are an expert B2B sales analyst.  Analyze this enterprise account and provide:
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

      if (!message.content || message.content.length === 0) {
        throw new Error("Claude API returned empty response");
      }

      const responseText =
        message.content[0]. type === "text" ? message.content[0].text : "";

      if (!responseText) {
        throw new Error("Claude API response did not contain text content");
      }

      try {
        const parsed = JSON.parse(responseText);
        return {
          accountId: account.id,
          ... parsed,
        };
      } catch (parseError) {
        console.warn("Failed to parse Claude response as JSON, using raw text:", parseError);
        return {
          accountId: account.id,
          summary: responseText,
          keyInsights:  [],
          painPoints: [],
          buyingIndicators: [],
          recommendedApproach: "",
          nextSteps: [],
        };
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Unknown error";
      const errorType = error?.type || error?.name || "APIError";

      console.error("Error analyzing account with Claude API:", {
        error: errorMessage,
        type: errorType,
        accountId: account.id,
        companyName: account.companyName,
      });

      // Re-throw with more context
      throw new Error(
        `Failed to analyze account "${account.companyName}": ${errorType} - ${errorMessage}`
      );
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
    if (!contact || !contact.firstName || !contact.lastName) {
      throw new Error("Invalid contact data: firstName and lastName are required");
    }

    if (!account || !account.companyName) {
      throw new Error("Invalid account data: companyName is required");
    }

    const validMessageTypes = ["email", "phone", "linkedin"];
    if (!validMessageTypes.includes(messageType)) {
      throw new Error(`Invalid message type: ${messageType}. Must be one of: ${validMessageTypes.join(", ")}`);
    }

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

      phone: `Draft a concise phone script (60-90 seconds) to call ${contact.firstName} ${contact. lastName}, ${contact.title} at ${account.companyName}.

Context:
${context}

Include:
- Opening hook (who you are, why you're calling)
- 1-2 sentence value proposition
- Questions to understand their situation
- Soft close asking for a brief meeting
- Handle potential objections

Format as a conversational script with stage directions.`,

      linkedin: `Draft a LinkedIn connection request message and follow-up to ${contact.firstName} ${contact. lastName}, ${contact.title} at ${account.companyName}.

Context:
${context}

Requirements:
- Connection request note (150 characters max)
- First message after connection (150-200 words)
- References to shared connections or mutual interests
- Value-first approach
- Call-to-action for brief conversation`,
    };

    try {
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

      if (!message.content || message.content.length === 0) {
        throw new Error("Claude API returned empty response");
      }

      const content =
        message.content[0]. type === "text" ? message. content[0].text : "";

      if (!content) {
        throw new Error("Claude API response did not contain text content");
      }

      return {
        id: `msg_${Date.now()}`,
        contactId: contact.id,
        messageType,
        content,
        sentiment: "professional",
        generatedAt: new Date(),
        customized: true,
      };
    } catch (error: any) {
      const errorMessage = error?.message || "Unknown error";
      const errorType = error?.type || error?.name || "APIError";

      console.error("Error generating outreach message with Claude API:", {
        error: errorMessage,
        type: errorType,
        contactId: contact.id,
        messageType,
      });

      // Re-throw with more context
      throw new Error(
        `Failed to generate ${messageType} message for ${contact.firstName} ${contact.lastName}: ${errorType} - ${errorMessage}`
      );
    }
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
    if (!transcript || transcript.trim().length === 0) {
      throw new Error("Invalid transcript: transcript cannot be empty");
    }

    try {
      const message = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens:  1500,
        messages:  [
          {
            role:  "user",
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

      if (!message.content || message.content.length === 0) {
        throw new Error("Claude API returned empty response");
      }

      const responseText =
        message.content[0].type === "text" ? message.content[0].text : "";

      if (!responseText) {
        throw new Error("Claude API response did not contain text content");
      }

      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.warn("Failed to parse Claude response as JSON, using raw text:", parseError);
        return {
          summary: responseText,
          actionItems: [],
          nextSteps: [],
          sentiment: "neutral",
        };
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Unknown error";
      const errorType = error?.type || error?.name || "APIError";

      console.error("Error processing meeting transcript with Claude API:", {
        error: errorMessage,
        type: errorType,
        transcriptLength: transcript.length,
      });

      // Re-throw with more context
      throw new Error(
        `Failed to process meeting transcript: ${errorType} - ${errorMessage}`
      );
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
    if (!account || !account.companyName) {
      throw new Error("Invalid account data: account and companyName are required");
    }

    if (!objectives || objectives.trim().length === 0) {
      throw new Error("Invalid objectives: objectives cannot be empty");
    }

    try {
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
- Location: ${account. location}

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

      if (!message.content || message.content.length === 0) {
        throw new Error("Claude API returned empty response");
      }

      const content = message.content[0].type === "text" ? message.content[0].text : "";

      if (!content) {
        throw new Error("Claude API response did not contain text content");
      }

      return content;
    } catch (error: any) {
      const errorMessage = error?.message || "Unknown error";
      const errorType = error?.type || error?.name || "APIError";

      console.error("Error creating account plan with Claude API:", {
        error: errorMessage,
        type: errorType,
        accountId: account.id,
        companyName: account.companyName,
      });

      // Re-throw with more context
      throw new Error(
        `Failed to create account plan for "${account.companyName}": ${errorType} - ${errorMessage}`
      );
    }
  }
}
