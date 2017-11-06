===========
Collections
===========

.. toctree::

Carbond :js:class:`~carbond.collections.Collection`\s provide a high-level
abstraction for defining :js:class:`~carbond.Endpoint`\s that behave like a
collection of resources. When you define a
:js:class:`~carbond.collections.Collection` you may define the following
operation handler methods:

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

When defining a :js:class:`~carbond.collections.Collection`, it is not required that all
operations be implemented. Instead, only define the operations that are required
and enable them via the :js:attr:`~carbond.collections.Collection.enabled` property.
For example, here is a collection that only defines and enables the
:js:func:`~carbond.collections.Collection.find` method:

.. literalinclude:: ../code-frags/hello-world/lib/HelloService.js
    :language: javascript
    :linenos:
    :lines: 1-11,15,17,19-21,32,34-35,56-60,63-

Creating Collections
====================

:js:class:`~carbond.collections.Collection` endpoints can be created either by
creating an instance of :js:class:`~carbond.collections.Collection` (most
common) or by sub-classing (as with the
:js:class:`~carbond.mongodb.MongoDBCollection` class) and are configured through
a combination of top-level collection properties and a set of
:js:class:`~carbond.collections.CollectionOperationConfig`\ s.

In most cases, you should only need to define the appropriate operation handlers
(e.g., ``insert``, ``insertObject``, ``find``, ``findObject``, etc.) and enable
them via the :js:attr:`~carbond.collections.Collection.enabled` property.
Further configuration of the behavior of each operation at the HTTP level should
be done using the appropriate collection operation config property (e.g.,
:js:class:`~carbond.collections.Collection.insertConfig`). While the inputs and
outputs to and from the operation handlers should remain the same, the
configuration allows you to specify behaviors like whether the HTTP response
body should contain the objects inserted or whether "upserts" should be allowed
in response to ``PATCH`` requests (see: `Collection Configuration`_).

