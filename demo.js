'use strict'

var _ = require('lodash')
var gtmd = require('./lib/google-tag-manager-detection')

/**
 * Usage:
 *   node main.js https://raventools.com
 */

// Command line testing
var args = process.argv
if (_.isArray(args) && args[2]) {
  // Grab third parameter from arguments
  var pageUrl = args[2]

  // Demos
  gtmd.checkUrlForGaViaGtm(pageUrl, function (result) {
    console.log('-----------------------------------------------')
    console.log('[Demo] Do both the parse and lookup together.')
    console.log(result)
  })
  gtmd.checkUrlForGtm(pageUrl, function (result) {
    console.log('------------------------------------------')
    console.log('[Demo] Check the page for a GTM instance')
    console.log('GTM ID', result)
  })
  gtmd.checkGtmForGa('GTM-KZBC78xxx', function (result) {
    console.log('-------------------------------------------------')
    console.log('[Demo] Take a known GTM instance and inspect it')
    console.log(result)
  })
} else {
  // Catch usage issue.
  console.log('You did not specify a URL to check.')
}
