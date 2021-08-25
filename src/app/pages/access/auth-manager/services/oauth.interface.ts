export interface RegisterRq {
  callbackUrl: string;
  clientName: string;
  owner: string;
  grantType: string;
  saasApp: boolean;
}

export interface RegisterRs {
  clientId: string;
  clientName: string;
  callBackURL?: any;
  clientSecret: string;
  jsonString: string;
  isSaasApplication?: boolean;
  appOwner: string;
  tokenType?: any;
}

export interface LoginRq {
  grant_type: string;
  username: string;
  password: string;
  scope: string;
}

export interface LoginRs {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
}
