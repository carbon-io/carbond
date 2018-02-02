=============================
Collection Operation Handlers
=============================

When you define a Collection, you may define handlers for the following
operations:

- ``insert(objects, options, context)``
- ``find(options, context)``
- ``save(objects, options, context)``
- ``update(update, options, context)``
- ``remove(options, context)``
- ``insertObject(object, options, context)``
- ``findObject(id, options, context)``
- ``saveObject(object, options, context)``
- ``updateObject(id, update, options, context)``
- ``removeObject(id, options, context)``

Handlers determine how various HTTP requests to a Collection are handled.
There are two types of parameters passed to each operation handler: those
required by the operation and those that augment how that operation is applied.
Required arguments are common to all Collection implementations and are
explicitly passed at the head of the parameter list, and additional parameters
are passed by the ``options`` argument.

The options parameter
=====================

.. todo:: rework

The ``options`` parameter can be thought of as an object derived from the set of
all parameters available to a particular operation minus the parameters that
correspond to required arguments to the handler.  Additionally, "all parameters"
consists of all parameters defined on each endpoint in the endpoint tree as well
as any that may be defined on the operation itself. These are merged from the
root (the service) to the leaf (the operation), with parameters defined closer
to the leaf overriding any that may have been defined closer to the root.

For example, the :js:func:`~carbond.mongodb.MongoDBCollection.update` operation
supports queries by adding another parameter called ``query`` (not to be
confused with the query string component of the URL) to the set of parameters
recognized by the endpoint. When an HTTP request is received, the ``update``
spec will be passed to the operation handler via the first parameter
(``update``), while the ``query`` spec will be passed via the ``options``
parameter as a property of that object (e.g., ``options.query``).

While the inputs and outputs to and from various operation handlers should
remain the same, the operation configuration allows you to specify behaviors
like whether the HTTP response body should contain the objects inserted or
whether "upserts" should be allowed in response to ``PATCH`` requests. See
:doc:`collection-operation-configuration` for more information.

The context parameter
=====================

The ``context`` parameter is the last parameter passed to each handler. It is
not used by ``carbond`` internally, but is provided as a convenience to pass
data between collection operation hooks (see :doc:`operation hooks
<collection-operation-hooks>`) and the various operation handlers described in
this document.

It is initialized to an empty object (e.g., ``{}``) and passed to each
hook/handler in the processing chain by the base
:js:class:`~carbond.collections.Collection` class.  Since hook methods will
generally not need to be overridden, thereby obviating the need to pass data
using this parameter, it can usually be ignored and omitted from the handler
signatures in your implementation (as is the case in the examples to follow).
However, if you do find that extending or overriding hook methods is necessary,
this parameter can come in handy (see :doc:`operation hooks
<collection-operation-hooks>` for an example of how this might be useful).

Collection operations semantics 
===============================

.. todo:: rework

The following sections describe the general semantics of each operation. The
code snippets come from the ``counter-col`` project in the ``carbond``\ 's
``code-frags`` directory. The "collection" in this case is simply meant to keep
a count associated with some "name". Also, it should be noted that the
``collection`` property in the MongoDB examples is an instance of
:js:class:`leafnode.collection.Collection`, a wrapper class that wraps the
native MongoDB driver's ``Collection`` (see `mongo driver`_ docs), and not an
instance of :js:class:`~carbond.collections.Collection`.

insert
~~~~~~

The :js:func:`~carbond.collections.Collection.insert` operation handler takes a
list of objects and persists them to the backing datastore. Each individual
object will be an EJSON blob whose structure will be validated with the
appropriate `json schema`_ as definded by
:js:attr:`~carbond.collections.Collection.schema` (note, the ID property will be
omitted from the schema when validating). By default, this schema is very loose,
just specifying that the object should be of type ``object`` and allowing for
any and all properties. Once the objects have been persisted, the list of
objects with IDs populated should be returned.

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: insert-memCacheCounterBasic
    :caption: Example implementation using in-memory cache:

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: insert-mongoCounterBasic
    :caption: Example implementation using MongoDB:

find
~~~~

The :js:func:`~carbond.collections.Colletion.find` operation handler does not
take any required arguments. Instead, the most basic implementation should
return a list of objects in the collection in natural order.

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: find-memCacheCounterBasic
    :caption: Example implementation using in-memory cache:

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: find-mongoCounterBasic
    :caption: Example implementation using MongoDB:

Additionally, the ``find`` operation can be configured to support pagination and
ID queries (see :js:attr:`~carbond.collections.FindConfig.supportsPagination`
and :js:attr:`~carbond.collections.FindConfig.supportsIdQuery`).

If pagination support is enabled, the handler should honor the parameters
indicating the subset of objects to return (e.g., ``options.skip`` and
``options.limit``).

