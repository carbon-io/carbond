

```
var o = require('maker').o(module)

o({
  _type: 'datanode/ObjectServer',

  port: 8888,
  dbUri: 'mongodb://localhost:27017/mydb',
  endpoints: {
    hello: {
      _type: 'datanode/Endpoint',
      get: function(req) {
        return { msg: "hello world!" }
      }
    }
  ]
})
```
