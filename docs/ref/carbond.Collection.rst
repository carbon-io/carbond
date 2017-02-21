.. js:class:: Collection()
    :heading:

==================
carbond.Collection
==================

Carbond :class:`Collection`\ s provide a high-level abstraction for defining :class:`Endpoint`\ s that behave like a collection of 
resources. When you define a :class:`Collection` you define the following methods:

- ``insert(obj, reqCtx)``
- ``find(query, options, reqCtx)``
- ``update(query, obj, options, reqCtx)``
- ``remove(query, reqCtx)``
- ``findObject(id, reqCtx)``
- ``updateObject(id, reqCtx)``
- ``removeObject(id, reqCtx)``

Which results in the following tree of :class:`Endpoints` and :class:`Operations`:

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

.. js:class:: Collection()
    :noindex:
    :hidden:

    .. js:attribute:: path

        (read-only): The path to which this :class:`Collection` is bound. The path can contain variable patterns (e.g. ``'orgs/:id/members'``). The :attr:`path` property is not configured directly on :class:`Collection` objects but are specified as lvals in enclosing definitions of endpoints such as in an :class:`ObjectServer` or a parent :class:`Endpoint` object. When retrieved the value of this property will be the absolute path of the endpoint from ``/``.

    .. js:attribute:: parent

        (read-only): The parent :class:`Endpoint` of this :class:`Collection`.

    .. js:attribute:: objectserver

        (read-only): The :class:`ObjectServer` to which this endpoint belongs.

    .. js:attribute:: parameters

        A mapping of parameter names to :class:`OperationParameter` objects. Parameters defined for an :class:`Endpoint` are inherited by all operations of this :class:`Endpoint` as well as by all child :class:`Endpoint`\ s of this :class:`Endpoint`.

    .. js:attribute:: endpoints

        A set of child :class:`Endpoint` definitions. This is an object whose keys are path strings and values are instances of :class:`Endpoint`. Each path key will be interpreted as relative to this :class:`Endpoint`\ s :attr:`path` property.

Methods
=======

.. js:class:: Collection()
    :noindex:
    :hidden:

    .. js:function:: find(test)

        :arg arg1: The first argument
        :type arg1: Collection
        :returns: Something

        Foo!

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