class ObjectServer
----------

The ```ObjectServer``` class is the top-level class for defining APIs. 

```js
{
  port: <int>,
  description: <string>,
  dbUri: <string>,
  apiRootPath: <string>,
  authenticator: <Authenticator>,
  endpoints: [<Endpoint>],
}
```

Example
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

Properties
----------

Methods
----------



