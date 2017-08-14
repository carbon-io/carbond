var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var UpdateObjectConfig = require('../collections/UpdateObjectConfig')

/***************************************************************************************************
 * @class MongoDBUpdateConfig
 */
module.exports = oo(_.assignIn({
  /***************************************************************************
   * _type
   */
  _type: UpdateObjectConfig,

  /***************************************************************************
   * @constructs MongoDBUpdateObjectConfig
   * @description The MongoDB update object operation config
   * @memberof carbond.mongodb
   * @extends carbond.collections.UpdateObjectConfig
   * @mixes carbond.mongodb.MongoDBCollectionOperationConfig
   */
  _C: function() {
    /*************************************************************************
     * @property {boolean} returnsUpsertedObject -- This is not supported in
     *                                              MongoDBCollection
     * @overrides carbond.collections.UpdateObjectConfig.returnsUpsertedObject
     */
    Object.defineProperty(this, 'returnsUpsertedObject', {
      configurable: false,
      writable: false,
      value: false
    })

    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} parameters
     * @description Update object operation specific parameters
     * @extends carbond.collections.UpdateObjectConfig.parameters
     * @property {carbond.OperationParameter} parameters.update
     * @description The "update" parameter definition
     */
    this.parameters = _.assignIn(this.parameters, {
      update: {
        description: 'Update spec (JSON)',
        location: 'body',
        schema: {
          type: 'object'
        },
        required: true
      }
    })
  }
}, _o('./MongoDBCollectionOperationConfig')))

