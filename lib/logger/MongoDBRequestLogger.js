const oo = require('@carbon-io/carbon-core').atom.oo(module)

const RequestLogger = require('./RequestLogger')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')


/******************************************************************************
 * class MongoDBRequestLogger
 * extends RequestLogger
 */
const MongoDBRequestLogger = oo({
    _type: RequestLogger,

    _ctorName: 'MongoDBRequestLogger',
    _C: function() {

        /*****************************************************************************
         * @property {string} uri - The URI of the MongoDB server
         */
        this.uri = undefined

        /*****************************************************************************
         * @property {string} dbName - The name of the database to connect to
         */
        this.dbName = undefined

        /*****************************************************************************
         * @property {string} collectionName - The name of the collection in which to
         * log requests/responses
         */
        this.collectionName = undefined
    },

    _init: function() {
        RequestLogger.prototype._init.call(this)

        MongoClient.connect(this.uri, (err, client) => {
            assert.equal(null, err)

            this.db = client.db(this.dbName)
        })
    },

    /**********************************************************************
     * @inheritdoc
     */
    log: function(record) {
        if (!this.db)
            throw new Error('No database connection')

        this.db.collection(this.collectionName).insertOne(record, (err, result) => {
            assert.equal(null, err)
            assert.equal(1, result.insertedCount)
        })
    }
})

module.exports = MongoDBRequestLogger