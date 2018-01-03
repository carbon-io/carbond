var util = require('util')

function InitError(error, component, path) {
  Error.captureStackTrace(this, InitError)
  this.name = this.constructor.name
  this.error = error
  this.component = component
  this.path = path
  Object.defineProperty(this, 'message', {
    configurable: false,
    enumerable: true,
    get: () => this.formatMessage()
  })
}
util.inherits(InitError, Error)

InitError.prototype.formatMessage = function() {
  throw new Error('Not implemented')
}

function EndpointInitError(error, component, path) {
  InitError.call(this, error, component)
  Object.defineProperty(this, 'path', {
    configurable: false,
    enumerable: true,
    get: () => this.component.path
  })
}
util.inherits(EndpointInitError, InitError)

EndpointInitError.prototype.formatMessage = function() {
  return `\nComponent: Endpoint(${this.component.name})\n` +
         `Path:      ${this.path}\n` +
         `Error:     ${this.error.toString()}`
}

function ServiceInitError(error, component) {
  EndpointInitError.call(this, error, component)
}
util.inherits(ServiceInitError, EndpointInitError)

ServiceInitError.prototype.formatMessage = function() {
  return `\nComponent: Service(${this.component.name})\n` +
         `Path:      ${this.path}\n` +
         `Error:     ${this.error.toString()}`
}

function CollectionInitError(error, component, path) {
  EndpointInitError.call(this, error, component)
}
util.inherits(CollectionInitError, EndpointInitError)

CollectionInitError.prototype.formatMessage = function() {
  return `\nComponent: Collection(${this.component.name})\n` +
         `Path:      ${this.path}\n` +
         `Error:     ${this.error.toString()}`
}

function MongoDBCollectionInitError(error, component, path) {
  EndpointInitError.call(this, error, component)
}
util.inherits(MongoDBCollectionInitError, EndpointInitError)

MongoDBCollectionInitError.prototype.formatMessage = function() {
  return `\nComponent: MongoDBCollection(${this.component.name})\n` +
         `Path:      ${this.path}\n` +
         `Error:     ${this.error.toString()}`
}

function OperationInitError(error, component, path) {
  InitError.call(this, error, component)
  Object.defineProperty(this, 'path', {
    configurable: false,
    enumerable: true,
    get: () => this.component.path
  })
}
util.inherits(OperationInitError, InitError)

OperationInitError.prototype.formatMessage = function() {
  return `\nComponent: Operation(${this.component.name})\n` +
         `Path:      ${this.path}\n` +
         `Error:     ${this.error.toString()}`
}


module.exports = {
  InitError: InitError,
  ServiceInitError: ServiceInitError,
  EndpointInitError: EndpointInitError,
  CollectionInitError: CollectionInitError,
  MongoDBCollectionInitError: MongoDBCollectionInitError,
  OperationInitError: OperationInitError
}
