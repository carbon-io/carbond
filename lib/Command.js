var request = require('request')
var o = require('maker').o(module);
var oo = require('maker').oo(module);
var _o = require('maker')._o(module);

/******************************************************************************
 * @class Command
 */
module.exports = oo({

    /**********************************************************************
     * _type
     */
    _type: "datanode/Endpoint",

    /**********************************************************************
     * post
     */        
    post: function(req, res) {
        this.runCommand(req.body)
        res.send({ok: 1}) 
    },

    /**********************************************************************
     * runCommand
     */        
    runCommand: function(command) {}
})
