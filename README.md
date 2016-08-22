## Google Tag Manager Detection

*Problem:* Google Analytics was once easy enough to detect on a page. You would search the page contents for `ga.js` or `analytics.js` (depending on the version) and go from there. Now that [Google Tag Manager]()https://www.google.com/analytics/tag-manager/ is gaining traction, we need a new approach to determining if pages have Google Analytics properly installed.

*Solution:* This package does a few things:

- Asserts whether a URL has an instance of Google Tag Manager (GTM) on the page
- Returns the GTM ID for a page (makes the assumption of one per page)
- Given a GTM ID, assert whether the tag has Google Analytics loaded within it
- Returns the property ID associated with the GTM instance

## Installation

The following will add it to your project's `package.json` file.

```
npm install google-tag-manager-detection --save
```

## Demo

```bash
$ git clone https://github.com/raventools/google-tag-manager-detection.git
$ cd google-tag-manager-detection
$ npm install
$ npm run-script demo https://raventools.com
```

## Methods

```js
var gtmd = require('google-tag-manager-detection')

// Detect Google Analytics for a given page with GTM (does everything)
gtmd.checkUrlForGaViaGtm('http://example.com/', function (result) {
  // `result` will be an object:
  //
  //   { has_ga: true,
  //   has_gtm: true,
  //   gtm_id: 'GTM-KZBC78',
  //   ga_property_id: 'UA-88442-68',
  //   error: null }
  //
  // or `false`.
});

// Get the Google Tag Manager ID for a given page
gtmd.checkUrlForGtm('http://example.com/', function (result) {
  // `result` will be a string:
  //
  //   GTM-KZBC78
  //
  // or `false` 
});

// Inspect the GTM instance for GA code
gtmd.checkGtmForGa('http://example.com/', function (result) {
  // `result` will be an object:
  //
  //   { has_ga: true,
  //   has_gtm: true,
  //   gtm_id: 'GTM-KZBC78',
  //   ga_property_id: 'UA-88442-68',
  //   error: null }
  //
  // or `false`.
});
```
