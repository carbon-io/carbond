# Getting started
***

Defining your first API
----------

### Create your package

The first step is to create a standard Node.js package

```
<path-to-your-app>/
    package.json
    README.md
```

Your package.json should include ```datanode```

```json
{
    "name": "hello-world",
    "description": "Hello World API",
    "engines": { "node": "~0.8.6" },
    "dependencies": {
        "datanode" : "> 0.0.0"
    }
}
```

#### Create the API

Here comes the magic. Create a file called HelloWorldAPI.js

```node
var o = require('maker').o(module)

module.exports = o({
  _type: 'datanode/ObjectServer',
  port: 8888,
  endpoints: {
    hello: {
      _type: 'datanode/Endpoint',
      get: function(req) {
        return { msg: "hello world!" }
      }
    }
  }
})
```
