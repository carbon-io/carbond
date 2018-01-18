==========
Operations
==========

Each endpoint can implement one or more operations representing each of the HTTP
methods: ``GET``, ``PUT``, ``POST``, ``PATCH``, ``DELETE``, ``HEAD``,
``OPTIONS``. There is no requirement for an endpoint to implement all HTTP
methods. It only needs to implement those it wishes to support.

Defining Operations
-------------------

Each operation is represented as either:

- A function of the form ``function(req, res)``.
- An :js:class:`~carbond.Operation` object. This is a more elaborate definition
  which allows for a description, parameter definitions, and other useful
  metadata as well as a :js:func:`~carbond.Operation.handle`` method of the
  form ``function(req, res)``.

When responding to HTTP requests, two styles are supported:

.. todo:: style express links

- An asynchronous style where operations write directly to the :express4:`res`
  object passed to the operation. This style is useful when the operation needs
  to manipulate the :express4:`res` object to do more than simply return JSON
  (e.g. set HTTP headers), or wishes to pass the response to other functions
  (**NOTE**: ``undefined`` should be returned to signal this condition).

- A synchronous style where the operation simply returns a JSON object from the
  operation, or throws an exception to signal an error condition. When using
  this style the :express4:`res` parameter can be omitted from the function
  signature of the operation. This style is useful when programming in a more
  synchronous style and / or coordinating with exceptions thrown deeper in the
  call stack (**NOTE**: if the response is to have an empty body (HTTP status
  code ``204``), ``null`` should be returned instead of ``undefined``).

**Examples (asynchronous)**

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleEndpointOperationExample.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: operations-asyncFunc

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleEndpointOperationExample.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: operations-asyncObj

**Examples (synchronous)**

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleEndpointOperationExample.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: operations-syncFunc

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleEndpointOperationExample.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: operations-syncObj

Operation parameters
--------------------

Each :js:class:`~carbond.Operation` can define the set of parameters it takes.
Each :js:class:`~carbond.OperationParameter` can specify the location of the
parameter (``'path'``, ``'query'`` (for query string), or ``body``) as well as a
:jsonschema:`JSON Schema <#>` definition to which the parameter must conform.

All parameters provided to an :js:class:`Operation` will be available via the
:js:attr:`HttpRequest.parameters` property of the :express4:`req` object and can
be accessed as ``req.parameters[<parameter-name>]`` or
``req.parameters.<parameter-name>``.

Carbond supports both JSON and :ejson:`EJSON <#>` (Extended JSON, which includes
support for additional types such as :js:class:`Date` and
:js:class:`~ejson.ObjectId`).

Formally defining parameters for operations helps you to build a self-describing
API for which the framework can then auto-generate API documention and
interactive administration tools.

**Examples**

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleEndpointOperationExample.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: operations-queryParam

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleEndpointOperationExample.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: operations-bodyParam

Parameter schemas
-----------------

TODO

Parameter parsing
-----------------

TODO

Operation responses
-------------------

TODO

