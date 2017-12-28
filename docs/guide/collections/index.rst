===========
Collections
===========

.. toctree::
   :hidden:
  
   Operation handlers <collection-operation-handlers.rst>
   Operation configuration <collection-operation-configuration.rst>
   Operation REST interface <collection-operation-rest-interface.rst>
   Operation pre/post hooks <collection-operation-hooks.rst>
   MongoDBCollection class <mongodb-collection.rst>

Carbond :js:class:`~carbond.collections.Collection`\s provide a high-level
abstraction for defining :js:class:`~carbond.Endpoint`\s that behave like a
collection of resources. When you define a
:js:class:`~carbond.collections.Collection` you may define :doc:`handlers
<collection-operation-handlers>` for the following operations:

- ``insert(objects, options)``
- ``find(options)``
- ``save(objects, options)``
- ``update(update, options)``
- ``remove(options)``
- ``insertObject(object, options)``
- ``findObject(id, options)``
- ``saveObject(object, options)``
- ``updateObject(id, update, options)``
- ``removeObject(id, options)``

Which results in the following tree of :js:class:`~carbond.Endpoint`\s and
:js:class:`~carbond.Operation`\s:

- ``/<collection>``

  - ``POST`` which maps to :js:func:`~carbond.collections.Collection.insert` and
    :js:func:`~carbond.collections.Collection.insertObject`
  - ``GET`` which maps to :js:func:`~carbond.collections.Collection.find`
  - ``PUT`` which maps to :js:func:`~carbond.collections.Collection.save`
  - ``PATCH`` which maps to :js:func:`~carbond.collections.Collection.update`
  - ``DELETE`` which maps to :js:func:`~carbond.collections.Collection.remove`

- ``/<collection>/:<id>``

  - ``GET`` which maps to :js:func:`~carbond.collections.Collection.findObject`
  - ``PUT`` which maps to :js:func:`~carbond.collections.Collection.saveObject`
  - ``PATCH`` which maps to :js:func:`~carbond.collections.Collection.updateObject`
  - ``DELETE`` which maps to :js:func:`~carbond.collections.Collection.removeObject`

For example, here is a Collection that enables the 
:js:func:`~carbond.collections.Collection.find` operation and defines a
:doc:`handler <collection-operation-handlers>`:

.. literalinclude:: ../../code-frags/hello-world/lib/HelloService.js
    :language: javascript
    :linenos:
    :named-sections: collections-simpleCollection1,collections-simpleCollection2,collections-simpleCollection3,collections-simpleCollection4,collections-simpleCollection5,collections-simpleCollection6,collections-simpleCollection7

The Collection class handles much of the HTTP boilerplate code you would
typically have to implement to build an API. See
:doc:`collection-operation-rest-interface` for more information.

Collection Endpoints and operations - XX remove from left nav
=============================================================

:js:class:`~carbond.collections.Collection` Endpoints can be created either by 
creating an instance of a :js:class:`~carbond.collections.Collection` (most 
common) or by sub-classing (e.g. the :doc:`mongodb-collection` class). You can
configure Collections (see :ref:`collection-configuration`) via top-level properties.

Collection Endpoints can support multiple operations (e.g., ``insert``,
``insertObject``, ``find``, ``findObject``, etc.). In most cases, you should
only need to define the appropriate :doc:`operation handlers
<collection-operation-handlers>` and enable them (see
:ref:`enabling-disabling-operations`). 

If your use case requires further configuration of the Collection operation
handler (e.g. modify behavior at the HTTP level), you can use the appropriate
Collection operation config properties to do so. See
:doc:`collection-operation-configuration` for more information.

.. _enabling-disabling-operations:

Enabling / Disabling Operations
-------------------------------

:js:class:`~carbond.collections.Collection` :doc:`operation handlers
<collection-operation-handlers>` can be enabled
and disabled using the :js:class:`~carbond.collections.Collection.enabled`
property. All operations are disabled by default. To enable an operation you
have to explicitly mark it as enabled:

.. code-block:: js

    ...
    enabled: {find: true},
    ...

If you want to enable all operations, you can use the ``*`` property:

.. code-block:: js

    ...
    enabled: {'*': true},
    ...

If you want to enable all operations but the ``find`` operation: 

.. code-block:: js

    ...
    enabled: {find: false, '*': true},
    ...

When instantiating a concrete Collection implementation, you will likely have to
do little else than name the Collection and enable the operations that you want
exposed to the user:

.. todo:: why is this a mongodb collection? concrete?

.. literalinclude:: ../../code-frags/hello-world-mongodb/lib/HelloService.js
    :language: javascript
    :linenos:
    :named-sections: collections-concreteInstantiationHeader,collections-concreteInstantiationFooter


.. _collection-configuration:

Collection Configuration
------------------------

.. todo:: fix line lengths below

:js:class:`~carbond.collections.Collection`\ s support configuration at multiple
levels with two types of configuration: ``Collection``-level configuration,
which may have implications for certain Collection operations, and
``CollectionOperation``-specific configs.

The base ``Collection`` configuration consists of a few properties:

* :js:attr:`~carbond.collections.Collection.enabled` - see `Enabling / Disabling Operations`_
* :js:attr:`~carbond.collections.Collection.schema` - this is the schema for all
  objects in the Collection. It must be of type ``object`` and contain an ID
  property whose name is the same as the value of
  :js:attr:`~carbond.collections.Collection.idParameterName`.
* :js:attr:`~carbond.collections.Collection.example` - this is an example object
  in the Collection and is used for documentation.
* :js:attr:`~carbond.collections.Collection.idGenerator` - if present, this must
  be an object with at least one method: ``generateId``.  This method will be
  passed the :js:class:`~carbond.collections.Collection` instance along with the
  current :js:class:`~carbond.Request` object and should return a suitable ID
  for the object being inserted on ``insert`` or ``insertObject``.
* :js:attr:`~carbond.collections.Collection.idPathParameterName`- this is the
  name of the path parameter used to capture an object ID for object specific
  endpoints (e.g. ``/<someCollectionName>/:<idPathParameterName>``).
* :js:attr:`~carbond.collections.Collection.idParameterName` - this is the name
  of the ID property of a Collection object (e.g. ``{<idParameterName>: "foo",
  "bar": "baz"}``).
* :js:attr:`~carbond.collections.Collection.idHeaderName` - this is the name of the
  HTTP response header that will contain the EJSON serialized object ID or IDs
  when objects are created in the Collection.

Note: most of these properties already have sane defaults (see
the :js:class:`~carbond.collections.Collection` class reference for more details).

You can also configure ``CollectionOperation``-specific configs. See
:doc:`collection-operation-configuration` for more information.
