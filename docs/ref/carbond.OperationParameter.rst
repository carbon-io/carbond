==========================
carbond.OperationParameter
==========================

.. js:class:: Operation()
    :hidden:

``Operations`` can optionally define one or more ``OperationParameter``\ s. Each ``OperationParameter`` can specify the 
location of the parameter (path, query string, or body) as well as a JSON schema definition to which the parameter must conform.

All parameters defined on an ``Operation`` will be available via the ``parameters`` property of  the ``HttpRequest`` object and can be accessed as ``req.parameters[<parameter-name>]`` or ``req.parameters.<parameter-name>``.

Carbond supports both JSON and `EJSON <http://docs.mongodb.org/manual/reference/mongodb-extended-json/>`_ (Extended JSON, which includes support additional types such as ``Date`` and ``ObjectId``). 

Formally defining parameters for operations helps you to build a self-describing API for which the framework can then auto-generate API documention and interactive administration tools.

Configuration
=============

..  code-block:: javascript

    {
      [_type: carbon.carbond.OperationParameter,]
      [description: <string>],
      [location: <string> ('query' | 'path' | 'body')],
      [schema: <object>] // JSON Schema object (http://json-schema.org/)
      [required: <boolean>]
    }

Properties
==========

.. class:: carbond.OperationParameter
    :noindex:
    :hidden:

    .. attribute:: carbond.OperationParameter.default

        .. csv-table::
            :class: details-table

            "default", :class:`string`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.OperationParameter.description

        .. csv-table::
            :class: details-table

            "description", :class:`string`
            "Default", ``undefined``
            "Description", "A description for this parameter."

    .. attribute:: carbond.OperationParameter.location

        .. csv-table::
            :class: details-table

            "location", :class:`string`
            "Default", ``undefined``
            "Description", "The location in which this parameter will be passed. Can be one of ``'query'``, ``header``,``'path'``, ``'forData'``, or ``'body'``."

    .. attribute:: carbond.OperationParameter.name

        .. csv-table::
            :class: details-table

            "name", :class:`string`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.OperationParameter.required

        .. csv-table::
            :class: details-table

            "required", :class:`boolean`
            "Default", ``false``
            "Description", "The parameter is considered required iff this flag is set to ``true``."

    .. attribute:: carbond.OperationParameter.schema

        .. csv-table::
            :class: details-table

            "schema", :class:`object`
            "Default", ``undefined``
            "Description", "A `JSON Schema <http://json-schema.org/>`_ definition. If supplied Carbond will parse the parameter as JSON / `EJSON <http://docs.mongodb.org/manual/reference/mongodb-extended-json/>`_ and automaticall validate that incoming data conforms to the schema and report a 400 Error to the client if data violates the schema. If ``null`` or ``undefined`` the defined parameter will not be parsed and will be a raw ``string``. To specify this parameter as an EJSON value of any type, a schema value of ``{}`` should be supplied. To support `EJSON <http://docs.mongodb.org/manual/reference/mongodb-extended-json/>`_, we extend JSON Schema to support the following additional types which can be used like other JSON Schema primitives like ``string``: |br|- ``ObjectId``|br|- ``Date``|br|- ``Timestamp``|br|- ``Regex``|br|- ``NumberLong``|br|- ``Undefined``|br|"


Methods
=======

.. class:: carbond.OperationParameter
    :noindex:
    :hidden:

    .. function:: carbond.OperationParameter.extractParameterValueFromRequest

        .. csv-table::
            :class: details-table

            "extractParameterValueFromRequest (*req*)", ""
            "Arguments", "**req** (:class:`~http.ClientRequest`): the current request object |br|"
            "Returns", :class:`object`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."


Examples
========

An operation with a string query parameter:

..  code-block:: javascript

    {
      get: {
        description: "My hello world operation",
        parameters: {
          message: {
            description: "A message to say to the world",
            location: 'query',
            required: true,
            schema: { type: 'string' }
          }
        }
        service: function(req) {
          return { msg: "Hello World! " + req.parameters.message }
        }
      }
    }
