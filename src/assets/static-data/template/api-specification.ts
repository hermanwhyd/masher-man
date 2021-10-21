export const apiSpecificationExample = {
  openapi: '3.0.0',
  paths: {
    '/*': {
      post: {
        tags: [
          'api-controller-v-2'
        ],
        summary: 'sendOTP',
        operationId: 'sendOTPUsingPOST_1',
        parameters: [
          {
            name: 'ax-request-id',
            in: 'header',
            description: 'ax-request-id',
            required: false,
            schema: {
              type: 'string'
            }
          },
          {
            name: 'channel',
            in: 'header',
            description: 'channel',
            required: true,
            schema: {
              type: 'string',
              default: 'NONE'
            }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [
                  'msisdn',
                  'transport'
                ],
                properties: {
                  length: {
                    type: 'integer',
                    format: 'int32'
                  },
                  useLetter: {
                    type: 'boolean'
                  },
                  useNumber: {
                    type: 'boolean'
                  },
                  allCapital: {
                    type: 'boolean'
                  },
                  transport: {
                    type: 'string',
                    enum: [
                      'SMS',
                      'EMAIL'
                    ]
                  },
                  validityInSecond: {
                    type: 'integer',
                    format: 'int32'
                  },
                  msisdn: {
                    type: 'string'
                  }
                },
                title: 'SendOTPRq'
              }
            }
          },
          description: 'sendOTPRq',
          required: true
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  type: 'object',
                  required: [
                    'esbuuid',
                    'msisdn',
                    'reason',
                    'validity'
                  ],
                  properties: {
                    esbuuid: {
                      type: 'string'
                    },
                    msisdn: {
                      type: 'string'
                    },
                    reason: {
                      type: 'string'
                    },
                    validity: {
                      type: 'integer',
                      format: 'int32'
                    }
                  },
                  title: 'SendOTPRs'
                }
              }
            }
          },
          201: {
            description: 'Created'
          },
          401: {
            description: 'Unauthorized'
          },
          403: {
            description: 'Forbidden'
          },
          404: {
            description: 'Not Found'
          }
        },
        'x-auth-type': 'Application & Application User',
        'x-throttling-tier': 'Unlimited'
      }
    }
  }
};
