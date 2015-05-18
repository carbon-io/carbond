class SslOptions
----------

Instances of this class represent a set of ssl related options for an ```ObjectServer```. 

Configuration
----------

```
{
  _type: carbon.carbond.Endpoint,
  
  [get: <function> | <Operation>],
  [put: <function> | <Operation>],
  [post: <function> | <Operation>],
  [create: <function> | <Operation>],
  [delete: <function> | <Operation>],
  [head: <function> | <Operation>],
  [options: <function> | <Operation>],

  [endpoints: { 
    <path>: <Endpoint>
    ...
  }]
}
```

Properties
----------

* ```path``` (read-only) - the path to which this endpoint is bound. The path can contain variable patterns (e.g. ```'orders/:id'```). The ```path``` property is not configured directly on ```Endpoint``` objects but are specified as lvals in enclosing defininitions of endpoints such as in an ```ObjectServer``` or a parent ```Endpoint``` object. When retrieved the value of this property will be the absolute path of the endpoint from ```/```. 

* ```objectserver``` (read-only) - the ```ObjectServer``` to which this endpoint belongs

* ```endpoints``` - a set of child ```Endpoint``` definitions. This is an object whose keys are path strings and values are instances of ```Endpoint```. Each path key will be interpreted as relative to this ```Endpoint```s ```path``` property. 

Methods
----------
_none_

Examples
----------
