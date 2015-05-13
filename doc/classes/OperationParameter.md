class OperationParameter
----------

```Operation```s can optionally define one or more ```OperationParameters```. Each ```OperationParameter``` can specify the 
location of the parameter (path, query string, or body) as well as a JSON schema definition to which the parameter must conform.

Formally defining parameters for operations helps you to build a self-describing API for which the framework can then 
auto-generate API documention and interactive administration tools.

Configuration
----------

```
{
  [_type: carbon.carbond.OperationParameter,]
  [description: <string>],
  [location: <string> ('query' | 'path' | 'body')],
  [schema: <object>] // JSON Schema object (http://json-schema.org/)
  [required: <boolean]
}
```

Properties
----------

* ```description```: A description for this parameter

* ```location```: The location in which this parameter will be passed. Can be one of ```'query'```, ```'path'```, or ```'body'```.

* ```schema```: A [JSON Schema](http://json-schema.org/) definition. If supplied Carbond will parse the parameter 
as JSON / EBSON and automaticall validate that incoming data conforms to the schema and report a 403 Error to the client 
if data violates the schema. 

Methods
----------

Examples
----------

