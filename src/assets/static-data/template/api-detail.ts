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
  apiDefinition: JSON.stringify(
    {
      openapi: '3.0.0',
      paths: {
        '/*': {
          get: {
            responses: {
              200: {
                description: 'Success response'
              }
            },
            'x-auth-type': 'Application & Application User',
            'x-throttling-tier': 'Default'
          }
        }
      },
      info: {
        title: '',
        version: ''
      }
    }
  ),
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
    corsConfigurationEnabled: false,
    accessControlAllowOrigins: [
      '*'
    ],
    accessControlAllowCredentials: false,
    accessControlAllowHeaders: [
      'authorization',
      'Access-Control-Allow-Origin',
      'Content-Type',
    ],
    accessControlAllowMethods: ['OPTIONS', 'GET', 'POST', 'DELETE', 'PUT', 'PATCH']
  }
};
