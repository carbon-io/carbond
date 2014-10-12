var o = require('maker').o(module);
var oo = require('maker').oo(module);
var _o = require('maker')._o(module);

/******************************************************************************
 * @class Collection
 */
module.exports = oo({

    /**********************************************************************
     * _type
     */
    _type: "./Endpoint",

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
        var id = req.params.id
        if (id) {
            this.findById(id, function(err, obj) {
                if (err) {
                    res.send("ERROR") // XXX
                } else {
                    res.send(obj)
                }
            })
        } else {
            this.find(req.query, {}, function(err, objs) {
                if (err) {
                    res.send("ERROR") // XXX
                } else {
                    res.send(objs)
                }
            })
        }
    },

    /**********************************************************************
     * findById
     */        
    findById: function(id, cb) {
        this._notImplemented(cb)
    },

    /**********************************************************************
     * find
     */        
    find: function(query, options, cb) { // XXX should return a cursor? Probably not at this level of abs. Clients cant use cursors really. 
                                         //We might just have MDBColl limit results if limits not sent
        this._notImplemented(cb)
    },

    /**********************************************************************
     * findOne
     */        
    findOne: function(query, options, cb) {
        this._notImplemented(cb)
    },

    /**********************************************************************
     * insert
     */        
    insert: function(obj, cb) {
        this._notImplemented(cb)
    },

    /**********************************************************************
     * update
     */        
    update: function(query, obj, options, cb) {
        this._notImplemented(cb)
    },

    /**********************************************************************
     * deleteById
     */        
    deleteById: function(id, cb) {
        this._notImplemented(cb)
    },

    /**********************************************************************
     * delete
     */        
    delete: function(query, cb) {
        this._notImplemented(cb)
    },

    /**********************************************************************
     * _notImplemented
     */        
    _notImplemented: function(cb) {
        cb(null, Error("Not implemented"))
    }
})
