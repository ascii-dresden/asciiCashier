module.exports = {
  client: {
    service: {
      name: 'ascii-pay-server',
      url: 'http://secure-pay.ascii.local/api/v1/graphql',
      headers: {
        'user-agent': 'JS GraphQL',
      },
    },
    includes: ['src/graphql.ts'],
  },
};
