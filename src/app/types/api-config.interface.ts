export interface ApiConfig {
  active: boolean;
  alias: string;
  userPublishers?: User[];
  userStores?: User[];
  userApiManagers?: User[];
}

export interface User {
  username: string;
  password: string;
  clientDigest: string;
}

export interface Profile {
  active: boolean;
  name: string;
  portalUrl: string;
}
