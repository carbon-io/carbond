===========
Collections
===========

.. toctree::

Carbond :js:class:`~carbond.Collection`\s provide a high-level abstraction for
defining :js:class:`~carbond.Endpoint`\s that behave like a collection of
resources. When you define a :js:class:`~carbond.Collection` you may define the
following operation handler methods:

- ``insert(objects, context, options)``
- ``find(context, options)``
- ``save(objects, context, options)``
- ``update(update, context, options)``
- ``remove(context, options)``
- ``insertObject(object, context, options)``
- ``findObject(id, context, options)``
- ``saveObject(object, context, options)``
- ``updateObject(id, update, context, options)``
- ``removeObject(id, context, options)``

Which results in the following tree of :js:class:`~carbond.Endpoint`\s and
:js:class:`~carbond.Operation`\s:

- ``/<collection>``

  - ``POST`` which maps to :js:func:`~carbond.Collection.insert` and :js:func:`~carbond.Collection.insertObject`
  - ``GET`` which maps to :js:func:`~carbond.Collection.find`
  - ``PUT`` which maps to :js:func:`~carbond.Collection.save`
  - ``PATCH`` which maps to :js:func:`~carbond.Collection.update`
  - ``DELETE`` which maps to :js:func:`~carbond.Collection.remove`

- ``/<collection>/:<id>``

  - ``GET`` which maps to :js:func:`~carbond.Collection.findObject`
  - ``PUT`` which maps to :js:func:`~carbond.Collection.saveObject`
  - ``PATCH`` which maps to :js:func:`~carbond.Collection.updateObject`
  - ``DELETE`` which maps to :js:func:`~carbond.Collection.removeObject`

When defining a :js:class:`~carbond.Collection`, it is not required that all
operations be implemented. Instead, only define the operations that are required
and enable them via the :js:attr:`~carbond.Collection.enabled` property.
For example, here is a collection that only defines the
:js:func:`~carbond.Collection.find` method:

.. literalinclude:: ../code-frags/hello-world/lib/HelloService.js
    :language: javascript
    :linenos:
    :lines: 1-11,15-19,30,32-33,54-58,61-

Creating Collections
====================

:js:class:`~carbond.Collection` endpoints can be created either by creating an
instance of :js:class:`~carbond.Collection` (most common) or by sub-classing (as
with the :js:class:`~carbond.mongodb.MongoDBCollection` class) and are
configured through a combination of top-level collection properties and through
a set of :js:class:`~carbond.collections.CollectionOperationConfig` s.

In most cases, you should only need to define the appropriate operation handlers
(e.g., ``insert``, ``insertObject``, ``find``, ``findObject``, etc.) and enable
them via the :js:attr:`~carbond.collections.Collection.enabled` property. Further
configuration of the behavior of each operation at the HTTP level should be
done using the appropriate collection operation config class (e.g.,
:js:class:`~carbond.collections.InsertConfig`). While the inputs and outputs to
and from the operation handlers should remain the same, the configuration allows
you to specify things like whether the HTTP response body should contain the objects
inserted or whether "upserts" should be allowed in response to ``PATCH`` requests
(more on this later).

.. todo:: add link for "more on this later"

There are two types of parameters passed to each operation handler, those that
are required by the operation and those that serve to augment how that operation
is applied. Required arguments are common to all collection implementations and
are explicitly specified at the head of the parameter list (e.g., ``id`` and
``update`` for the ``updateObject`` operation). Additional parameters are passed
via the ``context`` and ``options`` arguments. For example, the
:js:func:`~carbond.mongodb.MongoDBCollection.update` operation supports queries
by adding another parameter called ``query`` (not to be confused with the query
string component of the URL) to the set of parameters recognized by the
endpoint. When a HTTP request is received, the ``update`` spec will be passed to
the operation handler via the first parameter (``update``), while the ``query``
spec will be passed via the ``context`` parameter as a property of that object
(e.g., ``context.query``).  The ``options`` parameter is intended to be used for
concrete implementation driver specific options and will be covered later.

The following sections describe at a high-level the semantics of each operation.

Collection Operation Handlers
-----------------------------

insert
~~~~~~

