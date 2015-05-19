class Operation
----------

An ```Operation``` represents a single HTTP method on an endpoint (```GET```, ```PUT```, ```POST```, ```CREATE```, ```DELETE```, ```HEAD```, ```OPTIONS```). 

Configuration
----------

```
{
  _type: carbon.carbond.Operation,
  [description: <string>],
  [parameters: {
    <name>: <[OperationParameter](doc/classes/OperationParameter.md)>,
    ...
  }],
  service: <function>
}
```

Properties
----------

* ```path``` (read-only) - the path to which this endpoint is bound. The path can contain variable patterns such as ```orders/:id```. The ```path``` property is not configured directly on ```Endpoint``` objects but are specified as lvals in enclosing defininitions of endpoints such as in an ```ObjectServer``` or a parent ```Endpoint``` object. When retrieved the value of this property will be the absolute path of the endpoint from ```/```. 

* ```objectserver``` (read-only) - the ```ObjectServer``` of which this endpoint is a part

* ```endpoints``` - an set of child ```Endpoint``` definitions. This is an object whose keys are path string and values are instances of ```Endpoint```. Each path key will be interpreted as relative to this ```Endpoint```s ```path``` property. Path keys can define variable bindings (e.g. ```orders/:id```)  

Methods
----------

