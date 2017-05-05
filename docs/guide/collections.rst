===========
Collections
===========

.. toctree::

Carbond :js:class:`~carbond.collections.Collection`\ s provide a high-level
abstraction for defining :js:class:`~carbond.Endpoint`\s that behave like a
collection of resources. When you define a
:js:class:`~carbond.collections.Collection` you may define the following
methods:

- ``insert(obj, reqCtx)``
- ``find(query, reqCtx)``
- ``update(query, update, reqCtx)``
- ``remove(query, reqCtx)``
- ``saveObject(obj, reqCtx)``
- ``findObject(id, reqCtx)``
- ``updateObject(id, update, reqCtx)``
- ``removeObject(id, reqCtx)``

Which results in the following tree of :js:class:`~carbond.Endpoint`\s and
:js:class:`~carbond.Operation`\s:

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

When defining a :js:class:`~carbond.collections.Collection`, one is not required
to define all methods. Only defined methods will be enabled. For example, here
is a collection that only defines the ``insert`` method:

.. todo:: XXX: add :lines: when the example gets fleshed out (see comment)

.. literalinclude:: ../code-frags/hello-world/lib/HelloService.js
    :language: javascript
    :linenos:
    :lines: 9-11,15-19,35-36,40-42

Creating Collections
---------------------------------

:js:class:`~carbond.collections.Collection` endpoints can be created either by
creating an instance of :js:class:`~carbond.collections.Collection` (most
common) or by sub-classing (as with the
:js:class:`carbond.mongodb.MongoDBCollection` class).

.. todo:: fill in these sections

insert
*********************

The ``insert`` operation is used to implement how objects are inserted
into the :js:class:`~carbond.collections.Collection`. 

find
*********************
  
Enabling / disabling operations 
-------------------------------

While omitting an operation's method is enough to disable it (i.e. simply not
defining an ``insert`` method will cause the collection to not support inserts),
you may also explicitly enable / disable
:js:class:`~carbond.collections.Collection` operations via the
:js:attr:`~carbond.collections.Collection.enabled` property. This is useful for
temporarily disabling an operation or when instantiating or sub-classing
:js:class:`~carbond.collections.Collections` that support default
implementations for all :js:class:`~carbond.collections.Collection` operations,
such as :js:class:`carbond.mongodb.MongoDBCollection`.

.. todo:: XXX: add :lines: when the example gets fleshed out (see comment)

.. literalinclude:: ../code-frags/hello-world/lib/HelloService.js
    :language: javascript
    :linenos:
    :lines: 9-11,15-19,30-34,36-39,42-46,49-53

Access control 
-------------------------------

In addition to enabling / disabling operations, you may also gate
operations via access control policies.

.. todo:: reference aac?


.. todo:: fill in these sections

Related resources 
-------------------------------
