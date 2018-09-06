const env = process.env.NODE_ENV;
const config = {
  dev: {
    mockApi: true,
    fixer: {
      baseUrl: 'http://data.fixer.io/api/latest',
    },
  },
  prod: {
    mockApi: false,
    fixer: {
      baseUrl: 'http://data.fixer.io/api/latest',
    },
  },
};

module.exports = config[env];
