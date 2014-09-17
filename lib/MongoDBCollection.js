var o = require('maker').o(module);
var oo = require('maker').oo(module);
var _o = require('maker')._o(module);

/******************************************************************************
 * @class MongoDBCollection
 */
module.exports = oo({

    /**********************************************************************
     * _type
     */
    _type: "./Endpoint", 

    /**********************************************************************
     * mongodbURI
     */
    mongodbURI: null,

    /**********************************************************************
     * _db
     */
    _db : { 
        "$property" : { 
            get: function() {
                return this._getdb(this.mongodbURI) || this._objectserver._db
            }
        }
    },

    /**********************************************************************
     * collection
     */
    collection: null,

    /**********************************************************************
     * uriPattern
     *
     * URI pattern (e.g.: "/widgets/:id?")
     */        
    uriPattern: ":id?",
    
    /**********************************************************************
     * get
     */        
    get: function(req, res) {
        var result

        var id = req.params.id
        if (id) {
            result = this._handleObjectGet(id, req.query)
        } else {
            result = this._handleCollectionGet(req.query)
        }

        res.send(result)
    },

    /**********************************************************************
     * _handleCollectionGet
     */        
    _handleCollectionGet: function(query) {
        return this.find(query)
    },

    /**********************************************************************
     * find
     */        
    find: function(query) {
        var result = [] // XXX better to error?
        var db = this._db
        if (db) {
            var collectionName = this.collection
            if (collectionName) {
                var c = db.getCollection(collectionName)
                result = c.find(query).toArray()
            }
        }
        
        return result
    },

    /**********************************************************************
     * _handleObjectGet
     */        
    _handleObjectGet: function(id, query) {
        return({_id: id})
    },

    /**********************************************************************
     * _getdb
     */        
    _getdb: function(uri) {
        return null // XXX
    }

})
