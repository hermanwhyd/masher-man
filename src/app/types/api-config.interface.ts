export interface Account {
  active: boolean;
  profile: string;
  userPublishers?: User[];
  userStores?: User[];
  userApiManagers?: User[];
}

export interface User {
  active: boolean;
  username: string;
  password: string;
  grantTypes: string;
  clientDigest: string;
  sessions?: Session[];
}

export interface Profile {
  active: boolean;
  name: string;
  portalUrl: string;
}

export interface Session {
  token: string;
  scope: 'apim:api_view' | 'apim:api_create';
}
