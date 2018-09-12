const Globalize = require('globalize');
const cldr = require('cldr-data');

Globalize.load(
  require('cldr-data/supplemental/likelySubtags.json'),
  require('cldr-data/main/de/numbers.json'),
  require('cldr-data/supplemental/numberingSystems.json')
);

const deParser = Globalize('de').numberParser();
const num = deParser('1.000.000,3892038');
console.log(num);
console.log(
  Intl.NumberFormat('en', { currency: 'JPY', style: 'currency' }).format(num)
);
