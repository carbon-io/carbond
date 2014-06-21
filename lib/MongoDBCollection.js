var o = require('maker').o;
var oo = require('maker').oo;
var _o = require('maker')._o;

/******************************************************************************
 * @class MongoDBCollection
 */
module.exports = oo({

    /**********************************************************************
     * _type
     */
    _type: "datanode/lib/Endpoint", // XXX

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
                return this._objectserver._db || _getdb(this.mongodbURI)
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
     * _handleCollectionGet
     */        
    find: function(query) {
        var result = [] // XXX better to error?
        var db = this._db
        if (db) {
            var collectionName = this.collection
            if (collectionName) {
                var c = db.getCollection(collectionName)
                result = c.find().toArray()
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
        return null
    }

});

/*
var TestEndpoint = o({
    "_type" : Endpoint,
    
    "message" : null,
    
    "get" : function(req, res) {
        res.send({ message : this.message });
    }
});
*/
