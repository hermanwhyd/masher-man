export const apiSpecificationExample = {
  openapi: '3.0.1',
  info: {
    title: 'Balance_API',
    description: 'Gives information on users account balance',
    version: 'v1'
  },
  servers: [
    {
      url: 'http://localhost:8080/balance/v1'
    }
  ],
  paths: {
    '/{msisdn}': {
      get: {
        summary: 'Get users balance',
        parameters: [
          {
            name: 'msisdn',
            in: 'path',
            description: 'msisdn to fetch',
            required: true,
            schema: {
              type: 'string'
            },
            example: 6285920558588
          },
          {
            name: 'ReqID',
            in: 'query',
            description: 'System Generated',
            schema: {
              type: 'string'
            },
            example: 20809
          },
          {
            name: 'type',
            in: 'query',
            description: 'default value=ALL',
            schema: {
              type: 'string'
            },
            example: 'ALL'
          }
        ],
        responses: {
          200: {
            description: 'PayloadQueryBalanceResp Response object',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/PayloadQueryBalanceResp'
                }
              },
              'application/json': {
                example: {
                  Header: {
                    ReqID: '20809',
                    IMEI: '3571250436519XXX'
                  },
                  PayloadQueryBalanceResp: {
                    QueryInformation: {
                      SubscriberBalances: {
                        CCMoney: {
                          UnitValue: {
                            ValueDigits: '1000',
                            Exponent: '0'
                          },
                          CurrencyCode: '360'
                        },
                        ActiveEndDate: '2020-12-31T00:00:00.000Z',
                        GraceEndDate: '2021-01-30T00:00:00.000Z',
                        BalanceType: '3'
                      },
                      HomePOCInformation: 'JK0',
                      PostpaidPrepaidInformation: '1',
                      SubscriberPricePlan: '513711184',
                      SubscriberID: '1234620113'
                    }
                  },
                  CommonResponse: {
                    ResponseCode: '00',
                    ErrorCode: '',
                    ErrorMessage: ''
                  }
                }
              }
            }
          }
        },
        'x-auth-type': 'Application & Application User',
        'x-throttling-tier': 'Unlimited'
      }
    }
  },
  components: {
    schemas: {
      PayloadQueryBalanceResp: {
        type: 'object',
        properties: {
          Header: {
            type: 'object',
            properties: {
              ReqID: {
                type: 'string'
              },
              IMEI: {
                type: 'string'
              }
            }
          },
          PayloadQueryBalanceResp: {
            type: 'object',
            properties: {
              QueryInformation: {
                type: 'object',
                properties: {
                  SubscriberBalances: {
                    type: 'object',
                    properties: {
                      CCMoney: {
                        type: 'object',
                        properties: {
                          UnitValue: {
                            type: 'object',
                            properties: {
                              ValueDigits: {
                                type: 'string'
                              },
                              Exponent: {
                                type: 'string'
                              }
                            }
                          },
                          CurrencyCode: {
                            type: 'string'
                          }
                        }
                      },
                      ActiveEndDate: {
                        type: 'string'
                      },
                      GraceEndDate: {
                        type: 'string'
                      },
                      BalanceType: {
                        type: 'string'
                      }
                    }
                  },
                  HomePOCInformation: {
                    type: 'string'
                  },
                  PostpaidPrepaidInformation: {
                    type: 'string'
                  },
                  SubscriberPricePlan: {
                    type: 'string'
                  },
                  SubscriberID: {
                    type: 'string'
                  }
                }
              }
            }
          },
          CommonResponse: {
            type: 'object',
            properties: {
              ResponseCode: {
                type: 'string'
              },
              ErrorCode: {
                type: 'string'
              },
              ErrorMessage: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  }
};
