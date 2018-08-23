const oo = require('@carbon-io/carbon-core').atom.oo(module)
const  o = require('@carbon-io/carbon-core').atom.o(module)

const PolicyLimiter = require('./PolicyLimiter')
const AccessKeyLimiterSelector = require('./AccessKeyLimiterSelector')

/******************************************************************************
 * class AccessKeyLimiter
 * @extends PolicyLimiter
 * 
 * Uses AccessKeyLimiterSelector, and
 * returns HttpErrors.TooManyRequests in the throttlingResponse by default.
 */
const AccessKeyLimiter = oo({
    _type: PolicyLimiter,
    _ctorName: 'AccessKeyLimiter',

    /**********************************************************************
     * method _C
     */
    _C: function() {
        /**
         * @member {carbond.security.LimiterSelector}
         */
        this.selector = o({
            _type: AccessKeyLimiterSelector
        });

        /**
         * @member {carbond.security.LimiterPolicy}
         */
        this.policy = undefined

        /**
         * @member {carbon.atom}
         */
        this.throttlingResponse = o({
            error: HttpErrors.TooManyRequests,
            message: 'Too many requests.'
        })
    }
})

module.exports = AccessKeyLimiter