If ID queries are supported (note, ID query support is necessary when supporting
bulk inserts), a query parameter by the same name as
:js:attr:`~carbond.collections.Collection.idParameterName` will be added and
ultimately passed to the handler via ``options[this.idParameterName]``.

The following in-memory cache example accommodates both of these options:

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: find-memCacheCounterAdvanced

.. _queryability-for-custom-collections:

Note, it may seem odd that there is no ``query`` parameter (not to be confused
with the query string component of a URI) here. The reason for this is that
:js:class:`~carbond.collections.Collection` implements the core abstraction for
a generic REST like endpoint whereas the ability to query the objects in a
collection (outside of lookup by ID, which is accomplished via the `*Object`
variants) is highly specific to that collection and how its data is stored and
organized. :js:class:`~carbond.mongodb.MongoDBCollection`, for example, does
implement queries for the ``find``, ``update``, and ``remove`` operations, as
you would expect. To implement queryability in a custom collection,
an additional parameter can be added for the specific operation using
:js:attr:`~carbond.collections.CollectionOperationConfig.additionalParameters`
(see :ref:`collection-configuration`). This will be passed down to the handler
via the ``options`` parameter.

save
~~~~

.. warning:: ``save`` is a dangerous operation and should be used with care as it
             replaces **all** objects in a collection.

The :js:func:`~carbond.collections.Collection.save` operation handler takes a list of
objects whose ID properties have been populated by the client and replaces the
entire collection with these objects. This is a dangerous operation and should
likely only be enabled in development or for super users. It should return the
list of objects that make up the new collection.

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: save-memCacheCounterBasic
    :caption: Example implementation using in-memory cache

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: save-mongoCounterBasic
    :caption: Example implementation using MongoDB:

update
~~~~~~

The :js:func:`~carbond.collections.Collection.update` operation handler takes an
``update`` spec object which should be applied to the collection as a whole.
Similar to the ``insert`` operation, the ``update`` spec object is an EJSON blob
that will be weakly validated using a default schema. To enforce a particular
structure, you can specify the update schema using the
:js:attr:`~carbond.collections.UpdateSchema.updateSchema` property.

.. _update-spec-free-form:

Note, there is no default structure or semantics for the ``update`` spec.
Instead, this is left up to the implementer for custom collections and will
likely be dictated by the backing datastore (e.g., for MongoDB, the update spec
and semantics can be found `here
<https://docs.mongodb.com/manual/reference/method/db.collection.update/#update-parameter>`_)
in the case that one is being used to persist the data.

Unlike other operations (excluding the ``remove`` operation and their ``object``
variants), the ``update`` operation's return type varies depending on whether
the underlying datastore supports "upserts" and whether the ``update`` operation
is configured to support this feature. An "upsert" can occur when an update is
issued that does not affect any records in the backing datastore. In some cases,
it is desirable to have a record created as a side effect in this situation. It
should be noted, the exact semantics of of an "upsert" can change from datastore
to datastore (see: `MongoDB's upsert semantics
<https://docs.mongodb.com/manual/reference/method/db.collection.update/#upsert-behavior>`_).
This leaves us with the following three scenarios:

1. "upserts" are not supported
2. "upserts" are supported, but the upserted document(s) can not be returned without
   a subsequent read issued to the backing datastore
3. "upserts" are supported and the upserted document(s) are returned by the
   write to the backing datastore

In scenario number 1, the handler should always return the number of documents
updated. As shorthand, the handler can simply return the number. However, the
official return type for this handler is an ``object`` with two properties:
``val`` and ``created`` (see :js:class:`~carbond.collections.UpdateResult`).
Since upserts are not supported in this scenario, you can always omit
``created`` and simply set ``val`` to the number of documents updated.

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: update-memCacheCounterBasic
    :caption: Example implementation using in-memory cache:

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: update-mongoCounterBasic
    :caption: Example implementation using MongoDB:

