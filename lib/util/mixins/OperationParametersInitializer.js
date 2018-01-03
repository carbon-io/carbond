var _ = require('lodash')

var OperationParameter = require('../../OperationParameter')
var _o = require('@carbon-io/carbon-core').bond._o(module)
var o = require('@carbon-io/carbon-core').atom.o(module)

var OperationParametersInitializer = {
  /*****************************************************************************
   * @method _initializeParameters
   * @description Initializes all parameters. If a parameter is not an instance
   *              of {@link carbond.OperationParameter}, it will be instantiated
   *              as such.
   * @returns {undefined}
   */
  _initializeParameters: function() {
    let parameters = this.parameters
    for (let parameterName in parameters) {
      let parameter = parameters[parameterName]
      if (!(parameter instanceof OperationParameter)) {
        parameter = o(_.assign({name: parameterName}, parameter),
                      OperationParameter)
        parameters[parameterName] = parameter // set it back
      }
    }
  }
}

module.exports = OperationParametersInitializer
