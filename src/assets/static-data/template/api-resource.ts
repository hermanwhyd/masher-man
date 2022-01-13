export const ApiResourceTemplate = {
  get: {
    responses: {
      200: {
        description: 'Success response'
      }
    },
    'x-auth-type': 'Application & Application User',
    'x-throttling-tier': 'Default'
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
    'x-throttling-tier': 'Default'
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
    'x-throttling-tier': 'Default'
  },
  delete: {
    responses: {
      200: {
        description: 'Success response'
      }
    },
    'x-auth-type': 'Application & Application User',
    'x-throttling-tier': 'Default'
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
    'x-throttling-tier': 'Default'
  },
  options: {
    responses: {
      200: {
        description: 'Success response'
      }
    },
    'x-auth-type': 'Application & Application User',
    'x-throttling-tier': 'Default'
  }
};
