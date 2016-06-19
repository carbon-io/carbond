var __ = require('fiber').__.main(module)

__(function() {
  try {
    require('./acl-tests')
    require('./json-schema-tests')
    require('./id-generator-tests')
    require('./parameter-parsing-tests')
    require('./basic-endpoint-tests')
    require('./basic-collection-tests')
    require('./mongodb-collection-tests')
    require('./start-stop-tests') // async so leave at end for now
  } catch (e) {
    console.log(e) // We dont get here with certain errors and return 0 exit code
  }
})

