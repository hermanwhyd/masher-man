export const ApiResourceTemplate = {
  get: {
    responses: {
      200: {
        description: 'Success response'
      }
    },
    'x-auth-type': 'Application & Application User',
    'x-throttling-tier': 'Unlimited'
  },
  post: {
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              payload: {
                type: 'string'
              }
            }
          }
        }
      },
      required: true,
      description: 'Request Body'
    },
    responses: {
      200: {
        description: 'Success response'
      }
    },
    'x-auth-type': 'Application & Application User',
    'x-throttling-tier': 'Unlimited'
  },
  put: {
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              payload: {
                type: 'string'
              }
            }
          }
        }
      },
      required: true,
      description: 'Request Body'
    },
    responses: {
      200: {
        description: 'Success response'
      }
    },
    'x-auth-type': 'Application & Application User',
    'x-throttling-tier': 'Unlimited'
  },
  delete: {
    responses: {
      200: {
        description: 'Success response'
      }
    },
    'x-auth-type': 'Application & Application User',
    'x-throttling-tier': 'Unlimited'
  },
  patch: {
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              payload: {
                type: 'string'
              }
            }
          }
        }
      },
      required: true,
      description: 'Request Body'
    },
    responses: {
      200: {
        description: 'Success response'
      }
    },
    'x-auth-type': 'Application & Application User',
    'x-throttling-tier': 'Unlimited'
  },
  options: {
    responses: {
      200: {
        description: 'Success response'
      }
    },
    'x-auth-type': 'Application & Application User',
    'x-throttling-tier': 'Unlimited'
  }
};
