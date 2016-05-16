var __ = require('fiber').__.main(module)

__(function() {
  require('./acl-tests')
  require('./json-schema-tests')
  require('./id-generator-tests')
  require('./parameter-parsing-tests')
  require('./basic-endpoint-tests')
  require('./basic-collection-tests')
  require('./mongodb-collection-tests')
  require('./start-stop-tests') // async so leave at end for now
})

