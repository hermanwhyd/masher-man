export interface BusinessInformation {
  businessOwner?: any;
  businessOwnerEmail?: any;
  technicalOwner?: any;
  technicalOwnerEmail?: any;
}

export interface CorsConfiguration {
  corsConfigurationEnabled?: boolean;
  accessControlAllowOrigins?: string[];
  accessControlAllowCredentials?: boolean;
  accessControlAllowHeaders?: string[];
  accessControlAllowMethods?: string[];
}

export interface Api {
  id?: string;
  name: string;
  description?: string;
  context: string;
  version: string;
  provider: string;
  status: string;
  thumbnailUri?: any;
}

export interface ApiDetail extends Api {
  apiDefinition?: any;
  wsdlUri?: any;
  responseCaching?: string;
  cacheTimeout?: number;
  destinationStatsEnabled?: any;
  isDefaultVersion?: boolean;
  type: string;
  transport: string[];
  tags?: any[];
  tiers?: string[];
  apiLevelPolicy?: any;
  authorizationHeader?: any;
  maxTps?: any;
  visibility?: string;
  visibleRoles?: any[];
  visibleTenants?: any[];
  endpointConfig?: any | EndPointConfig;
  endpointImplementationType?: string;
  endpointSecurity?: any;
  gatewayEnvironments?: string;
  labels?: any[];
  sequences?: any[];
  subscriptionAvailability?: any;
  subscriptionAvailableTenants?: any[];
  additionalProperties?: any;
  accessControl?: string;
  accessControlRoles?: any[];
  businessInformation?: BusinessInformation;
  corsConfiguration?: CorsConfiguration;
}

export interface EnvEndpoints {
  url: string;
  config?: any;
  template_not_supported: boolean;
}

export interface EndPointConfig {
  production_endpoints: EnvEndpoints;
  sandbox_endpoints: EnvEndpoints;
  endpoint_type: string;
}
