var request = require('request')
var o = require('atom').o(module);
var oo = require('atom').oo(module);
var _o = require('atom')._o(module);

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
