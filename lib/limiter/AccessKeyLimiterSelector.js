const _ = require('lodash')

const oo = require('@carbon-io/carbon-core').atom.oo(module)

const ReqPropertyLimiterSelector = require('./ReqPropertyLimiterSelector')

/******************************************************************************
 * class AccessKeyLimiterSelector
 * @extends ReqPropertyLimiterSelector
 *
 *
 * Extract the 'headers.access-key-id' key from the current request.
 * If not present in the request, return '*' as the key.
 * 
 * When used with LimiterPolicy, the LimiterPolicy will bucket requests by access key
 * and place requests without access keys in the same bucket.
 */

const AccessKeyLimiterSelector = oo({
     _type: ReqPropertyLimiterSelector,
     _ctorName: 'AccessKeyLimiterSelector',

     _C: function() {
        this.propertyPath = 'headers.access-key-id';
     },

    /**********************************************************************
     * @inheritdoc
     */
     key: function(req) {
        let key = ReqPropertyLimiterSelector.prototype.key.call(this, req);
        if (_.isUndefined(key) || _.isNull(key))
            key = '*';

        return key;
     }
 })

 module.exports = AccessKeyLimiterSelector