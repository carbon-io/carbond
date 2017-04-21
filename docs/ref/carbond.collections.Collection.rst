.. class:: carbond.collections.Collection
    :heading:

.. |br| raw:: html
 
   <br />

==============================
carbond.collections.Collection
==============================
*extends* :class:`~carbond.Endpoint`

Carbond :class:`~carbond.collections.Collection`\ s provide a high-level abstraction for defining :class:`~carbond.Endpoint`\ s that behave like a collection of 
resources. When you define a :class:`~carbond.collections.Collection` you define the following methods:

- ``insert(obj, reqCtx)``
- ``find(query, options, reqCtx)``
- ``update(query, obj, options, reqCtx)``
- ``remove(query, reqCtx)``
- ``findObject(id, reqCtx)``
- ``updateObject(id, reqCtx)``
- ``removeObject(id, reqCtx)``

Which results in the following tree of :class:`~carbond.Endpoints` and :class:`~carbond.Operations`:

- ``/<collection>``

  - ``GET`` which maps to :func:`find`
  - ``POST`` which maps to ``insert``
  - ``PUT`` which maps to ``update``
  - ``DELETE`` which maps to ``remove``
    
- ``/<collection>/:id``

  -  ``GET`` which maps to ``findObject``
  -  ``PUT`` which maps to ``updateObject``
  -  ``DELETE`` which maps to ``removeObject``


Configuration
=============

..  code-block:: javascript

    {
      _type: carbon.carbond.Collection, // extends Endpoint
      
      [parameters: {
        <name> : <OperationParameter>
      }]  
      
      [insert: <function>],
      [find: <function>],
      [update: <function>],
      [remove: <function>],
      [findObject: <function>],
      [updateObject: <function>],
      [removeObject: <function>]
      
      [endpoints: { 
        <path>: <Endpoint>
        ...
      }]
    }

Properties
==========

.. class:: carbond.collections.Collection
    :noindex:
    :hidden:

    .. attribute:: carbond.collections.Collection.enabled

        .. csv-table::
            :class: details-table

            "enabled", :class:`object`
            "Default", ``{ '*' : true}``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.endpoints

        .. csv-table::
            :class: details-table

            "endpoints", :class:`object`
            "Default", ``{}``
            "Description", " A set of child :class:`~carbond.Endpoint` definitions. This is an object whose keys are path strings and values are instances of :class:`~carbond.Endpoint`. Each path key will be interpreted as relative to this :class:`~carbond.Endpoint`\ s :attr:`path` property."

    .. attribute:: carbond.collections.Collection.findConfig

        .. csv-table::
            :class: details-table

            "findConfig", :class:`object`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.findObjectConfig

        .. csv-table::
            :class: details-table

            "findObjectConfig", :class:`object`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.idGenerator

        .. csv-table::
            :class: details-table

            "idGenerator", :class:`~carbond.IdGenerator`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.idHeader

        .. csv-table::
            :class: details-table

            "idHeader", :class:`string`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.idPathParameter

        .. csv-table::
            :class: details-table

            "idPathParameter", :class:`string`
            "Default", ``_id``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.idRequiredOnInsert

        .. csv-table::
            :class: details-table

            "", :class:`boolean`
            "Default", ``false``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.insertConfig

        .. csv-table::
            :class: details-table

            "insertConfig", :class:`object`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.removeConfig

        .. csv-table::
            :class: details-table

            "removeConfig", :class:`object`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.removeObjectConfig

        .. csv-table::
            :class: details-table

            "removeObjectConfig", :class:`object`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.saveObjectConfig

        .. csv-table::
            :class: details-table

            "saveObjectConfig", :class:`object`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.schema

        .. csv-table::
            :class: details-table

            "schema", :class:`object`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.supportsFind

        .. csv-table::
            :class: details-table

            "supportsFind", :class:`boolean`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.supportsFindObject

        .. csv-table::
            :class: details-table

            "supportsFindObject", :class:`boolean`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.supportsInsert

        .. csv-table::
            :class: details-table

            "supportsInsert", :class:`boolean`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.supportsRemove

        .. csv-table::
            :class: details-table

            "supportsRemove", :class:`boolean`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.supportsRemoveObject

        .. csv-table::
            :class: details-table

            "supportsRemoveObject", :class:`boolean`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.supportsSaveObject

        .. csv-table::
            :class: details-table

            "supportsSaveObject", :class:`boolean`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.supportsUpdate

        .. csv-table::
            :class: details-table

            "supportsUpdate", :class:`boolean`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.supportsUpdateObject

        .. csv-table::
            :class: details-table

            "supportsUpdateObject", :class:`boolean`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.updateConfig

        .. csv-table::
            :class: details-table

            "updateConfig", :class:`object`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.collections.Collection.updateObjectConfig

        .. csv-table::
            :class: details-table

            "updateObjectConfig", :class:`object`
            "Default", ``undefined``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."


Methods
=======

.. class:: carbond.collections.Collection
    :noindex:
    :hidden:

    .. function:: carbond.collections.Collection.getOperationConfig

        .. csv-table::
            :class: details-table

            "getOperationConfig (*op*)", ""
            "Arguments", "**op** (:class:`string`): Lorem ipsum dolor sit amet |br|"
            "Returns", :class:`~carbond.Operation`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."


RESTFul interface
=================

- ``/<collection>``
  
  - ``GET`` which maps to ``find``
  - ``POST`` which maps to ``insert``
  - ``PUT`` which maps to ``update``
  - ``DELETE`` which maps to ``remove``
    
- ``/<collection>/:id``
  
  -  ``GET`` which maps to ``findObject``
  -  ``PUT`` which maps to ``updateObject``
  -  ``DELETE`` which maps to ``removeObject``

Examples (synchronous)
----------------------

..  code-block:: javascript

    __(function() {
      module.exports = o({
        _type: carbon.carbond.ObjectServer,
        port: 8888,
        dbUri: "mongodb://localhost:27017/mydb",
        endpoints: {
          feedback: o({
            _type: carbon.carbond.Collection,
            insert: function(obj) {
              return this.objectserver.db.getCollection('feedback').insert(obj)
            }
          })
        }
      })
    })