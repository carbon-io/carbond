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
