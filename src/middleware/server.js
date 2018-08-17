const express = require('express');
const currencyCodes = require('./currency-codes.json');
const config = require('../config');

const app = express();
let cache = {};

const setResponse = config => {
  const { mockApi } = config;

  if (mockApi) {
    const axios = require('axios');
    const fixerKey = process.env.FIXER_KEY;
    const { baseUrl } = config.fixer;
    return axios.get(`${baseUrl}?access_key=${fixerKey}`);
  } else {
    const mockBody = require('./mock/mock-response.json');
    return mockBody;
  }
}


const calculateConversion = (base, currency) =>
  (1 / base) * (currency);

const normalizeConversions = rates =>
  Object.keys(rates)
    .reduce((obj, base) => ({
      ...obj,
      [base]: {
        currency: base,
        convertTo: (
          Object.keys(rates)
            .reduce((rate, currency) => ({
              ...rate,
              [currency]: calculateConversion(rates[base], rates[currency])
            }), {})
        )
      }
    }), {})

const mapToCurrencyCodes = conversions =>
  Object.keys(conversions)
    .reduce((obj, currency) => ({
      ...obj,
      [currency]: {
        ...conversions[currency],
        ...currencyCodes[currency]
      }
    }), {});

const mapToCurrencyNames = conversions =>
    Object.keys(currencyCodes)
      .reduce((obj, currency) => ({
        ...obj,
        [currencyCodes[currency].name.split(' ').join('-').toLowerCase()]: {
          ...conversions[currency],
          ...currencyCodes[currency]
        }
      }), {});

app.all((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.get('/api/currencies', async (req, res) => {
  if (!cache.currenciesByCode) {
    let response = await setResponse(config);
    let conversions = normalizeConversions(response.rates);
    let currenciesByCode = mapToCurrencyCodes(conversions);
    cache = { ...cache, currenciesByCode };
  }
  res.send(cache.currenciesByCode);
});

app.get('/api/currencies/code/:currencyCode', async (req, res) => {
  const { currencyCode } = req.params;

  if (!cache.currenciesByCode) {
    let response = await setResponse(config);
    let conversions = normalizeConversions(response.rates);
    let currenciesByCode = mapToCurrencyCodes(conversions);
    cache = { ...cache, currenciesByCode };
  }

  if (currencyCode in cache.currenciesByCode) {
    res.send(cache.currenciesByCode[currencyCode]);
  } else {
    res.status(400).send('No currency found');
  }
});

app.get('/api/currencies/name/:name', async (req, res) => {
  const { name } = req.params;

  if (!cache.currenciesByName) {
    let response = await setResponse(config);
    let conversions = normalizeConversions(response.rates);
    let currenciesByName = mapToCurrencyNames(conversions);
    cache = { ...cache, currenciesByName };
  }
  if (name in cache.currenciesByName) {
    res.send(cache.currenciesByName[name]);
  } else {
    res.status(400).send('No currency found');
  }
});

app.get('/api/currencies/convert/:from-:to', () => {
  // TODO
});

app.listen(3000, () => console.log('Listening on port 3000'));