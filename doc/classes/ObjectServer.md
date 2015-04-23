class carbond.ObjectServer
----------

The ```ObjectServer``` class is the top-level class for defining APIs. 

```node
{
  _type: carbon.carbond.ObjectServer,
  port: <int>,
  description: <string>,
  dbUri: <string>,
  dbUris: [<string>],
  path: <string>,
  processUser: <string>,
  verbosity: <verbosity>,
  authenticator: <Authenticator>,
  endpoints: {
    <path>: <Endpoint>,
    ...
  }
}
```

Properties
----------

* ```port```: The port to listen on

* ```description```: A short description of this API

* ```dbUri```: The URI for the database (e.g.: ```'mongodb://localhost:27017/mydb' ```). The server will connect to this database at startup and expose it through the ```db``` property

* ```path```: The root URL path for this API. All HTTP requests must use this prefix to reach the endpoints of this API. This value defaults to the empty string ```''``` which results in this ```ObjectServer``` being mounted at ```/```

* ```processUser```: The unix process user you would like the server
  to run as after binding to ```port```. This is useful when you need to start the process as root
  to bind to a privileged port but don't want the process to remain
  running as root 

* ```verbosity```: Controls the logging level. One of (```'debug'``` | ```'info'``` | ```'warn'``` | ```'error'``` | ```'fatal'```). _Default:_ ```'info'```

* ```authenticator```: The```Authenticator``` object for this API. The authenticator is used to authenticate the API user

* ```endpoints```: A set of ```Endpoint``` definitions. This is an object whose keys are path strings and values are instances of ```Endpoint```. Each path key will be interpreted as relative to this ```ObjectServer```s ```path``` property. These paths can also define variable bindings (e.g. ```orders/:id```)  

Methods
----------

TBD


Example
----------

```node
var o = require('maker').o(module, true)

module.exports = o({
  _type: 'datanode/ObjectServer',
  port: 8888,
  endpoints: {
    hello: o({
      _type: 'datanode/Endpoint',
      get: function(req) {
        return { msg: "Hello World!" }
      }
    })
  }
})
```


