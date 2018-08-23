# Outline

## Middleware

- Fetches EUR conversion hourly/yearly -- resets cache
- API:
  - '/api/currencies/:currencyCode' -- returns currency object with all conversions, adds result to cache
  - additionally, every return should include a marker indicating how long it will be valid for

## Extension

- On user request, converts the displayed currencies to the preferred base currency

### Content script

- Responsible for parsing the currencies on the page and reporting to the background script
- Updates the currency text on the page and/or adds a tooltip for each displayed currency

### Options

- Allows user to set/change base currency. Defaults to USD
- Possibly allows user to change the way converted currencies are displayed

### Background

- Determines the currency to be converted based on information provided by the content script
- Makes API call to middleware for new conversion rates for the preferred base currency
- Caches the result in chrome storage
- On request, fetches the conversion result from the cache (if it is valid) or the API
- Converts the currency from the page to the base and sends the results to content script

## Notes

- Messaging will need to be in place to communicate with content script, options, and background script. Background script should be the source of truth, all data should flow through it
- Will need to figure out the most performant way to convert all currencies on a page. It may make sense for the content script to parse the whole page and build an object with references to those elements which contain currency. The background script can respond with just the conversions or possibly strings of text/html to be added to the page
