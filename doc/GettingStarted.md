Getting started (Hello World)
----------

### Creating the package

The first step is to create a standard Node.js package

```
<path-to-your-app>/
    package.json
    README.md
```

Your package.json should include ```datanode```

```node
{
    "name": "hello-world",
    "description": "Hello World API",
    "engines": { "node": "~0.8.6" },
    "dependencies": {
        "datanode" : "> 0.0.0"
    }
}
```

### Creating the API

Here comes the magic. Create a file called HelloService.js

```node
var o = require('maker').o(module, true)

module.exports = o({
  _type: 'datanode/ObjectServer',
  port: 8888,
  endpoints: {
    hello: {
      _type: 'datanode/Endpoint',
      get: function(req) {
        return { msg: "Hello World!" }
      }
    }
  }
})
```

### Running the API

```console
% node HelloService.js
[Mon Feb 09 2015 21:56:41 GMT-0800 (PST)] INFO: ObjectServer starting...
[Mon Feb 09 2015 21:56:41 GMT-0800 (PST)] INFO: ObjectServer listening on port 8888
[Mon Feb 09 2015 21:56:41 GMT-0800 (PST)] INFO: ObjectServer running
```

### Connecting to your API

You now have a RESTful web service running on port 8888. You can connect to it via HTTP in a variety of ways. 

**Simple curl test**

```console
% curl localhost:8888/hello
{"msg":"Well hello there world"}
%
```

**API Browser**

In your web browser navigate to: 
   
   ```http://localhost:8888/apidoc```
 


