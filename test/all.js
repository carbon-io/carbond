var __ = require('fiber').__(module)

__(function() {
  require('./acl-tests')
  require('./json-schema-tests')
  require('./id-generator-tests')
  require('./basic-endpoint-tests')
  require('./basic-collection-tests')
  require('./mongodb-collection-tests')
})

