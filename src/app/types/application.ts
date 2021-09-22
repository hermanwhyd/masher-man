export interface Application {
  applicationId: string;
  name: string;
  status: string;
  groupId?: string;
  throttlingTier?: string;
  subscriber?: string;
  description?: null;
}

export interface Subscription {
  tier: string;
  apiIdentifier: string;
  applicationId: string;
  subscriptionId?: string;
  status?: string;
}