There are two types of parameters passed to each operation handler, those that
are required by the operation and those that serve to augment how that operation
is applied. Required arguments are common to all collection implementations and
are explicitly passed at the head of the parameter list (e.g., ``id`` and
``update`` for the :js:func:`~carbond.collections.Collection..updateObject``
operation). Additional parameters are passed via the ``options``
argument. For example, the :js:func:`~carbond.mongodb.MongoDBCollection.update`
operation supports queries by adding another parameter called ``query`` (not to
be confused with the query string component of the URL) to the set of parameters
recognized by the endpoint. When an HTTP request is received, the ``update`` spec
will be passed to the operation handler via the first parameter (``update``),
while the ``query`` spec will be passed via the ``options`` parameter as a
property of that object (e.g., ``options.query``).

Taking a quick step back, ``options`` can be thought of as simply an object
derived from the set of all parameters available to a particular operation minus
the parameters that correspond to required arguments to the handler.
Additionally, "all parameters" consists of all parameters defined on each
endpoint in the endpoint tree as well as any that may be defined on the
operation itself. These are merged from the root (the service) to the leaf
(the operation), with parameters defined closer to the leaf overriding any
that may have been defined closer to the root.

The following sections describe the general semantics of each operation.

Collection Operation Handlers
-----------------------------

The code snippets in the following sections come from the ``counter-col``
project in the ``carbond``\ 's ``code-frags`` directory. The "collection" in
this case is simply meant to keep a count associated with some "name". Also, it
should be noted that the ``collection`` property in the MongoDB examples is an
instance of :js:class:`leafnode.collection.Collection`, a wrapper class that
wraps the native MongoDB driver's ``Collection`` (see `mongo driver`_ docs), and
not an instance of :js:class:`~carbond.collections.Collection`.

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

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-insert-memCacheCounterBasic
    :end-before: post-insert-memCacheCounterBasic
    :caption: Example implementation using in-memory cache:

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-insert-mongoCounterBasic
    :end-before: post-insert-mongoCounterBasic
    :caption: Example implementation using MongoDB:

find
~~~~

The :js:func:`~carbond.collections.Colletion.find` operation handler does not
take any required arguments. Instead, the most basic implementation should
return a list of objects in the collection in natural order.

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-find-memCacheCounterBasic
    :end-before: post-find-memCacheCounterBasic
    :caption: Example implementation using in-memory cache:

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-find-mongoCounterBasic
    :end-before: post-find-mongoCounterBasic
    :caption: Example implementation using MongoDB:

Additionally, the ``find`` operation can be configured to support pagination and
ID queries (see :js:attr:`~carbond.collections.FindConfig.supportsPagination`
and :js:attr:`~carbond.collections.FindConfig.supportsIdQuery`).

If pagination support is enabled, the handler should honor the parameters
indicating the subset of objects to return (e.g., ``options.skip`` and
``options.limit``).

If ID queries are supported (note, ID query support is necessary when supporting
bulk inserts), a query parameter by the same name as
:js:attr:`~carbond.collections.Collection.idParameter` will be added and
ultimately passed to the handler via ``options[this.idParameter]``.

The following in-memory cache example accommodates both of these options:

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-find-memCacheCounterAdvanced
    :end-before: post-find-memCacheCounterAdvanced

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

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-save-memCacheCounterBasic
    :end-before: post-save-memCacheCounterBasic
    :caption: Example implementation using in-memory cache:

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-save-mongoCounterBasic
    :end-before: post-save-mongoCounterBasic
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

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-update-memCacheCounterBasic
    :end-before: post-update-memCacheCounterBasic
    :caption: Example implementation using in-memory cache:

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-update-mongoCounterBasic
    :end-before: post-update-mongoCounterBasic
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

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-remove-memCacheCounterAdvanced
    :end-before: post-remove-memCacheCounterAdvanced

If not, as is the case with MongoDB, the number of objects removed should be returned:

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-remove-mongoCounterBasic
    :end-before: post-remove-mongoCounterBasic

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

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-insertObject-memCacheCounterBasic
    :end-before: post-insertObject-memCacheCounterBasic
    :caption: Example implementation using in-memory cache:

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-insertObject-mongoCounterBasic
    :end-before: post-insertObject-mongoCounterBasic
    :caption: Example implementation using MongoDB:

findObject
~~~~~~~~~~

The :js:func:`~carbond.Colletion.findObject` operation takes an ``id`` parameter and
should return the object from the collection with that ``id`` if it exists and
``null`` otherwise.

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-findObject-memCacheCounterBasic
    :end-before: post-findObject-memCacheCounterBasic
    :caption: Example implementation using in-memory cache:

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-findObject-mongoCounterBasic
    :end-before: post-findObject-mongoCounterBasic
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

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-saveObject-memCacheCounterBasic
    :end-before: post-saveObject-memCacheCounterBasic
    :caption: Example implementation using in-memory cache:

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-saveObject-mongoCounterBasic
    :end-before: post-saveObject-mongoCounterBasic
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

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-updateObject-memCacheCounterBasic
    :end-before: post-updateObject-memCacheCounterBasic
    :caption: Example implementation using in-memory cache:

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-updateObject-mongoCounterBasic
    :end-before: post-updateObject-mongoCounterBasic
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

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-removeObject-memCacheCounterBasic
    :end-before: post-removeObject-memCacheCounterBasic
    :caption: Example implementation using in-memory cache:

.. literalinclude:: ../code-frags/counter-col/lib/CounterCol.js
    :language: javascript
    :linenos:
    :dedent: 8
    :start-after: pre-removeObject-mongoCounterBasic
    :end-before: post-removeObject-mongoCounterBasic
    :caption: Example implementation using MongoDB:

Note, when ``null``, ``undefined``, or ``0`` is returned, this indicates that
the object does not exist and directs the collection to respond with a ``404``.

Enabling / Disabling Operations
-------------------------------

As previously mentioned, a :js:class:`~carbond.collections.Collection`'s
operations can be enabled and disabled using the
:js:class:`~carbond.collections.Collection.enabled` property. Note, all
operations are disabled by default, so, to enable an operation you will
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

If you want to enable all but the ``find`` operation, you could do something
like:

.. code-block:: js

    ...
    enabled: {find: false, '*': true},
    ...

When instantiating a concrete collection implementation, you will likely have to
do little else than name the collection and enable the operations that you want
exposed to the user:

.. literalinclude:: ../code-frags/hello-world-mongodb/lib/HelloService.js
    :language: javascript
    :linenos:
    :lines: 1-12,14,16-


.. _collection-configuration:

Collection Configuration
------------------------

:js:class:`~carbond.collections.Collection`\ s support configuration at multiple
levels with two types of configuration: ``Collection`` level configuration,
which may have implications for certain collection operations, and
``CollectionOperation`` specific configs.

The base ``Collection`` configuration consists of a few properties:

    :js:attr:`~carbond.collections.Collection.enabled`
        See `Enabling / Disabling Operations`_
    :js:attr:`~carbond.collections.Collection.schema`
        This is the schema for all objects in the collection. It must be of type
        ``object`` and contain an ID property whose name is the same as the
        value of :js:attr:`~carbond.collections.Collection.idParameter`.
    :js:attr:`~carbond.collections.Collection.example`
        This is an example object in the collection and is used for
        documentation.
    :js:attr:`~carbond.collections.Collection.idGenerator`
        If present, this must be an object with at least one method:
        ``generateId``.  This method will be passed the
        :js:class:`~carbond.collections.Collection` instance along with the
        current :js:class:`~carbond.Request` object and should return a suitable
        ID for the object being inserted on ``insert`` or ``insertObject``.
    :js:attr:`~carbond.collections.Collection.idPathParameter`
        This is the name of the path parameter used to capture an object ID for
        object specific endpoints (e.g.,
        ``/<someCollectionName>/:<idPathParameter>``).
    :js:attr:`~carbond.collections.Collection.idParameter`
        This is the name of the ID property of a collection object (e.g.,
        ``{<idParameter>: "foo", "bar": "baz"}``).
    :js:attr:`~carbond.collections.Collection.idHeader`
        This is the name of the HTTP response header that will contain the EJSON
        serialized object ID or IDs when objects are created in the collection.

Note, most of these properties already have sane defaults (see:
:js:class:`~carbond.collections.Collection` for more details).

``CollectionOperation`` specific configs should be set on the ``Collection``. If
they are omitted, and an operation is enabled, they will be instantiated as if
they were initialized as ``{}`` using the appropriate
:js:class:`~carbond.collections.CollectionOperationConfig` subclass (e.g. if
:js:attr:`~carbond.collections.Collection.insertConfig` is left as ``undefined``,
it will be instantiated as ``o({}, this.InsertConfigClass)``, where
``this.InsertConfigClass`` is a class member that allows subclasses of
:js:class:`carbond.collection.Collection` to override the default config class).
Operations should be configured with the following properties:

- :js:attr:`~carbond.collections.Collection.insertConfig`
- :js:attr:`~carbond.collections.Collection.findConfig`
- :js:attr:`~carbond.collections.Collection.saveConfig`
- :js:attr:`~carbond.collections.Collection.updateConfig`
- :js:attr:`~carbond.collections.Collection.removeConfig`
- :js:attr:`~carbond.collections.Collection.insertObjectConfig`
- :js:attr:`~carbond.collections.Collection.findObjectConfig`
- :js:attr:`~carbond.collections.Collection.saveObjectConfig`
- :js:attr:`~carbond.collections.Collection.updateObjectConfig`
- :js:attr:`~carbond.collections.Collection.removeObjectConfig`

Collection Operation Configuration
----------------------------------

As mentioned in the previous section, when instantiating an instance of
:js:class:`~carbond.collections.Collection`, you can configure each operation
using the config property for that operation (e.g.
:js:attr:`~carbond.collections.Collection.insertConfig` for the ``insert``
operation). When defining the config, you can either explicitly instantiate a
config instance using the appropriate config class (e.g.,
:js:class:`~carbond.collections.InsertConfig` for the ``insert`` operation):

.. code-block:: js

    insertConfig: o({
      _type: carbond.collections.MyCustomInsertConfig,
      description: "My collection's insert operation",
      additionalParameters: {
        foo: {
          name: "foo",
          location: "query",
          schema: {
            type: "string"
          }
        }
      }
    })

Or you can simply define an object that will be instantiated using a default
config class for that operation (in this case,
:js:class:`~carbond.collections.InsertConfig` by way of
:js:attr:`~carbond.collections.Collection.InsertConfigClass`):

.. code-block:: js

    insertConfig: {
      description: "My collection's insert operation",
      additionalParameters: {
        foo: {
          name: "foo",
          location: "query",
          schema: {
            type: "string"
          }
        }
      }
    }

:js:class:`~carbond.collections.Collection` defines default config classes for
each operation as class members:

- :js:attr:`~carbond.collections.Collection.InsertConfigClass`
- :js:attr:`~carbond.collections.Collection.FindConfigClass`
- :js:attr:`~carbond.collections.Collection.SaveConfigClass`
- :js:attr:`~carbond.collections.Collection.UpdateConfigClass`
- :js:attr:`~carbond.collections.Collection.RemoveConfigClass`
- :js:attr:`~carbond.collections.Collection.InsertObjectConfigClass`
- :js:attr:`~carbond.collections.Collection.FindObjectConfigClass`
- :js:attr:`~carbond.collections.Collection.SaveObjectConfigClass`
- :js:attr:`~carbond.collections.Collection.UpdateObjectConfigClass`
- :js:attr:`~carbond.collections.Collection.RemoveObjectConfigClass`

Subclasses that require additional parameters for certain operations or that can
not support certain features (e.g., returning removed objects), should subclass
the individual config classes and override these member properties in the
subclass. When the subclass is instantiated, it will use these overridden config
classes instead of the default ones as defined on
:js:class:`~carbond.collections.Collection`.

CollectionOperationConfig
~~~~~~~~~~~~~~~~~~~~~~~~~

:js:class:`~carbond.collections.CollectionOperationConfig` is the base class for
all collection configs. It defines basic properties that are common to all
operation configs like:

- :js:attr:`~carbond.collections.CollectionOperationConfig.description`
- :js:attr:`~carbond.collections.CollectionOperationConfig.noDocument`
- :js:attr:`~carbond.collections.CollectionOperationConfig.allowUnauthenticated`
- :js:attr:`~carbond.collections.CollectionOperationConfig.parameters`
- :js:attr:`~carbond.collections.CollectionOperationConfig.additionalParameters`
- :js:attr:`~carbond.collections.CollectionOperationConfig.responses`
- :js:attr:`~carbond.collections.CollectionOperationConfig.endpoint`
- :js:attr:`~carbond.collections.CollectionOperationConfig.options`

InsertConfig
~~~~~~~~~~~~

The :js:class:`~carbond.collections.InsertConfig` class is the base ``insert``
operation config class and the default for
:js:class:`~carbond.collections.Collection`. It can be used to configure whether
or not inserted objects are returned
(:js:attr:`~carbond.collection.InsertConfig.returnsInsertedObjects`) in the
response body and to define a schema separate from the collection level schema
that will be used to verify incoming objects
(:js:attr:`~carbond.collection.InsertConfig.insertSchema`).

.. code-block:: js

    ...
    insertConfig: {
      description: 'My collection insert operation',
      returnsInsertedObjects: false,
      insertSchema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            foo: {type: 'boolean'},
            bar: {type: 'number'}
          },
          required: ['foo'],
          additionalProperties: {type: 'string'}
        }
      }
    },
    ...

In the previous example, the ``insert`` operation on this collection will not
return the objects that were inserted and each incoming object must contain at
least the ``foo`` property.

FindConfig
~~~~~~~~~~

The :js:class:`~carbond.collections.FindConfig` class is the base ``find``
operation config class and the default for
:js:class:`~carbond.collections.Collection`. By default, the ``find`` operation
supports ID queries and pagination. ID queries on the ``find`` operation are
used by Carbon to communicate the location (i.e., the ``Location`` header) of
objects in response to a bulk insert. If this is disabled, then the ``insert``
operation should likely be disabled as well (note, ``insertObject`` makes use of
the ID path parameter instead). Enabling pagination adds the ``page`` parameter
to the list of parameters for the collection operation. Note, the ``find`` operation
parameter list includes two more parameters: ``skip`` and ``limit``. When
pagination is enabled, it will be transparent to the operation handlers
themselves. Instead, :js:class:`~carbond.collections.Collection` will update
``options.skip`` and ``options.limit`` to reflect the page start and size. This
allows the handler to be implemented without concern for whether pagination is
enabled or not.

.. code-block:: js

    ...
    findConfig: {
      description: 'My collection find operation',
      supportsIdQuery: false,
      supportsPagination: false
    },
    ...

In the previous example, ID queries and pagination are disabled. This will
result in the omission of both parameters from the collection operation
parameters list that are used to support these features (note, ``skip`` and
``limit`` will still be present, but ``page`` will not be honored).

SaveConfig
~~~~~~~~~~

The :js:class:`~carbond.collections.SaveConfig` class is the base ``save``
operation config class and the default for
:js:class:`~carbond.collections.Collection`. Similar to
:js:class:`~carbond.collections.InsertConfig`, this config class allows you to
specify a separate schema for the objects being saved and whether or not the
objects saved are returned in the response.

.. code-block:: js

    ...
    saveConfig: {
      description: 'My collection save operation',
      returnsSavedObjects: false,
      saveSchema: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          foo: {type: 'boolean'},
          bar: {type: 'number'}
        },
        required: ['_id', 'foo'],
        additionalProperties: {type: 'string'}
      }
    },
    ...

Note, unlike :js:attr:`~carbond.collections.InsertConfig.insertSchema`, it is
necessary to specify the ID parameter (``_id`` in this case) on ``saveSchema``.
Note, it should have the same name as
:js:attr:`~carbond.collections.Collection.idParameter` or an error will be thrown
on initialization.

UpdateConfig
~~~~~~~~~~~~

The :js:class:`~carbond.collections.UpdateConfig` class is the base ``update``
operation config class and the default for
:js:class:`~carbond.collections.Collection`. It allows you to configure an
update schema, whether or not upserts are supported, and whether upserted
objects are returned in the response body. The update schema is "loose" by
default and only specifies that it should be an ``object``. This should be
tailored depending on the update scheme that your collection/datastore
understands (e.g., `json patch`_). If upserts are enabled, an ``upsert``
parameter will be added to the list of parameters for the collection operation.

.. code-block:: js

    ...
    updateConfig: {
      description: 'My collection update operation',
      supportsUpsert: false,
      updateSchema: {
        oneOf: [
          {
            type: 'object',
            properties: {
              inc: {
                type: object,
                minProperties: 1,
                additionalProperties: {
                  type: 'integer',
                  minimum: 1
                }
              },
              requiredProperties: ['inc'],
              additionalProperties: false
            },
            {
              type: 'object',
              dec: {
                type: object,
                minProperties: 1,
                additionalProperties: {
                  type: 'integer',
                  minimum: 1
                }
              },
              requiredProperties: ['dec'],
              additionalProperties: false
            }
          }
        ]
      }
    }
    ...

The example config above disallows upserts and specifies a simple schema that
allows updates to increment or decrement properties in the collection by an
arbitrary amount (e.g.  ``{inc: {foo: 5}}`` or ``{dec: {foo: 1}}``).

RemoveConfig
~~~~~~~~~~~~

The :js:class:`~carbond.collections.RemoveConfig` class is the base ``remove``
operation config class and the default for
:js:class:`~carbond.collections.Collection`. It allows you to configure whether
or not removed objects are returned.

.. code-block:: js

    ...
    removeConfig: {
      description: 'My collection remove operation',
      returnsRemovedObjects: true
    }
    ...

InsertObjectConfig
~~~~~~~~~~~~~~~~~~

The :js:class:`~carbond.collections.InsertObjectConfig` class is the base
``insertObject`` operation config class and the default for
:js:class:`~carbond.collections.Collection`. This config follows the same
pattern as :js:attr:`~carbond.collections.InsertConfig`, allowing you to
configure a schema specific to this operation and to specify whether the
inserted object should be returned or not.

.. code-block:: js

    ...
    insertObjectConfig: {
      description: 'My collection insertObject operation',
      returnsInsertedObject: false,
      insertObjectSchema: {
        type: 'object',
        properties: {
          foo: {type: 'boolean'},
          bar: {type: 'number'}
        },
        required: ['foo'],
        additionalProperties: {type: 'string'}
      }
    },
    ...

FindObjectConfig
~~~~~~~~~~~~~~~~

The :js:class:`~carbond.collections.FindObjectConfig` class is the base ``findObject``
operation config class and the default for
:js:class:`~carbond.collections.Collection`.

.. code-block:: js

    ...
    findObjectConfig: {
      description: 'My collection findObject operation'
    },
    ...

SaveObjectConfig
~~~~~~~~~~~~~~~~

The :js:class:`~carbond.collections.SaveObjectConfig` class is the base
``saveObject`` operation config class and the default for
:js:class:`~carbond.collections.Collection`. Like previous config classes, it
allows you to set a specific schema for the incoming object (again, an ID
property is required). Additionally, like the ``update`` config class, the
``saveObject`` operation can be configured to create objects in the collection
(this is the default) and to return the object in the response to the client.
Note, unlike ``saveObject``, the ``save`` operation never "creates" objects
since it is an operation at the collection level. Instead, it "replaces" the
collection.

.. code-block:: js

    ...
    saveObjectConfig: {
      description: 'My collection saveObject operation',
      supportsUpsert: false,
      returnsSavedObject: false
    }
    ...

UpdateObjectConfig
~~~~~~~~~~~~~~~~~~

The :js:class:`~carbond.collections.UpdateObjectConfig` class is the base
``updateObject`` operation config class and the default for
:js:class:`~carbond.collections.Collection`. Like
:js:class:`~carbond.collections.UpdateConfig`, this config allows you to specify
an update spec schema, whether or not upserts are allowed, and, if they are
allowed, whether an object is returned if an upsert takes place.

.. code-block:: js

    ...
    updateObjectConfig: {
      description: 'My collection updateObject operation',
      supportsUpsert: true,
      returnsUpsertedObject: true,
      updateSchema: {
      updateSchema: {
        oneOf: [
          {
            type: 'object',
            properties: {
              inc: {
                type: object,
                minProperties: 1,
                additionalProperties: {
                  type: 'integer',
                  minimum: 1
                }
              },
              requiredProperties: ['inc'],
              additionalProperties: false
            },
            {
              type: 'object',
              dec: {
                type: object,
                minProperties: 1,
                additionalProperties: {
                  type: 'integer',
                  minimum: 1
                }
              },
              requiredProperties: ['dec'],
              additionalProperties: false
            }
          }
        ]
      }
    },
    ...

RemoveObjectConfig
~~~~~~~~~~~~~~~~~~

The :js:class:`~carbond.collections.RemoveObjectConfig` class is the base
``removeObject`` operation config class and the default for
:js:class:`~carbond.collections.Collection`. This config offers essentially the
same configuration parameters as
:js:class:`~carbond.collections.RemoveObjectConfig`.

.. code-block:: js

    ...
    removeObjectConfig: {
      description: 'My collection remove operation',
      returnsRemovedObject: true
    }
    ...

Collection Operation (REST) Interface
=====================================

Up until this point, we have described the implementation and configuration
of various operations and their handlers and only alluded to the HTTP/REST
semantics of each operation. :js:class:`~carbond.collections.Collection`
endeavors to handle much of the HTTP boilerplate code that you would have to
implement to build your API. The following sections aim to clarify the behavior
of :js:class:`~carbond.collection.Collection` operations at the HTTP layer.

POST /<collection>
------------------

``POST`` is one of the more interesting HTTP verbs in the context of a Carbon
collection. Unlike the rest of the HTTP verbs, ``POST`` is only allowed on the
collection URL (e.g., ``/<collection>``) and not a collection object URL (e.g.
``/<collection>/:<id>``). Instead ``POST``\ ing to the collection supports both
the ``insert`` and the ``insertObject`` operations (if enabled), routing the
request to the appropriate handler based on the type of the body.

In the following tables, ``bulk`` will refer to requests whose body is an
``array`` and ``object`` will refer to requests whose body is a single
``object``.

.. list-table:: Request Parameters
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Request Type
      - Location
      - Description
    * - ``body``
      - ``bulk``
      - body
      - An ``array`` of objects
    * - ``body``
      - ``object``
      - body
      - An ``object``

.. list-table:: Response Headers
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Request Type
      - Description
    * - ``Location``
      - ``bulk``
      - Contains the URL to retrieve all inserted objects in ID query format
        (see: `FindConfig`_)
    * - ``Location``
      - ``object``
      - Contains the object URL
    * - :js:attr:`~carbond.collections.Collection.idHeader`
      - ``bulk``
      - Contains the EJSON serialized IDs of the inserted objects
    * - :js:attr:`~carbond.collections.Collection.idHeader`
      - ``object``
      - Contains the EJSON serialized ID of the inserted object

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Request Type
      - Description
    * - ``201``
      - ``bulk``
      - The objects were successfully inserted. The response body will contain
        the objects if configured.
    * - ``201``
      - ``object``
      - The object was successfully inserted. The response body will contain the
        object if configured.
    * - ``400``
      - ``bulk`` and ``object``
      - The request was malformed
    * - ``403``
      - ``bulk`` and ``object``
      - The request is not authorized
    * - ``500``
      - ``bulk`` and ``object``
      - There was an internal error processing the request

GET /<collection>
-----------------

.. list-table:: Request Parameters (note, ``<idParameter>`` is configurable on ``Collection``)
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Location
      - Description
    * - <:js:attr:`~carbond.collections.Collection.idParameter`>
      - query
      - Contains the IDs of objects to be retrieved. This parameter is only
        present if :js:attr:`~carbond.collections.FindConfig.supportsIdQuery` is
        ``true``.
    * - ``page``
      - query
      - Contains the page number from which objects are to be retrieved. This
        parameter is only present if
        :js:attr:`~carbond.collections.FindConfig.supportsPagination` is true
    * - ``pageSize``
      - query
      - Specifies the number of objects per page. This is only present if
        :js:attr:`~carbond.collections.FindConfig.supportsPagination` is true.
        The default value for page size is configured using
        :js:attr:`~carbond.collections.FindConfig.pageSize`
        (note, if :js:attr:`~carbond.collections.FindConfig.maxPageSize` is
        specified, then the minimum of the two will be used)
    * - ``skip``
      - query
      - The number of objects in the collection to skip before returning results
    * - ``limit``
      - query
      - The maximum number of objects to return in a result

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Description
    * - ``200``
      - The response body will contain a list of objects in the collection
        subject to the parameters passed in the request
    * - ``400``
      - The request was malformed
    * - ``403``
      - The request is not authorized
    * - ``500``
      - There was an internal error processing the request

PUT /<collection>
-----------------

.. list-table:: Request Parameters
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Location
      - Description
    * - ``body``
      - body
      - A list of objects to replace to collection

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Description
    * - ``200``
      - The collection was successfully replaced. The new collection will be
        returned in the response if
        :js:attr:`~carbond.collections.SaveConfig.returnsSavedObjects` is
        ``true``.
    * - ``204``
      - The collection was successfully replaced. The response body will be
        empty if
        :js:attr:`~carbond.collections.SaveConfig.returnsSavedObjects` is
        ``false``.
    * - ``400``
      - The request was malformed
    * - ``403``
      - The request is not authorized
    * - ``500``
      - There was an internal error processing the request


PATCH /<collection>
-------------------

.. list-table:: Request Parameters
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Location
      - Description
    * - ``update``
      - body
      - An update spec
    * - ``upsert``
      - query
      - A boolean value indicating whether an upsert is desired. This parameter
        is only present if
        :js:attr:`~carbond.collections.UpdateConfig.supportsUpsert` is true.

.. list-table:: Response Headers
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Description
    * - ``Location``
      - Contains the URL to retrieve all upserted objects in ID query format
        (see: `FindConfig`_)
    * - :js:attr:`~carbond.collections.Collection.idHeader`
      - Contains the EJSON serialized IDs of the upserted objects

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Description
    * - ``200``
      - Objects were successfully updated. The number of updated objects will be
        returned in the body.
    * - ``201``
      - Objects were successfully upserted. This is only possible if
        :js:attr:`~carbond.collections.UpdateConfig.supportsUpsert` is true. The
        number of updated objects will be returned if
        :js:attr:`~carbond.collections.UpdateConfig.returnsUpsertedObjects` is
        false, otherwise the objects will be returned in the response body.
    * - ``400``
      - The request was malformed
    * - ``403``
      - The request is not authorized
    * - ``500``
      - There was an internal error processing the request

DELETE /<collection>
--------------------

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Description
    * - ``200``
      - Returns the list of objects removed in the response body if
        :js:attr:`~carbond.collections.RemoveConfig.returnsRemovedObjects` is
        ``true`` or the number of objects removed if not.
    * - ``400``
      - The request was malformed
    * - ``403``
      - The request is not authorized
    * - ``500``
      - There was an internal error processing the request

GET /<collection>/:<id>
-----------------------

.. list-table:: Request Parameters (note, ``idPathParameter`` is configurable on ``Collection``)
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Location
      - Description
    * - <:js:attr:`~carbond.collections.Collection.idPathParameter`>
      - path
      - The ID component of the collection object URL. Identifies a specific
        object in the collection.

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Description
    * - ``200``
      - The response body will contain the object whose ID matches the value
        passed in <:js:attr:`~carbond.collections.Collection.idPathParameter`>
    * - ``400``
      - The request was malformed
    * - ``403``
      - The request is not authorized
    * - ``404``
      - The object was not found
    * - ``500``
      - There was an internal error processing the request

PUT /<collection>/:<id>
-----------------------

.. list-table:: Request Parameters (note, ``idPathParameter`` is configurable on ``Collection``)
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Location
      - Description
    * - <:js:attr:`~carbond.collections.Collection.idPathParameter`>
      - path
      - The ID component of the collection object URL. Identifies a specific
        object in the collection.
    * - ``body``
      - body
      - An object to save

.. list-table:: Response Headers
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Description
    * - ``Location``
      - Contains the URL of the new object. Note, this is only possible if
        :js:attr:`~carbond.collections.SaveObjectConfig.supportsUpsert` is ``true``.
    * - :js:attr:`~carbond.collections.Collection.idHeader`
      - Contains the EJSON serialized ID of the new object. Note, this is only
        possible if
        :js:attr:`~carbond.collections.SaveObjectConfig.supportsUpsert` is ``true``.

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Description
    * - ``200``
      - The response body will contain the saved object. This response code is
        only possible if
        :js:attr:`~carbond.collections.SaveObjectConfig.returnsSavedObject` is
        ``true``.
    * - ``201``
      - This response code is only possible if
        :js:attr:`~carbond.collections.SaveObjectConfig.supportsUpsert` is
        ``true``. If
        :js:attr:`~carbond.collections.SaveObjectConfig.returnsSavedObject` is
        ``true``, the new object will be returned, otherwise the response body
        will be empty.
    * - ``204``
      - The response body will be empty. This response code is
        only possible if
        :js:attr:`~carbond.collections.SaveObjectConfig.returnsSavedObject` is
        ``false``.
    * - ``400``
      - The request was malformed
    * - ``403``
      - The request is not authorized
    * - ``404``
      - The object was not found. This response code is only possible if
        :js:attr:`~carbond.collections.SaveObjectConfig.supportsUpsert` is
        ``false``.
    * - ``500``
      - There was an internal error processing the request

PATCH /<collection>/:<id>
-------------------------

.. list-table:: Request Parameters (note, ``idPathParameter`` is configurable on ``Collection``)
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Location
      - Description
    * - <:js:attr:`~carbond.collections.Collection.idPathParameter`>
      - path
      - The ID component of the collection object URL. Identifies a specific
        object in the collection.
    * - ``update``
      - body
      - An update spec
    * - ``upsert``
      - query
      - A boolean value indicating whether an upsert is desired. This parameter
        is only present if
        :js:attr:`~carbond.collections.UpdateObjectConfig.supportsUpsert` is true.

.. list-table:: Response Headers
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Description
    * - ``Location``
      - Contains the URL of the upserted object
    * - :js:attr:`~carbond.collections.Collection.idHeader`
      - Contains the EJSON serialized ID of the upserted object

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Description
    * - ``200``
      - The object was successfully updated. The number of updated objects (1) will be
        returned in the body.
    * - ``201``
      - The object was successfully upserted. This is only possible if
        :js:attr:`~carbond.collections.UpdateObjectConfig.supportsUpsert` is true. The
        number of updated objects (1) will be returned if
        :js:attr:`~carbond.collections.UpdateObjectConfig.returnsUpsertedObject` is
        false, otherwise the object will be returned in the response body.
    * - ``400``
      - The request was malformed
    * - ``403``
      - The request is not authorized
    * - ``404``
      - The object was not found. This response code is only possible if
        :js:attr:`~carbond.collections.UpdateObjectConfig.supportsUpsert` is
        ``false``.
    * - ``500``
      - There was an internal error processing the request

REMOVE /<collection>/:<id>
--------------------------

.. list-table:: Request Parameters (note, ``idPathParameter`` is configurable on ``Collection``)
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Location
      - Description
    * - <:js:attr:`~carbond.collections.Collection.idPathParameter`>
      - path
      - The ID component of the collection object URL. Identifies a specific
        object in the collection.

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Description
    * - ``200``
      - The object was successfully removed. If
        :js:attr:`~carbond.collections.RemoveObjectConfig.returnsRemovedObject`
        is true, the body will contain the object, otherwise the number of
        removed objects (1) will be returned.
    * - ``400``
      - The request was malformed
    * - ``403``
      - The request is not authorized
    * - ``404``
      - The object was not found
    * - ``500``
      - There was an internal error processing the request

Collection Operation Pre/Post Hooks (Advanced)
==============================================

As was mentioned before, you should generally only have to implement the
operation handler methods and apply the appropriate configuration to your
:js:class:`~carbond.collections.Collection` instance to achieve the desired
behavior. Despite this, you may find that you need more flexibility in certain
situations, especially when instantiating a concrete collection implementation.
To allow for this, there are four hooks that you can override to change the
behavior of a collection operation. These hooks have the following signatures
and are called for each operation in the order listed, with the handler
being called between ``pre<OPERATION NAME>`` and ``post<OPERATION NAME>``.

- ``pre<OPERATION NAME>Operation(config, req, res)``
- ``pre<OPERATION NAME>(<REQUIRED OPERATION PARAMETERS>, options)``
- ``post<OPERATION NAME>(result, <REQUIRED OPERATION PARAMETERS>, options)``
- ``post<OPERATION NAME>Operation(result, config, req, res)``

Where ``<OPERATION NAME>`` is the name of the operation with the first letter
capitalized (e.g., ``InsertObject`` for the ``insertObject`` operation) and
``<REQUIRED OPERATION PARAMETERS>`` are the leading required parameters in each
operation handler signature (e.g., ``id`` and ``update`` in the case of
:js:func:`~carbond.collections.Collection.updateObject`).

Each of these hooks has a generic implementation for each operation in
:js:class:`~carbond.collections.Collection` and will be described in the
following sections.

.. todo:: add pointer to zipcodes example using MongoDBCollection

pre<OPERATION NAME>Operation
----------------------------

The base ``pre<OPERATION NAME>Operation`` hooks are responsible for building the
``options`` parameter based on the incoming request and config
for this operation. As such, the return value of these methods should be
the initialized ``options`` parameter that will be passed on to the handler. It should be
noted that at this step, ``options`` should contain *all* parameters that will
be passed to the operation handler (e.g., for the ``updateObject`` operation,
``preUpdateObjectOperation`` would return a ``options`` object that contained the ID
parameter, ``update`` parameter, along with any other parameters or context that
may be relevant). In general, ``options`` is simply assigned ``req.parameters``.

The :js:func:`~carbond.collections.Collection.preInsertObjectOperation` method,
for instance, validates that the ID property is not present in the object to be
inserted into the collection. Additionally, if
:js:attr:`~carbond.collections.Collection.idGenerator` is present, it will call
its ``generateId`` method and set the ID for the incoming object that will
ultimately be passed to the operation handler method.

It should be noted, that required parameters to an operation handler (``object``
in the case of ``insertObject(object, options)``) should remain in the
``options`` object at this step as they will be extracted from ``options`` and
passed as the leading parameters to the handler.

As an example, let's say that we want objects in a collection belonging to
separate users to appear as if they share the same IDs (e.g. user "foo" would
see a different object than user "bar" when making a request to
``/collection/1``). You could extend ``preFindObjectOperation`` as follows:

.. code-block:: js

    preFindObjectOperation(config, req, res) {
      var options = Collection.prototype.preFindObjectOperation.call(this, config, req, res)
      var idPrefix = getUserIdPrefix(req.user)
      options[this.idPathParameter] = idPrefix + '-' + options[this.idPathParameter]
      return options
    }

pre<OPERATION NAME>
-------------------

The base ``pre<OPERATION NAME>`` hooks have the same signature as the operation
handler (e.g., ``preInsert(objects, options)``) and are no-ops that
simply pass through their arguments. The requirements for return value when
overriding are loose. You can either augment the parameters by side-effect and
return nothing or override parameters by returning an object whose keys match
the parameter names and whose values are the updated parameters. You can omit
any parameters that you do not intend to override.

For example, if you were creating an instance of
:js:class:`~carbond.mongodb.MongoDBCollection` and wanted to add a ``created``
field to any object being inserted, you might do something like the following:

.. code-block:: js

    preInsertObject(object, options) {
      object.created = new Date()
    }

post<OPERATION NAME>
--------------------

The base ``post<OPERATION NAME>`` hooks have the same signature as the operation
handler with the result of the operation handler prepended to the parameter list
(e.g., ``postInsert(result, objects, options)``) and, similar to their
``pre<OPERATION NAME>`` counterparts, simply return the result. These hooks are
useful if you want to augment the result object in some way. For example, you
may want to sanitize some fields in a result:

.. code-block:: js

    postFindObject(result, id, options) {
      if (!_.isNil(result)) {
        result.apiKey = 'REDACTED'
      }
      return result
    }

post<OPERATION NAME>Operation
-----------------------------

The base ``post<OPERATION NAME>Operation`` hooks take a result, as returned
from ``post<OPERATION NAME>``, as well as a config, request object, and response
object, and update the response to be sent to the user (e.g., set the status
code). Finally, they return the result and pass control back to ``carbond``.
These hooks are useful when you want to further augment the response. For
example, you may log the last time a request was made by a particular user and
return that in a header in the response:

.. code-block:: js

    postFindObjectOperation(result, config, req, res) {
      result = Collection.prototype.postFindObjectOperation.call(this, result, config, req, res)
      var lastAccessTime = getLastAccessTimeForUser(req.user)
      res.set('X-Last-Access-Time', lastAccessTime)
      return result
    }

MongoDBCollection
=================

:js:class:`~carbond.mongodb.MongoDBCollection` is an example of a concrete
:js:class:`~carbond.collections.Collection` implementation and comes baked into
Carbon. Unlike :js:class:`~carbond.collections.Collection`, all handler
operations are implemented. You should only have to configure which operations
you want enabled along with some extra collection level and collection operation
level configuration.

.. literalinclude:: ../code-frags/hello-world-mongodb/lib/HelloService.js
    :language: javascript
    :linenos:
    :lines: 1-12,14,16-

MongoDBCollection Configuration
-------------------------------

:js:class:`~carbond.mongodb.MongoDBCollection` extends
:js:class:`~carbond.collections.Collection` with the following configuration
properties:

    :js:attr:`~carbond.mongodb.MongoDBCollection.db`
        This is only necessary if the :js:class:`~carbond.Service` instance
        connects to multiple databases and should be a key in
        :js:attr:`~carbond.Service.dbUris`.
    :js:attr:`~carbond.mongodb.MongoDBCollection.collection`
        This is the name of the MongoDB collection that the endpoint will operate
        on.
    :js:attr:`~carbond.mongodb.MongoDBCollection.querySchema`
        This is the schema used to validate the query spec for multiple
        operations (e.g., ``find``, ``update``, etc.). It defaults to ``{type:
        'object'}``.
    :js:attr:`~carbond.mongodb.MongoDBCollection.updateSchema`
        This is the schema used to validate the update spec passed to the
        ``update`` operation. It defaults to ``{type: 'object'}``.
    :js:attr:`~carbond.mongodb.MongoDBCollection.updateObjectSchema`
        This is the schema used to validate the update spec passed to the
        ``updateObject`` operation. It defaults to ``{type: 'object'}``.

MongoDBCollection Operation Configuration
-----------------------------------------

The :js:class:`~carbond.mongodb.MongoDBCollection` implementation overrides
:js:class:`~carbond.collection.Collection`\ 's configuration class members with
the following classes:

- :js:class:`~carbond.mongodb.MongoDBInsertConfig`
- :js:class:`~carbond.mongodb.MongoDBFindConfig`
- :js:class:`~carbond.mongodb.MongoDBSaveConfig`
- :js:class:`~carbond.mongodb.MongoDBUpdateConfig`
- :js:class:`~carbond.mongodb.MongoDBRemoveConfig`
- :js:class:`~carbond.mongodb.MongoDBInsertObjectConfig`
- :js:class:`~carbond.mongodb.MongoDBFindObjectConfig`
- :js:class:`~carbond.mongodb.MongoDBSaveObjectConfig`
- :js:class:`~carbond.mongodb.MongoDBUpdateConfig`
- :js:class:`~carbond.mongodb.MongoDBRemoveConfig`

Note, these configuration classes are resolved via the appropriate class
member (e.g., :js:attr:`~carbond.mongodb.MongoDBCollection.InsertConfigClass`
resolves to :js:class:`~carbond.mongodb.MongoDBInsertConfig`).

All additions to and/or restrictions placed on individual operation
configurations will be documented in the following sections. Config classes that
do not add or remove functionality will be omitted.

MongoDBFindConfig
~~~~~~~~~~~~~~~~~~~

:js:class:`~carbond.mongodb.MongoDBFindConfig` makes a few additions to the base
configuration class. It adds three parameters, ``sort``, ``project``, and
``query``. ``sort`` and ``project`` allow you to specify a sort order for the
result set (see: `MongoDB sort
<https://docs.mongodb.com/manual/reference/method/cursor.sort/#cursor.sort>`_)
and a subset of fields to return for each object (see: `MongoDB projection
<https://docs.mongodb.com/manual/reference/glossary/#term-projection>`_)
respectively.  Query support is configurable via the
:js:attr:`~carbond.mongodb.MongoDBFindConfig.supportsQuery` property. If support
is enabled, the ``query`` parameter will be added to the list of parameters for
that query (see: `MongoDB query
<https://docs.mongodb.com/manual/reference/operator/query/>`_).

MongoDBUpdateConfig
~~~~~~~~~~~~~~~~~~~

:js:class:`~carbond.mongodb.MongoDBUpdateConfig` removes support for
:js:attr:`~carbond.collections.UpdateConfig.returnsUpsertedObjects`.
Additionally, it adds query support via the ``query`` parameter.

.. todo:: should this have "supportsQuery"?

MongoDBRemoveConfig
~~~~~~~~~~~~~~~~~~~

Similar to :js:class:`~carbond.mongodb.MongoDBFindConfig` and
:js:class:`~carbond.mongodb.MongoDBUpdateConfig`,
:js:class:`~carbond.mongodb.MongoDBRemoveConfig` adds support for queries via
the ``query`` parameter. This support is enabled by default, but can be
configured via the :js:attr:`~carbond.mongodb.MongoDBRemoveConfig`.

MongoDBUpdateObject
~~~~~~~~~~~~~~~~~~~

:js:class:`~carbond.mongodb.MongoDBUpdateObjectConfig` removes support for
:js:attr:`~carbond.collections.UpdateConfig.returnsUpsertedObject`.

MongoDBRemoveObject
~~~~~~~~~~~~~~~~~~~

:js:class:`~carbond.mongodb.MongoDBRemoveObjectConfig` removes support for
:js:attr:`~carbond.collections.UpdateConfig.returnsRemovedObject`.

Access Control
==============

In addition to enabling / disabling operations, you may also gate operations via
access control policies (see: :ref:`access control <access-control-ref>`).

.. _json schema: http://json-schema.org/
.. _json patch: http://jsonpatch.com/
.. _mongo driver: http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html
