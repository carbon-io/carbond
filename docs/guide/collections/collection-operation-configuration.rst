==================================
Collection Operation Configuration
==================================

:js:class:`~carbond.collections.Collection`\ s support configuration at multiple
levels with two types of configuration: ``Collection``-level configuration,
which may have implications for certain Collection operations, and
``CollectionOperation``-specific configs.

``CollectionOperation``-specific configs should be set on the ``Collection``. If
they are omitted, and an operation is enabled, they will be instantiated as if
they were initialized as ``{}`` using the appropriate
:ref:`OperationConfig <collection-operation-config-class>` subclass (e.g. if
:js:attr:`~carbond.collections.Collection.insertConfig` is left as ``undefined``,
it will be instantiated as ``o({}, this.InsertConfigClass)``, where
``this.InsertConfigClass`` is a class member that allows subclasses of
:js:class:`~carbond.collections.Collection` to override the default config class).
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

When instantiating an instance of :js:class:`~carbond.collections.Collection`,
you can configure each operation using the config property for that operation
(e.g.  :js:attr:`~carbond.collections.Collection.insertConfig` for the
``insert`` operation). When defining the config, you can either explicitly
instantiate a config instance using the appropriate config class (e.g.,
:js:class:`~carbond.collections.InsertConfig` for the ``insert`` operation):

.. code-block:: js

    insertConfig: o({
      _type: carbond.collections.MyCustomInsertConfig,
      description: "My collection's insert operation",
      parameters: {
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
      parameters: {
        foo: {
          name: "foo",
          location: "query",
          schema: {
            type: "string"
          }
        }
      }
    }

.. todo:: rework

Subclasses that require additional parameters for certain operations or that can
not support certain features (e.g., returning removed objects), should subclass
the individual config classes and override these member properties in the
subclass. When the subclass is instantiated, it will use these overridden config
classes instead of the default ones as defined on
:js:class:`~carbond.collections.Collection`.

.. _collection-operation-config-class:

The OperationConfig class
=====================

:js:class:`~carbond.collections.CollectionOperationConfig` is the base class for
all Collection configs. It defines basic properties that are common to all
operation configs like:

- :js:attr:`~carbond.collections.CollectionOperationConfig.description`
- :js:attr:`~carbond.collections.CollectionOperationConfig.noDocument`
- :js:attr:`~carbond.collections.CollectionOperationConfig.allowUnauthenticated`
- :js:attr:`~carbond.collections.CollectionOperationConfig.parameters`
- :js:attr:`~carbond.collections.CollectionOperationConfig.responses`
- :js:attr:`~carbond.collections.CollectionOperationConfig.endpoint`
- :js:attr:`~carbond.collections.CollectionOperationConfig.options`

InsertConfig
~~~~~~~~~~~~

The :js:class:`~carbond.collections.InsertConfig` class is the base ``insert``
operation config class and the default for
:js:class:`~carbond.collections.Collection`. It can be used to configure whether
or not inserted objects are returned
(:js:attr:`~carbond.collections.InsertConfig.returnsInsertedObjects`) in the
response body and to define a schema separate from the collection level schema
that will be used to verify incoming objects
(:js:attr:`~carbond.collections.InsertConfig.schema`).

.. code-block:: js

    ...
    insertConfig: {
      description: 'My collection insert operation',
      returnsInsertedObjects: false,
      schema: {
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
      schema: {
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

Note, unlike :js:attr:`~carbond.collections.InsertConfig.schema`, it is
necessary to specify the ID parameter (``_id`` in this case) on ``schema``.
Note, it should have the same name as
:js:attr:`~carbond.collections.Collection.idParameterName` or an error will be thrown
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
      schema: {
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
      schema: {
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
      schema: {
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

