var request = require('request')
var _ = require('lodash')
var cheerio = require('cheerio')
var url = require('url')

exports = {
  /**
   * Check Google Tag Manager for GA
   *
   * @param string gtmId
   * @param function callback
   */
  checkGtmForGa: function (gtmId, callback) {
    var self = this

    if (!gtmId) {
      if (_.isFunction(callback)) {
        return callback(false)
      } else {
        return false
      }
    }

    request('https://www.googletagmanager.com/gtm.js?id=' + gtmId, function (err, resp, body) {
      var output = {}
      // Handle error
      if (err) {
        return self.handleHttpError(err, callback)
      }
      // Handle bad status
      if (resp.statusCode !== 200) {
        return self.handleHttpError('HTTP/1.0 ' + resp.statusCode, callback)
      }
      // We're parsing this as plain text. Search for relevant pieces of data
      var objectSearchPattern = /GoogleAnalyticsObject/
      var objectMatch = objectSearchPattern.exec(body)
      // We only want to bother if we can see there is a GoogleAnalyticsObject
      if (!_.isNull(objectMatch)) {
        var gaPropertyIdentiferPattern = /(UA-[0-9]+-[0-9]+)/i
        var gaPropertyIdentifierMatch = gaPropertyIdentiferPattern.exec(body)
        if (!_.isNull(gaPropertyIdentifierMatch)) {
          output = {
            has_ga: true,
            has_gtm: true,
            gtm_id: gtmId,
            ga_property_id: gaPropertyIdentifierMatch[0],
            error: null
          }
        } else {
          output = {
            has_ga: false,
            has_gtm: true,
            gtm_id: gtmId,
            ga_property_id: null,
            error: 'Has GoogleAnalyticsObject in tag, but could not find property identifier.'
          }
        }
      } else {
        output = {
          has_ga: false,
          has_gtm: true,
          gtm_id: gtmId,
          ga_property_id: null,
          error: 'Could not find GoogleAnalyticsObject in this tag.'
        }
      }
      if (_.isFunction(callback)) {
        return callback(output)
      } else {
        return output
      }
    })
  },

  /**
   * Check URL for GTM
   *
   * @param string pageUrl
   * @param function callback
   * @return array
   */
  checkUrlForGtm: function (pageUrl, callback) {
    var self = this
    request(pageUrl, function (err, resp, body) {
      // Handle error
      if (err) {
        return self.handleHttpError(err, callback)
      }
      // Handle bad status
      if (resp.statusCode !== 200) {
        return self.handleHttpError('HTTP/1.0 ' + resp.statusCode, callback)
      }
      // Load the body into a parsed version
      var $ = cheerio.load(body)
      // Search for the Google Tag Manager link
      var links = $('iframe[src*="googletagmanager.com"]')
      var count = links.length

      // If not found, return
      if (!count) {
        if (_.isFunction(callback)) {
          return callback(false)
        }
        return false
      }

      // Loop through the matching versions (if any)
      $(links).each(function (i, link) {
        var found = link.attribs.src
        // Get the tag manager ID from the given SRC
        // e.g. //www.googletagmanager.com/ns.html?id=GTM-KZBC78
        var gtmId = url.parse(found, true).query.id

        // Only care about the first instance
        if (_.isFunction(callback)) {
          return callback(gtmId)
        }
        return gtmId
      })
    })
  },

  /**
   * Check URL for GA via GTM
   *
   * @param string pageUrl
   * @param function callback
   */
  checkUrlForGaViaGtm: function (pageUrl, callback) {
    var self = this
    self.checkUrlForGtm(pageUrl, function (gtmId) {
      self.checkGtmForGa(gtmId, function (result) {
        // We are only checking the first instance
        if (_.isFunction(callback)) {
          return callback(result)
        } else {
          return result
        }
      })
    })
  },

  /**
   * Handle HTTP Error
   *
   * @param error err
   * @param function callback
   */
  handleHttpError: function (err, callback) {
    if (typeof err === 'object') {
      err = err.toString()
    }
    callback({
      has_ga: false,
      has_gtm: false,
      gtm_id: null,
      ga_property_id: null,
      error: err
    })
  }
}

module.exports = exports
