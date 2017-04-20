.. class:: carbond.Endpoint
    :heading:

.. |br| raw:: html
    
   <br />

================
carbond.Endpoint
================

An :class:`~carbond.Endpoint` is a representation of a RESTFul resource. Each endpoint can implement one or more operations representing each of the HTTP methods: ``GET``, ``PUT``, ``POST``, ``PATCH``, ``DELETE``, ``HEAD``, ``OPTIONS``.

Endpoints can also define child endpoints whose paths will be interpreted relative to the ``path`` of this :class:`~carbond.Endpoint` object.

Configuration
=============

..  code-block:: javascript

    {
      _type: carbon.carbond.Endpoint,

      [parameters: {
        <name> : <OperationParameter>
      }]  

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

Properties
==========

.. class:: carbond.Endpoint
    :noindex:
    :hidden:

    .. attribute:: carbond.Endpoint.acl

         .. csv-table::
             :class: details-table

             "acl", :class:`object`
             "Default", ``null``
             "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo        re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.Endpoint.allowUnauthenticated

         .. csv-table::
             :class: details-table

             "allowUnauthenticated", :class:`object`
             "Default", ``null``
             "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo        re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.Endpoint.dataAcl

         .. csv-table::
             :class: details-table

             "dataAcl", :class:`object`
             "Default", ``null``
             "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo        re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.Endpoint.description

         .. csv-table::
             :class: details-table

             "description", :class:`string`
             "Default", ``undefined``
             "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo        re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.Endpoint.endpoints

        .. csv-table::
            :class: details-table

            "endpoints", :class:`object`
            *Required*, ""
            "Description", "A set of child :class:`~carbond.Endpoint` definitions. This is an object whose keys are path strings and values are instances of :class:`~carbond.Endpoint`. Each path key will be interpreted as relative to this Endpoints ``path`` property."

    .. attribute:: carbond.Endpoint.parameters

        .. csv-table::
            :class: details-table

            "parameters", :class:`object`
            *Required*, ""
            "Description", "A mapping of parameter names to ``OperationParameter`` objects. Parameters defined for an ``Endpoint`` are inherited by all operations of this ``Endpoint`` as well as by all child ``Endpoints`` of this ``Endpoint``."

    .. attribute:: carbond.Endpoint.parent
    
        .. csv-table::
            :class: details-table

            "parent", :class:`~carbond.Endpoint`
            "Default", ``null``
            "Description", "The parent :class:`~carbond.Endpoint` of this :class:`~carbond.Endpoint`."

    .. attribute:: carbond.Endpoint.path

        .. csv-table::
            :class: details-table

            "path", :class:`string`
            *Required*, ""
            "Description", "The path to which this endpoint is bound. The path can contain variable patterns (e.g. ``'orders/:id'``). The ``path`` property is not configured directly on ``Endpoint`` objects but are specified as lvals in enclosing definitions of endpoints such as in a parent :class:`~carbond.Endpoint` object. When retrieved the value of this property will be the absolute path of the endpoint from ``/``."

    .. attribute:: carbond.Endpoint.sanitizeMode

         .. csv-table::
             :class: details-table

             "sanitizeMode", :class:`string`
             "Default", ``strict``
             "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo        re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.Endpoint.sanitizesOutput

         .. csv-table::
             :class: details-table

             "sanitizesOutput", :class:`boolean`
             "Default", ``false``
             "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo        re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.Endpoint.service

         .. csv-table::
             :class: details-table

             "service", :class:`~carbond.Service`
             "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo        re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.Endpoint.validateOutput

         .. csv-table::
             :class: details-table

             "validateOutput", :class:`boolean`
             "Default", ``true``
             "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo        re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."


Methods
=======

.. class:: carbond.Endpoint
    :noindex:
    :hidden:

    .. function:: carbond.Endpoint.getOperation

        .. csv-table::
            :class: details-table

            "getOperation (*method*)", ""
            "Arguments", "**method** (:class:`function`): the HTTP method"
            "Returns", :class:`function`
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo        re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.Endpoint.getService

        .. csv-table::
            :class: details-table

            "getService ()", ""
            "Arguments", ""
            "Returns", :class:`~carbond.Service`
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo        re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.Endpoint.isOperationAuthorized

        .. csv-table::
            :class: details-table

            "isOperationAuthorized (*method, user, req*)", ""
            "Arguments", "**method** (:class:`function`): the HTTP method |br|
            **user**: The user to check auth against |br|
            **req** (:class:`express.request`): The current `Request` object |br|"
            "Returns", :class:`boolean`
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo        re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.Endpoint.operations

        .. csv-table::
            :class: details-table

            "operations ()", ""
            "Arguments", ``undefined``
            "Returns", :class:`object`
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo        re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.Endpoint.options

        .. csv-table::
            :class: details-table

            "options (*req, res*)", ""
            "Arguments", "**req** (:class:`express.request`): The current `Request` object. |br|
            **res** (:class:`express.response`): The current `Response` object."
            "Returns", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo        re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.Endpoint.supportedMethods

        .. csv-table::
            :class: details-table

            "supportedMethods ()", ""
            "Arguments", ``undefined``
            "Returns", :class:`object`
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo        re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

Operations
==========

Each endpoint can implement one or more operations representing each of the HTTP methods: ``GET``, ``PUT``, ``POST``, ``PATCH``, ``DELETE``, ``HEAD``, ``OPTIONS``. There is no requirement an endpoint implement all HTTP methods. It only needs to implement those it wishes to support.

Each operation is represented as either:

- A function of the form ``function(req, res)``
- An ``Operation`` object. This is more elaborate definition which allows for a description, parameter definitions, and other useful meta-data as well as a ``service`` method of the form ``function(req, res)``
  
When responding to HTTP requests, two styles are supported:

- An asynchronous style where operations write directly to the ``HttpResponse`` object passed to the operation. This style is useful when the operation needs to manipulate the ``HttpResponse`` object to do more than simply return JSON (e.g. set HTTP headers), or wished to pass the response to other functions.
- A synchronous style where the operation simply returns a JSON object from the operation, or throws an exception to signal an error condition. When using this style the ``HttpResponse`` parameter can be omitted from the function signature of the operation. This style is useful when programming in a more synchronous style and / or coordinating with exceptions thrown deeper in the call stack.

Examples (synchronous)
----------------------

..  code-block:: javascript

    get: function(req) {
      return { msg: "hello world!" }
    }

..  code-block:: javascript

    get: {
      description: "My hello world operation",
      params: {}
      service: function(req) {
        return { msg: "hello world!" }
      }
    }

XXX come back to talk about error handling

Operation details
=================

get
---

Implementation of HTTP ``GET``. Either a ``function`` or an ``Operation`` object.

If the operation is defined by a function it will have these parameters:

- ``req``: the ``HttpRequest`` object
- ``res``: the ``HttpResponse`` object (can be omitted if using a synchronous style). If the operation is defined by an ``Operation`` object the definition will have a service method of the same signature.

put
---

Implementation of HTTP ``PUT``. Either a ``function`` or an ``Operation`` object.

If the operation is defined by a function it will have these parameters:

- ``req``: the ``HttpRequest`` object
- ``res``: the ``HttpResponse`` object (can be omitted if using a synchronous style). If the operation is defined by an ``Operation`` object the definition will have a service method of the same signature.

post
----

Implementation of HTTP ``POST``. Either a ``function`` or an ``Operation`` object.

If the operation is defined by a function it will have these parameters:

- ``req``: the ``HttpRequest`` object
- ``res``: the ``HttpResponse`` object (can be omitted if using a synchronous style). If the operation is defined by an ``Operation`` object the definition will have a service method of the same signature.

patch
------

Implementation of HTTP ``PATCH``. Either a ``function`` or an ``Operation`` object.

If the operation is defined by a function it will have these parameters:

- ``req``: the ``HttpRequest`` object
- ``res``: the ``HttpResponse`` object (can be omitted if using a synchronous style). If the operation is defined by an ``Operation`` object the definition will have a service method of the same signature.

delete
------

Implementation of HTTP ``DELETE``. Either a ``function`` or an ``Operation`` object.

If the operation is defined by a function it will have these parameters:

- ``req``: the ``HttpRequest`` object
- ``res``: the ``HttpResponse`` object (can be omitted if using a synchronous style). If the operation is defined by an ``Operation`` object the definition will have a service method of the same signature.

head
----

Implementation of HTTP ``HEAD``. Either a ``function`` or an ``Operation`` object.

If the operation is defined by a function it will have these parameters:

- ``req``: the ``HttpRequest`` object
- ``res``: the ``HttpResponse`` object (can be omitted if using a synchronous style). If the operation is defined by an ``Operation`` object the definition will have a service method of the same signature.

options
-------

Implementation of HTTP ``OPTIONS``. Either a ``function`` or an ``Operation`` object.

If the operation is defined by a function it will have these parameters:

- ``req``: the ``HttpRequest`` object
- ``res``: the ``HttpResponse`` object (can be omitted if using a synchronous style). If the operation is defined by an ``Operation`` object the definition will have a service method of the same signature.

Examples
========

..  code-block:: javascript

    var carbon = require('carbon.io')
    var o = carbon.atom.o(module)

    module.exports = o({
      _type: carbon.carbond.ObjectServer,
      port: 8888,
      endpoints: {
        hello: o({
          _type: carbon.carbond.Endpoint,
          get: function(req) {
            return { msg: "Hello World!" }
          }
        })
      }
    })
