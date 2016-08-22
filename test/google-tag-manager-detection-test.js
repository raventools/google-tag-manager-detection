/* jshint undef: true, unused: true */
/* globals describe, it */

'use strict'

var path = require('path')
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
var nock = require('nock')

chai.use(chaiAsPromised)
chai.should()

var expect = chai.expect

var gtmd = require('./../lib/google-tag-manager-detection')

describe('Google Tag Manager Detection', function () {
  it('should return object for checkUrlForGaViaGtm on https://raventools.com', function (done) {
    nock('https://raventools.com').get('/').replyWithFile(200, path.join(__dirname, '/fixtures/raventools.com.html'))
    nock('https://www.googletagmanager.com').get('/gtm.js?id=GTM-KZBC78').replyWithFile(200, path.join(__dirname, '/fixtures/GTM-KZBC78.js'))
    gtmd.checkUrlForGaViaGtm('https://raventools.com/', function (result) {
      expect(result.has_ga).to.be.equal(true)
      expect(result.has_gtm).to.be.equal(true)
      expect(result.gtm_id).to.be.equal('GTM-KZBC78')
      expect(result.ga_property_id).to.be.equal('UA-88442-68')
      done()
    })
  })

  it('should return false for checkUrlForGaViaGtm on https://example.com', function (done) {
    nock('https://example.com').get('/').reply(200, '<h1>Example.com</h1>')
    gtmd.checkUrlForGaViaGtm('https://example.com/', function (result) {
      expect(result).to.be.equal(false)
      done()
    })
  })

  it('should return GTM-KZBC78 for checkUrlForGtm on https://raventools.com', function (done) {
    nock('https://raventools.com').get('/').replyWithFile(200, path.join(__dirname, '/fixtures/raventools.com.html'))
    nock('https://www.googletagmanager.com').get('/gtm.js?id=GTM-KZBC78').replyWithFile(200, path.join(__dirname, '/fixtures/GTM-KZBC78.js'))
    gtmd.checkUrlForGtm('https://raventools.com/', function (result) {
      expect(result).to.be.equal('GTM-KZBC78')
      done()
    })
  })

  it('should return false for checkUrlForGtm on https://example.com', function (done) {
    nock('https://example.com').get('/').reply(200, '<h1>Example.com</h1>')
    gtmd.checkUrlForGtm('https://example.com/', function (result) {
      expect(result).to.be.equal(false)
      done()
    })
  })

  it('should return object for checkGtmForGa on GTM-KZBC78', function (done) {
    nock('https://www.googletagmanager.com').get('/gtm.js?id=GTM-KZBC78').replyWithFile(200, path.join(__dirname, '/fixtures/GTM-KZBC78.js'))
    gtmd.checkGtmForGa('GTM-KZBC78', function (result) {
      expect(result.has_ga).to.be.equal(true)
      expect(result.has_gtm).to.be.equal(true)
      expect(result.gtm_id).to.be.equal('GTM-KZBC78')
      expect(result.ga_property_id).to.be.equal('UA-88442-68')
      done()
    })
  })

  it('should return 404 for checkGtmForGa on GTM-FOOBAR', function (done) {
    nock('https://www.googletagmanager.com').get('/gtm.js?id=GTM-FOOBAR').reply(404, '<h1>Not Found</h1>')
    gtmd.checkGtmForGa('GTM-FOOBAR', function (result) {
      result.error.should.be.equal('HTTP/1.0 404')
      done()
    })
  })
})
