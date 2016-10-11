var assert = require('assert')
var fs = require('fs')
var path = require('path')

var o  = require('atom').o(module).main
var oo  = require('atom').oo(module)
var _o = require('bond')._o(module)
var __ = require('@carbon-io/fibers').__(module)
var testtube = require('test-tube')
var assert = require('assert')
var ObjectId = require('ejson').types.ObjectId
var carbond = require('..')

/**
 * qs: serializeJsonParams(options.params),
 * body: body,
 * json: options.json,
 * headers: options.headers,
 * strictSSL: options.strictSSL,
 * cert: options.cert,
 * key: options.key,
 * ca: options.ca,
 * forever: options.forever
 */

ALICE_CERT = path.resolve(__dirname, 'data/ssl/certs/client.cert.pem')
ALICE_KEY = path.resolve(__dirname, 'data/ssl/keys/client_np.key.pem')
CARL_CERT = path.resolve(__dirname, 'data/ssl/certs/carl.cert.pem')
CARL_KEY = path.resolve(__dirname, 'data/ssl/keys/carl_np.key.pem')
SERVER_CERT = path.resolve(__dirname, 'data/ssl/certs/server.cert.pem')
SERVER_KEY = path.resolve(__dirname, 'data/ssl/keys/server_np.key.pem')
INTERMEDIATE_CA_CERT = path.resolve(__dirname, 'data/ssl/ca/intermediate-ca.cert.pem')
ROOT_CA_CERT = path.resolve(__dirname, 'data/ssl/ca/root-ca.cert.pem')

/**************************************************************************
 * SslTests
 */
module.exports = o({
  /**********************************************************************
   * _type
   */
  _type: testtube.Test,

  /**********************************************************************
   * name
   */
  name: "SslTests",

  /**********************************************************************
   * tests
   */
  tests: [
    o({
      _type: carbond.test.ServiceTest,
      name: "SslClientRequestCertTests",
      service: o({
        _type: carbond.Service,

        port: 8888,
        verbosity: 'debug',
        apiRoot: '/api',
        sslOptions: {
          serverCertPath: SERVER_CERT,
          serverKeyPath: SERVER_KEY,
          trustedCertsPaths: [
            INTERMEDIATE_CA_CERT,
            ROOT_CA_CERT
          ],
          requestCert: true
        },

        endpoints: {
          foo: o({
            _type: carbond.Endpoint,
            get: function (req, res) {
              return 'bar'
            }
          }),
        }
      }),
      tests: [
        {
          reqSpec: {
            url: '/api/foo',
            method: "GET",
            options: {
              strictSSL: true,
              cert: fs.readFileSync(ALICE_CERT),
              key: fs.readFileSync(ALICE_KEY),
              ca: [
                fs.readFileSync(INTERMEDIATE_CA_CERT),
                fs.readFileSync(ROOT_CA_CERT)
              ]
            }
          },
          resSpec: {
            statusCode: 200,
            body: 'bar'
          }
        },
        o({
          _type: testtube.Test,
          name: 'Test handling of unauthorized connections',
          description: 'Test handling of unauthorized connections (issue #107)',
          doTest: function() {
            var self = this
            // should probably spy on log property
            assert.throws(function() {
              // test no client cert
              var req = _o(self.parent.baseUrl + '/api/foo', {
                strictSSL: true,
                ca: [
                  fs.readFileSync(INTERMEDIATE_CA_CERT),
                  fs.readFileSync(ROOT_CA_CERT)
                ]
              })
              req.get()
            }, /socket hang up/)
            assert.throws(function() {
              // test self signed client cert
              var req = _o(self.parent.baseUrl + '/api/foo', {
                strictSSL: true,
                cert: fs.readFileSync(CARL_CERT),
                key: fs.readFileSync(CARL_KEY),
                ca: [
                  fs.readFileSync(INTERMEDIATE_CA_CERT),
                  fs.readFileSync(ROOT_CA_CERT)
                ]
              })
              req.get()
            }, /socket hang up/)
          }
        }),
      ]
    })
  ]
})

