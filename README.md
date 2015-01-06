datanode
----------

The ObjectServer is 

Using datanode
----------

ObjectServer
----------

```
o({
  _type: 'datanode/ObjectServer',
  
  port: 8888,
  dbUri: 'mongodb://localhost:27101/mydb',
  endpoints: {
    hello: {
      _type: 'datanode/Endpoint',
      get: function(req, res) {
        res.send({msg: "hello world!"})  
      }
    }
  ]
})

```

Endpoints
----------

```
o({
  _type: 'datanode/Endpoint',
  
  get: function(req, res) {
    req.send({msg: "hello world!"})  
  }
})
```

Other stuff
----------

* Getting started
  * Defining your first API
  * Start your datanode
  * Play with your API using the auto-generated interactive API documentation
* User guide
  * Overview
  * Fibers
  * Maker
  * The ObjectServer, Endpoints
  * Running a datanode
  * Commandline args
  * Auto-generated interactive API documentation
  * Authentication
  * Logging
  * Error handling
  * Production best-practices
    * Configuration Subclassing or creating instance of ObjectServer
    * Multi-file implementations (could go with productionalizing) (directory layout)
  * Class Reference
* Examples


