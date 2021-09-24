export interface Application {
  applicationId: string;
  name: string;
  status: string;
  groupId?: string;
  throttlingTier?: string;
  subscriber?: string;
  description?: null;
  keys?: Key[];
}

export interface Key {
  consumerKey: string;
  consumerSecret: string;
  keyState: string;
  keyType: string;
  supportedGrantTypes: null;
  token: Token;
}

export interface Token {
  validityTime: number;
  accessToken: string;
  tokenScopes: string[];
}
