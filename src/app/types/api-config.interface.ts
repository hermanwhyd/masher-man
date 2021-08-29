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
  applications?: Application[];
}

export interface Profile {
  active: boolean;
  name: string;
  portalUrl: string;
}

export interface Application {
  active: boolean;
  id: string;
  name: string;
}

export interface Session {
  token: string;
  scope: 'apim:api_view' | 'apim:api_create';
}
