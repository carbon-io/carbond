===========
Collections
===========

.. toctree::

Carbond ``Collection``\ s provide a high-level abstraction for
defining ``Endpoint``\s that behave like a collection of
resources. When you define a ``Collection`` you may define the
following methods:

- ``insert(obj, reqCtx)``
- ``find(query, reqCtx)``
- ``update(query, update, reqCtx)``
- ``remove(query, reqCtx)``
- ``saveObject(obj, reqCtx)``
- ``findObject(id, reqCtx)``
- ``updateObject(id, update, reqCtx)``
- ``removeObject(id, reqCtx)``

Which results in the following tree of ``Endpoint``\s and ``Operation``\s:

- ``/<collection>``

  - ``POST`` which maps to ``insert``
  - ``GET`` which maps to ``find``
  - ``PATCH`` which maps to ``update``
  - ``DELETE`` which maps to ``remove``
    
- ``/<collection>/:_id``

  -  ``PUT`` which maps to ``saveObject``
  -  ``GET`` which maps to ``findObject``
  -  ``PATCH`` which maps to ``updateObject``
  -  ``DELETE`` which maps to ``removeObject``

.. _Collections: https://mongolab.com/

When defining a ``Collection``, one is not required to define all
methods. Only defined methods will be enabled. For example, here is a
collection that only defines the ``insert`` method:

..  code-block:: javascript

  __(function() {
    module.exports = o({
      _type: carbon.carbond.Service,
      port: 8888,
      dbUri: "mongodb://localhost:27017/mydb",
      endpoints: {
        feedback: o({
          _type: carbon.carbond.collections.Collection,
          // POST /feedback
          insert: function(obj) {
            return this.service.db.getCollection('feedback').insert(obj)
          }
        })
      }
    })
  })

Creating Collections
---------------------------------

``Collection`` endpoints can be created either by creating an instance
of ``Collection`` (most common) or by sub-classing (as with the
``MongoDBCollection`` class).

insert
*********************

The ``insert`` operation is used to implement how objects are inserted
into the ``Collection``. 

find
*********************
  
Enabling / disabling operations 
-------------------------------

While omiting an operation'e method is enough to disable it
(i.e. simply not defining an ``insert`` method will cause the
collection to not support inserts), you may also explicitly enable /
disable ``Collection`` operations via the ``enabled`` property. This
is useful for temporarily diabling an operation or when instantiating
or sub-classing ``Collections`` that support default implementations
for all ``Collection`` operations, such as ``MongoDBCollection``.

..  code-block:: javascript
 :linenos:
 :emphasize-lines: 10 - 14
                      
  __(function() {
    module.exports = o({
      _type: carbon.carbond.Service,
      port: 8888,
      dbUri: "mongodb://localhost:27017/mydb",
      endpoints: {
        feedback: o({
          _type: carbon.carbond.collections.Collection,

          enabled: {
            insert: false, // insert is disabled even though it is defined below
            find: true,
            '*': false,
          },
          
          insert: function(obj) { ... },
          find: function(query) { ... }
        })
      }
    })
  })

Access control 
-------------------------------

In addition to enabling / disabling operations, you may also gate
operations via access control policies.

Related resources 
-------------------------------
