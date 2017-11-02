var _ = require('lodash')

// XXX: should this be a feature of atom?
function freezeProperties(object, prototype) {
  if (!_.isObjectLike(object)) {
    throw new TypeError('freezeProperties requires a valid object to be passed')
  }
  var next = _.isNil(prototype) ? object : prototype
  if (_.isArray(next._frozenProperties)) {
    next._frozenProperties.forEach(function(propName) {
      var prop = object[propName]
      Object.defineProperty(object, propName, {
        configurable: false,
        enumerable: true,
        value: prop,
        writable: false
      })
    })
  }
  if (!_.isNil(Object.getPrototypeOf(next))) {
    freezeProperties(object, Object.getPrototypeOf(next))
  }
}

module.exports = {
  freezeProperties: freezeProperties
}
