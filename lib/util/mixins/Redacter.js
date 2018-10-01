const _ = require('lodash')

module.exports = {
  _redactObject: function(object, redactions) {
    if ('*' in redactions) {
      const default_policy = redactions['*']
      delete redactions['*']

      Object.keys(object).map(key => {
          const is_prefix = Object.keys(redactions).map(path_key => {
            return path_key.startsWith(key)
          })

          if (!is_prefix.includes(true))
            redactions[key] = default_policy
      })
    }

    for (let path in redactions) {
      const redaction = redactions[path]

      const datum = _.get(object, path)

      if (!datum)
          continue

      if (typeof redaction === 'boolean' && redaction) {
          _.set(object, path, '[redacted]')
      } else if (typeof redaction === 'function') {
          _.set(object, path, redaction(datum))
      } else if (typeof redaction === 'object') {
          this._redactObject(datum, redaction)
      }
    }

    return object
  }
}
