export const ApiDetailTemplate = {
  name: '',
  context: '',
  version: '',
  provider: 'apimanager',
  tiers: ['Default', 'Unlimited'],
  isDefaultVersion: false,
  thumbnailUri: '',
  wsdlUri: '',
  transport: ['http', 'https'],
  endpointConfig: {
    production_endpoints: {
      url: '',
      config: null,
      template_not_supported: false
    },
    sandbox_endpoints: {
      url: '',
      config: null,
      template_not_supported: false
    },
    endpoint_type: 'http'
  },
  visibility: 'PUBLIC',
  type: 'HTTP',
  apiLevelPolicy: null,
  authorizationHeader: null,
  maxTps: null,
  visibleRoles: [],
  visibleTenants: [],
  description: '',
  apiDefinition: '',
  status: 'CREATED',
  responseCaching: 'Disabled',
  cacheTimeout: 300,
  destinationStatsEnabled: 'ENDPOINT',
  endpointSecurity: null,
  tags: [],
  gatewayEnvironments: 'Production and Sandbox',
  labels: [],
  sequences: [],
  subscriptionAvailability: null,
  subscriptionAvailableTenants: [],
  additionalProperties: {},
  accessControl: 'NONE',
  accessControlRoles: [],
  businessInformation: {
    businessOwner: null,
    businessOwnerEmail: null,
    technicalOwner: '',
    technicalOwnerEmail: ''
  },
  corsConfiguration: {
    corsConfigurationEnabled: true,
    accessControlAllowOrigins: [
      '*'
    ],
    accessControlAllowCredentials: true,
    accessControlAllowHeaders: [
      'authorization',
      'Access-Control-Allow-Origin',
      'Content-Type',
    ],
    accessControlAllowMethods: ['OPTIONS', 'GET', 'POST', 'DELETE', 'PUT', 'PATCH']
  }
};