Scenario 2 is much like scenario 1, except you also have to take the ``created``
property into consideration. In other words, if an object is upserted, the
return value should specify the number of objects upserted and the fact that
they were created (e.g., if 2 objects were upserted, the return value should be
``{val: 2, created: true}``.

In scenario 3, we have the ability to return any documents that were upserted.
To do this, ``val`` should be set to the objects that were upserted and
``created`` should be set to ``true`` if objects were upserted. If no objects
were upserted, then the behavior is the same as the previous two scenarios
(e.g., the number of updated documents should be returned and ``created`` should
be omitted or set to ``false``).

Note, see :ref:`here <queryability-for-custom-collections>` to understand why the
ability to query a set of documents is not explicitly supported by the
``update`` operation.

remove
~~~~~~

The :js:func:`~carbond.collections.Collection.remove` operation handler does not
take any required arguments. Instead, the ``remove`` operation should simply
remove all objects in the collection. Similar to ``update`` operation,
``remove`` can be configured to return the removed objects. If this is possible
given the backing datastore, it should return the objects removed (e.g., if five
objects were removed, the return value should look something like ``[obj1, obj2,
obj3, obj4, obj4]``):

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: remove-memCacheCounterAdvanced

If not, as is the case with MongoDB, the number of objects removed should be returned:

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: remove-mongoCounterBasic

Note, see :ref:`here <queryability-for-custom-collections>` to understand why the
ability to query a set of documents is not explicitly supported by the
``remove`` operation.

insertObject
~~~~~~~~~~~~

The :js:func:`~carbond.collections.Collection.insertObject` operation handler
takes a single object as its first argument and persists it to the backing
datastore. Similar to the :js:func:`~carbond.collections.Collection.insert`
operation handler, the object will be an EJSON blob whose structure will be
validated with the appropriate `json schema`_ as definded by
:js:attr:`~carbond.collections.Collection.schema`. Once the object has been
persisted, it should be returned with its ID populated.

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: insertObject-memCacheCounterBasic
    :caption: Example implementation using in-memory cache:

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: insertObject-mongoCounterBasic
    :caption: Example implementation using MongoDB:

findObject
~~~~~~~~~~

The :js:func:`~carbond.Colletion.findObject` operation takes an ``id`` parameter and
should return the object from the collection with that ``id`` if it exists and
``null`` otherwise.

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: findObject-memCacheCounterBasic
    :caption: Example implementation using in-memory cache:

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: findObject-mongoCounterBasic
    :caption: Example implementation using MongoDB:

Note, when ``null`` or ``undefined`` is returned, this indicates that the object
does not exist and directs the collection to respond with a ``404``.

saveObject
~~~~~~~~~~

The :js:func:`~carbond.collections.Collection.saveObject` operation handler
takes a single object whose ID property has been populated by the client and
should replace the object in the collection with the same ID.

Like ``update``, ``saveObject`` can be configured to support inserts. It is left
up to the concrete implementation of the collection to decide how this is
communicated to the operation handler.
:js:class:`~carbond.mongodb.MongoDBCollection`, for instance, updates the
``options`` parameter to include ``{upsert: true}`` if inserts are allowed (see
:js:func:`leafnode.collection.Collection.findOneAndReplace`). If inserts are not
allowed and there is no object that has a matching ID, ``null`` or ``undefined``
should be returned. Otherwise, the object that was saved should be returned and
``created`` should be set to ``true``.

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: saveObject-memCacheCounterBasic
    :caption: Example implementation using in-memory cache:

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: saveObject-mongoCounterBasic
    :caption: Example implementation using MongoDB:

Note, when ``null`` or ``undefined`` is returned, this indicates that the object
does not exist and directs the collection to respond with a ``404``.

updateObject
~~~~~~~~~~~~

The :js:func:`~carbond.collections.Collection.updateObject` operation handler
takes an ``id`` and an ``update`` spec and should apply that update to an object
in the collection with a matching ID.

Similar to :js:func:`~carbond.collections.Collection.update`, the
``updateObject`` operation can be configured to support "upserts" and to return
the "upserted" document with all the same return value caveats. Additionally,
one should keep in mind that the ``update`` spec is free form and has no
specific semantics defined by :js:class:`~carbond.collections.Collection` itself
(see :ref:`here <update-spec-free-form>` for an explanation).

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: updateObject-memCacheCounterBasic
    :caption: Example implementation using in-memory cache:

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: updateObject-mongoCounterBasic
    :caption: Example implementation using MongoDB:

Note, when ``null``, ``undefined``, or ``0`` is returned, this indicates that
the object does not exist and directs the collection to respond with a ``404``.

removeObject
~~~~~~~~~~~~

The :js:func:`~carbond.collections.Collection.removeObject` operation handler
takes an ``id`` argument and should remove the object with the matching ID.
Similar to :js:func:`~carbond.collections.Collection.remove`, the return value
for this operation will depend on how the concrete implementation of the
collection is configured and if the underlying datastore supports returning the
removed object.

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: removeObject-memCacheCounterBasic
    :caption: Example implementation using in-memory cache:

.. literalinclude:: ../../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :named-sections: removeObject-mongoCounterBasic
    :caption: Example implementation using MongoDB:

Note, when ``null``, ``undefined``, or ``0`` is returned, this indicates that
the object does not exist and directs the collection to respond with a ``404``.

.. _json schema: http://json-schema.org/
.. _json patch: http://jsonpatch.com/
.. _mongo driver: http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html
