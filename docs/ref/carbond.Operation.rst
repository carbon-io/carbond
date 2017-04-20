=================
carbond.Operation
=================

.. js:class:: Operation()
    :hidden:

An ``Operation`` represents a single HTTP method on an endpoint (``GET``, ``PUT``, ``POST``, ``PATCH``, ``DELETE``, ``HEAD``, ``OPTIONS``). 

An ``Operation`` implements this HTTP method via service. XXX 


Each ``Operation`` can define any number of :js:class:`OperationParameter`. All parameters provided to an ``Operation`` will be available via the ``parameters`` property of the ``HttpRequest`` object and can be accessed as ``req.parameters[<parameter-name>]`` or ``req.parameters.<parameter-name>``.

Carbond supports both JSON and `EJSON <http://docs.mongodb.org/manual/reference/mongodb-extended-json/>`_ (Extended JSON, which includes support additional types such as ``Date`` and ``ObjectId``). 

Formally defining parameters for operations helps you to build a self-describing API for which the framework can then auto-generate API documention and interactive administration tools. 

Configuration
=============

..  code-block:: javascript

    {
      _type: carbon.carbond.Operation,
      [description: <string>],
      [parameters: {
        <name>: <OperationParameter>,
        ...
      }],
      service: <function>
    }

Properties
==========

.. class:: carbond.Operation
    :noindex:
    :hidden:

    .. attribute:: carbond.Operation.description

        .. csv-table::
            :class: details-table

            "description", :class:`string`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.Operation.endpoint

        .. csv-table::
            :class: details-table

            "endpoint", :class:`~carbond.Endpoint`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.Operation.limiter

        .. csv-table::
            :class: details-table

            "limiter", :class:`~carbond.limiter.Limiter`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.Operation.name

        .. csv-table::
            :class: details-table

            "name", :class:`string`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.Operation.parameters

        .. csv-table::
            :class: details-table

            "parameters", :class:`object`
            "Default", ``{}``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.Operation.responses

        .. csv-table::
            :class: details-table

            "responses", :class:`object`
            "Default", ``[]``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.Operation.validateOutput

        .. csv-table::
            :class: details-table

            "validateOutput", :class:`boolean`
            "Default", ``true``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

  
Methods
=======

.. class:: carbond.Service
    :noindex:
    :hidden:

    .. function:: carbond.Operation.getAllParameters

        .. csv-table::
            :class: details-table

            "getAllParameters ()", ""
            "Arguments", ``undefined``
            "Returns", :class:`object`
            "Descriptions", "Gets all parameters defined for this Operation which includes all parameters inherited from this.endpoint"

    .. function:: carbond.Operation.getSanitizedURL

        .. csv-table::
            :class: details-table

            "getSanitizedURL (*req*)", ""
            "Arguments", "**req** (:class:`~http.ClientRequest`): the current request"
            "Returns", :class:`String`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.Operation.getService

        .. csv-table::
            :class: details-table

            "getService ()", ""
            "Arguments", ``undefined``
            "Returns", :class:`~carbond.Service`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.Operation.service

        .. csv-table::
            :class: details-table

            "service (*req, res*)", ""
            "Arguments", "**req** (:class:`~http.ClientRequest`): the current request |br|
            **res** (:class:`~http.ClientResponse`): the current response |br|"
            "Returns", ``undefined``
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

            