The :js:func:`~carbond.collections.Collection.insert` operation handler takes a
list of objects and persists them to the backing datastore. Each individual
object will be a JSON blob whose structure will be validated with the
appropriate `json schema`_ as definded by
:js:attr:`~carbond.collections.Collection.schema` (note, the ID property will be
omitted from the schema when validating). By default, this schema is very loose,
just specifying that the object should be of type ``object`` and allowing for
any and all properties. Once the objects have been persisted, the list of
objects with IDs populated should be returned.

.. todo:: add link to example implementation

find
~~~~

The :js:func:`~carbond.collections.Colletion.find` operation handler does not
take any required arguments. Instead, the most basic implementation should
return a list of objects in the collection in natural order. Pagination is
supported if configured (see
:js:attr:`~carbond.collections.FindConfig.supportsPagination`). If this is the
case, the handler should honor the parameters indicating the subset of objects
to return (e.g., ``context.skip`` and ``context.limit``). To support rich
queries, a ``query`` parameter (not to be confused with the query string
component of a URL) can be added via the
:js:attr:`~carbond.collections.CollectionOperationConfig.additionalParameters``
property and will be passed down to the operation handler in the ``context``
object using a property of the same name (e.g., if you add the parameter
``{name: 'foo', description: 'rich query', location: 'query', default: {}}`` to
the config, ``context`` will contain the property ``foo`` with a default value
of ``{}``).  The list of objects should be returned.

.. todo:: add link to example implementation

save
~~~~

The :js:func:`~carbond.Collection.save` operation handler takes a list of
objects whose ID properties have been populated by the client and replaces the
entire collection with these objects. This is a dangerous operation and should
likely only be enabled in development or for super users. It should return the
list of objects that make up the new collection.

.. todo:: add link to example implementation

update
~~~~~~

The :js:func:`~carbond.Collection.update` operation handler takes an ``update``
spec object which should be applied to the collection as a whole. Similar to the
``insert`` operation, the ``update`` spec object is a JSON blob that will be
weakly validated using a default schema. To enforce a particular structure, you
can specify the update schema using the
:js:attr:`~carbond.collections.UpdateSchema.updateSchema` property. The return
type of the ``update`` operation deviates a bit from the return types for
previous operation handlers. Instead of simply returning a value, an ``object``
should be returned containing the property ``val``, whose value should be set to
the return value for the operation. Additionally, the update operation can be
configured to support "upserts". By default, the ``update`` operation is
configured to not return the objects that were upserted as this is not generally
possible.  Instead, the number of objects updated/upserted should be returned
and, if upserts are supported, a ``created`` flag should be present as well, to
indicate that an upsert took place (e.g., if five objects were updated, you
would return ``{val: 5}`` and if five objects were upserted, you would return
``{val: 5, created: true}``). If it is possible to return the upserted object(s)
and the concrete implementation of the collection is configured to do so, then
the list of upserted object(s) should be substituted for the number of objects
as the value of the ``val`` property in the return object *if* an upsert took
place.

.. todo:: add link to example implementation

remove
~~~~~~

The :js:func:`~carbond.Collection.remove` operation handler does not take any
required arguments. Instead, the ``remove`` operation should simply remove all
objects in the collection. Similar to ``update`` operation, ``remove`` can be
configured to return the removed objects. If this is possible given the backing
datastore, it should return the objects removed (e.g., if five objects were
removed, the return value should look something like ``[obj1, obj2, obj3, obj4,
obj4]``). If not, the number of objects removed should be returned.

.. todo:: add link to example implementation

insertObject
~~~~~~~~~~~~

The :js:func:`~carbond.Collection.insertObject` operation handler takes a single
object as its first argument and persists it to the backing datastore. Similar
to the :js:func:`~carbond.Collection.insert` operation handler, the object will
be a JSON blob whose structure will be validated with the appropriate `json
schema`_ as definded by :js:attr:`~carbond.collections.Collection.schema` Once
the object has been persisted, the list of objects inserted with IDs populated
should be returned.

.. todo:: add link to example implementation

findObject
~~~~~~~~~~

The :js:func:`~carbond.Colletion.findObject` operation takes an ``id`` parameter and
should return the object from the collection with that ``id`` if it exists and
``null`` otherwise.

.. todo:: add link to example implementation

saveObject
~~~~~~~~~~

The :js:func:`~carbond.Collection.saveObject` operation handler takes a single
object whose ID property has been populated by the client and should replace
the object in the collection with the same ID. Like
``update``, ``saveObject`` can be configured to support upserts. It is left up
to the concrete implementation of the collection to decide how this is
communicated to the operation handler.
:js:class:`~carbond.mongodb.MongoDBCollection`, for instance, updates the
``options`` parameter to include ``{upsert: true}`` if upserts are allowed. If
the object is saved, it should be returned in either case. If upserts are
not allowed and there is no object that has a matching ID,
``null`` should be returned.

.. todo:: add link to example implementation

updateObject
~~~~~~~~~~~~

The :js:func:`~carbond.Collection.updateObject` operation handler takes an
``id`` and an ``update`` object and should apply that update to an object in the
collection with a matching ID. Similar to :js:func:`~carbond.Collection.update`,
the ``updateObject`` operation can be configured to support upserts with all
the same return value caveats. The only difference in this case is that if the
operation is configured to return an upserted document and an upsert took place,
the upserted document should be returned instead of the number of
updated/upserted objects (e.g., ``1`` or ``0`` in the case of ``updateObject``).

.. todo:: add link to example implementation

removeObject
~~~~~~~~~~~~

The :js:func:`~carbond.Collection.removeObject` operation handler takes an
``id`` argument and should remove the object with a matching ID. Similar to
:js:func:`~carbond.Collection.remove`, the return value for this operation will
depend on how the concrete implementation of the collection is configured and if
the underlying datastore supports returning the removed object.

.. todo:: add link to example implementation

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
    enabled: {'*': true, find: false},
    ...

When instantiating a concrete collection implementation, you will likely have to
do little else than name the collection and enable the operations that you want
exposed to the user:

.. literalinclude:: ../code-frags/hello-world-mongodb/lib/HelloService.js
    :language: javascript
    :linenos:

Collection Configuration
------------------------

:js:class:`~carbond.collections.Collection`\ s support configuration at multiple
levels with two types of configuration: ``Collection`` level configuration,
which may have have implications for certain collection operations, and
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
        ``generateId``. This method does not take any parameters and should
        return a suitable ID for a collection object on ``insert`` or
        ``insertObject``.
    :js:attr:`~carbond.collections.Collection.idPathParameter`
        This is the name of the path parameter used to capture an object ID for
        object specific endpoints (e.g.,
        ``/<someCollectionName>/:<idPathParameter>``).
    :js:attr:`~carbond.collections.Collection.idParameter`
        This is the name of the ID property of a collection object (e.g.,
        ``{<idParameter>: "foo", "bar": "baz"}``).
    :js:attr:`~carbond.collections.Collection.idHeader`
        This is the name of the HTTP response header that will contain the
        object ID or IDs when objects are created in the collection.

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
:js:class:`~carbond.collections.InsertConfig`:

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
:js:class:`carbond.collections.Collection`.

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
objects when doing a bulk insert. If this is disabled, then the ``insert``
operation should likely be disabled as well (note, ``insertObject`` makes use of
the ID path parameter instead). Enabling pagination adds the ``page`` parameter
to the list of parameters for the collection operation. Note, ``find`` operation
parameter list includes to more parameters: ``skip`` and ``limit``. When
pagination is enabled, it will be transparent to the operation handlers
themselves. Instead, :js:class:`~carbond.collections.Collection` will update
``context.skip`` and ``context.limit`` to reflect the page start and size. This
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
``limit`` will still be present).

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
An error will be thrown in the case that it isn't.

UpdateConfig
~~~~~~~~~~~~

The :js:class:`~carbond.collections.UpdateConfig` class is the base ``update``
operation config class and the default for
:js:class:`~carbond.collections.Collection`. It allows you to configure an
update schema, whether or not upserts are supported, and whether upserted
objects are returned in the response body. The update schema is "loose" by
default and only specifies that it should be an object. This should be tailored
depending on the update language that your collection/datastore understand
(e.g., `json patch`_). If upserts are enabled, an ``upsert`` parameter will be
added to the list of parameters for the collection operation.

.. code-block:: js

    ...
    updateConfig: {
      description: 'My collection update operation',
      updateSchema: {
        type: 'object',
        properties: {
          op: {
            type: 'string',
            enum: ['add', 'remove'],
          },
          path: {type: 'string'},
          value: {}
        },
        required: ['op', 'path', 'value'],
        additionalProperties: false
      }
    },
    ...

The example above specifies a simplistic schema for `json patch`_ style updates.
Note, upserts and returning upserted objects are disabled by default.

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

The :js:class:`~carbond.collections.InsertObjectConfig` class is the base ``insertObject``
operation config class and the default for
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
:js:class:`~carbond.collections.Collection`. This config does not have any
configuration that is specific to the operation beyond the base config and
simply supports object lookup by ID.

.. code-block:: js
    
    ...
    findObjectConfig: {
      description: 'My collection findObject operation',
      additionalParameters: {
        project: {
          name: 'project',
          location: 'query',
          schema: {
            type: 'object',
            additionalProperties: {
              oneOf: [
                {
                  type: 'number',
                  minimum: 0,
                  maximum: 1,
                  multipleOf: 1
                },
                {
                  type: 'boolean'
                }
              ]
            }
          }
        }
      }
    },
    ...

In this example, we add another parameter ``project``, which allows us to return
results with only the fields that we want (note, this has implications for the
response schema that will validate the structure of objects returned from the
``findObject`` handler).

.. todo:: i think this makes more sense when we overhaul responses, since
          there's not a great way to configure the response body schema here

SaveObjectConfig
~~~~~~~~~~~~~~~~

The :js:class:`~carbond.collections.SaveObjectConfig` class is the base ``saveObject``
operation config class and the default for
:js:class:`~carbond.collections.Collection`. Like previous config classes, it
allows you to set a specific schema for the incoming object (again, an ID
property is required). Additionally, like the ``update`` config class, the
``saveObject`` operation can be configured to create objects in the collection
(this is the default) and to return the object in the response to the client.
Note, the ``save`` operation never "creates" objects since it is an operation at
the collection level. Instead, it "replaces" the collection.

.. code-block:: js
    
    ...
    saveObjectConfig: {
      description: 'My collection saveObject operation',
      supportsInsert: false,
      returnsSavedObject: false
    }
    ...


UpdateObjectConfig
~~~~~~~~~~~~~~~~~~

The :js:class:`~carbond.collections.UpdateObjectConfig` class is the base ``updateObject``
operation config class and the default for
:js:class:`~carbond.collections.Collection`. Like
:js:class:`~carbond.collections.UpdateConfig`, this config allows you to specify
an update spec schema, whether or not upserts are allowed, and, if they are
allowed, whether an object is returned if an upsert takes place.

.. code-block:: js

    ...
    updateConfig: {
      description: 'My collection updateObject operation',
      supportsUpsert: true,
      returnsUpsertedObject: true,
      updateSchema: {
        type: 'object',
        properties: {
          op: {
            type: 'string',
            enum: ['add', 'remove'],
          },
          path: {type: 'string'},
          value: {}
        },
        required: ['op', 'path', 'value'],
        additionalProperties: false
      }
    },
    ...

RemoveObjectConfig
~~~~~~~~~~~~~~~~~~

The :js:class:`~carbond.collections.RemoveObjectConfig` class is the base ``removeObject``
operation config class and the default for
:js:class:`~carbond.collections.Collection`. This config offers essentially the
same configuration parameters as
:js:class:`~carbond.collections.RemoveObjectConfig`.

.. code-block:: js

    ...
    removeConfig: {
      description: 'My collection remove operation',
      returnsRemovedObjects: true
    }
    ...

Collection Operation Client (REST) Interface
--------------------------------------------

Access Control
--------------

In addition to enabling / disabling operations, you may also gate operations via
access control policies (see: :ref:`access control <access-control-ref>`).

Collection Operation Pre/Post Hooks (Advanced)
----------------------------------------------


.. _json schema: http://json-schema.org/
.. _json patch: http://jsonpatch.com/
