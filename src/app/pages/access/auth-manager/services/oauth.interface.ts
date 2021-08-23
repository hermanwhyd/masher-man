export interface LoginRq {
  callbackUrl: string;
  clientName: string;
  owner: string;
  grantType: string;
  saasApp: boolean;
}

export interface LoginRs {
  clientId: string;
  clientName: string;
  callBackURL?: any;
  clientSecret: string;
  isSaasApplication: boolean;
  appOwner: string;
  tokenType?: any;
}

export interface RegisterRq {
  grant_type: string;
  username: string;
  password: string;
  scope: string;
}

export interface RegisterRs {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
}
