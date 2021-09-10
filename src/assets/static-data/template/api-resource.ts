export const ApiResourceTemplate = {
  get: {
    responses: {
      200: {
        description: 'Successful operation'
      }
    }
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
        description: 'Successful operation'
      }
    }
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
        description: 'Successful operation'
      }
    }
  },
  delete: {
    responses: {
      200: {
        description: 'Successful operation'
      }
    }
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
        description: 'Successful operation'
      }
    }
  },
  options: {
    responses: {
      200: {
        description: 'Successful operation'
      }
    }
  }
}
