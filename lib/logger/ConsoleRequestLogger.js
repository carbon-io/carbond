const oo = require('@carbon-io/carbon-core').atom.oo(module)

const RequestLogger = require('./RequestLogger')

/******************************************************************************
 * class ConsoleRequestLogger
 * extends RequestLogger
 */
const ConsoleRequestLogger = oo({
    _type: RequestLogger,

    /**********************************************************************
     * @inheritdoc
     */
    log: function(record) {
        console.log(JSON.stringify(record, null, 4))
    }
})

module.exports = ConsoleRequestLogger