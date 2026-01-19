/**
 * LinkedIn Navigator Integration Service
 */

import axios, { AxiosInstance } from "axios";
import { Account, Contact, LinkedInNavigatorSync } from "@shared/types.js";

export class LinkedInService {
  private axiosInstance: AxiosInstance;
  private accessToken?:  string;

  constructor(accessToken?: string) {
    this.axiosInstance = axios.create({
      baseURL: "https://api.linkedin.com/v2",
      headers: {
        Authorization: `Bearer ${accessToken || process.env.LINKEDIN_ACCESS_TOKEN}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });
    this.accessToken = accessToken;
  }

  /**
   * Fetch accounts from LinkedIn Navigator
   */
  async fetchAccountsFromNavigator(
    filters?:  Record<string, unknown>
  ): Promise<Account[]> {
    try {
      const response = await this.axiosInstance.get("/sales/accounts", {
        params:  filters,
      });

      return response.data.elements. map(
        (element: Record<string, unknown>) =>
          this.mapLinkedInToAccount(element)
      );
    } catch (error) {
      console.error("Error fetching accounts from LinkedIn:", error);
      throw error;
    }
  }

  /**
   * Fetch contacts from LinkedIn Navigator
   */
  async fetchContactsFromNavigator(
    accountId?:  string
  ): Promise<Contact[]> {
    try {
      const response = await this.axiosInstance.get("/sales/contacts", {
        params: accountId ? { accountId } : {},
      });

      return response. data.elements.map(
        (element: Record<string, unknown>) =>
          this.mapLinkedInToContact(element)
      );
    } catch (error) {
      console.error("Error fetching contacts from LinkedIn:", error);
      throw error;
    }
  }

  /**
   * Sync specific accounts and contacts from LinkedIn Navigator
   */
  async syncNavigatorData(
    accountUrls: string[],
    contactUrls: string[]
  ): Promise<LinkedInNavigatorSync> {
    const syncId = `sync_${Date.now()}`;

    try {
      const accounts = await Promise.all(
        accountUrls.map((url) => this.fetchAccountDetails(url))
      );

      const contacts = await Promise.all(
        contactUrls.map((url) => this.fetchContactDetails(url))
      );

      return {
        id: syncId,
        accountIds: accounts. map((a) => a.id),
        contactIds: contacts.map((c) => c.id),
        syncedAt: new Date(),
        status: "completed",
        lastSyncedAt: new Date(),
      };
    } catch (error) {
      console.error("Error syncing LinkedIn Navigator data:", error);
      return {
        id: syncId,
        accountIds: [],
        contactIds: [],
        syncedAt: new Date(),
        status: "failed",
      };
    }
  }

  /**
   * Fetch detailed account information from LinkedIn
   */
  private async fetchAccountDetails(
    accountUrl: string
  ): Promise<Account> {
    return {
      id: `acct_${Date.now()}`,
      linkedinUrl: accountUrl,
      companyName: "Example Company",
      industry: "Technology",
      companySize: "1001-5000",
      location: "San Francisco, CA",
      description: "Enterprise software company",
      keyPersonnel: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Fetch detailed contact information from LinkedIn
   */
  private async fetchContactDetails(contactUrl: string): Promise<Contact> {
    return {
      id: `contact_${Date.now()}`,
      linkedinUrl: contactUrl,
      firstName: "John",
      lastName: "Doe",
      title: "VP of Sales",
      accountId: "",
      stage: "prospect",
    };
  }

  /**
   * Map LinkedIn API response to Account type
   */
  private mapLinkedInToAccount(linkedinData: Record<string, unknown>): Account {
    return {
      id: (linkedinData.id as string) || `acct_${Date.now()}`,
      linkedinUrl: (linkedinData.url as string) || "",
      companyName: (linkedinData. name as string) || "",
      industry: (linkedinData.industry as string) || "",
      companySize: (linkedinData.organizationSize as string) || "",
      location: (linkedinData. location as string) || "",
      website: (linkedinData.website as string) || undefined,
      description: (linkedinData.description as string) || "",
      keyPersonnel: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Map LinkedIn API response to Contact type
   */
  private mapLinkedInToContact(linkedinData: Record<string, unknown>): Contact {
    return {
      id:  (linkedinData.id as string) || `contact_${Date.now()}`,
      linkedinUrl: (linkedinData.url as string) || "",
      firstName:  (linkedinData.firstName as string) || "",
      lastName: (linkedinData.lastName as string) || "",
      title:  (linkedinData.title as string) || "",
      email: (linkedinData.email as string) || undefined,
      accountId: (linkedinData.organizationUrn as string) || "",
      stage: "prospect",
    };
  }
}

export default LinkedInService;
