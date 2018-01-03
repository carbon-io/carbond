var initErrors = require('./InitError')

module.exports = {
  InitError: initErrors.InitError,
  ServiceInitError: initErrors.ServiceInitError,
  EndpointInitError: initErrors.EndpointInitError,
  CollectionInitError: initErrors.CollectionInitError,
  MongoDBCollectionInitError: initErrors.MongoDBCollectionInitError,
  OperationInitError: initErrors.OperationInitError
}
