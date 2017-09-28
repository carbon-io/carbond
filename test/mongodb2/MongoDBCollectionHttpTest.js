var _ = require('lodash')
var leafnode = require('@carbon-io/leafnode')
var oo = require('@carbon-io/atom').oo(module)

var ServiceTest = require('../..').test.ServiceTest

var getObjectId = require('../fixtures/pong').util.getObjectId

/***************************************************************************************************
 *
 */
var MongoDBCollectionHttpTest = oo({

  /*****************************************************************************
   *
   */
  _type: ServiceTest,

  /*****************************************************************************
   *
   */
  _C: function() {
    this.fixture = {}
  },

  /*****************************************************************************
   *
   */
  setup: function() {
    ServiceTest.prototype.setup.apply(this, arguments)
    this.populateDb()
  },

  /*****************************************************************************
   *
   */
  teardown: function() {
    this.dropDb()
    ServiceTest.prototype.teardown.apply(this, arguments)
  },

  /*****************************************************************************
   *
   */
  db: {
    $property: {
      get: function() {
        return this.service.db
      }
    }
  },

  /*****************************************************************************
   *
   */
  dropDb: function() {
    this.db._nativeDB.sync.dropDatabase()
  },

  /*****************************************************************************
   *
   */
  populateDb: function(fixture) {
    var db = this.service.db
    var col = undefined
    // XXX
    this.dropDb()
    fixture = _.isNil(fixture) ? this.fixture : fixture
    for(var colName in fixture) {
      var id = 0
      col = db.getCollection(colName)
      for (var i = 0; i < fixture[colName].length; i++) {
        col.insert(
          _.assignIn(
            _.clone(fixture[colName][i]),
            {_id: getObjectId(id++)}))
      }
    }
  }
})

module.exports = MongoDBCollectionHttpTest
