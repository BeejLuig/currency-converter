const express = require('express');
const currencyCodes = require('./currency-codes.json');
const config = require('../config');
const { ONE_HOUR } = require('../utils/constants');

const app = express();
let cache = {};

const getFetchBaseConversions = async config => {
  const { mockApi } = config;

  if (mockApi) {
    const mockBody = require('../config/mock-response.json');
    return mockBody;
  } else {
    const axios = require('axios');
    const fixerKey = process.env.FIXER_KEY;
    const { baseUrl } = config.fixer;
    return axios.get(`${baseUrl}?access_key=${fixerKey}`);
  }
};
const fetchBaseConversions = async () => {
  const expiration = Date.now() + ONE_HOUR;
  const baseConversions = await getFetchBaseConversions(config);
  const normalizedConversions = normalizeConversions(baseConversions);
  const baseCurrency = mapToCurrencyCodes(normalizedConversions);
  cache = {
    expiration,
    [baseCurrency.code]: baseCurrency,
  };
};

const invertConversionRate = rate => 1 / rate;

const normalizeConversions = currency => ({
  code: currency.base,
  convertTo: currency.rates,
});

const mapToCurrencyCodes = currency => ({
  ...currency,
  ...currencyCodes[currency.code],
});

const init = () => {
  fetchBaseConversions();
  setInterval(fetchBaseConversions, ONE_HOUR);
};

app.all('*', (req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.get('/api/currencies/code/:currencyCode', async (req, res) => {
  const { currencyCode } = req.params;
  const code = currencyCode.toUpperCase();

  if (code in cache) {
    return res.send({
      expiration: cache.expiration,
      currency: cache[code],
    });
  }

  if (code in cache.EUR.convertTo) {
    const convertedCurrency = {
      code,
      convertTo: Object.keys(cache.EUR.convertTo).reduce(
        (obj, code) => ({
          ...obj,
          [code]: invertConversionRate(cache.EUR.convertTo[code]),
        }),
        {}
      ),
    };
    const mappedCurrency = mapToCurrencyCodes(convertedCurrency);
    cache[code] = mappedCurrency;
    return res.send({
      expiration: cache.expiration,
      currency: cache[code],
    });
  }

  res.status(400).send('Not found');
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

init();
