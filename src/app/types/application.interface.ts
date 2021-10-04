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

export interface Consumer {
  consumerKey: string;
  consumerSecret: string;
}

export interface Key extends Consumer {
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

export interface GenerateKey {
  validityTime: string;
  keyType: string;
  accessAllowDomains: string[];
  scopes: string[];
  supportedGrantTypes: string[];
}
