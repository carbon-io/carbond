==============================================
Collection Operation Pre/Post Hooks (Advanced)
==============================================

You should generally only have to implement the
:doc:`collection-operation-handlers` and apply the appropriate configuration to your
:js:class:`~carbond.collections.Collection` instance to achieve the desired
behavior. Despite this, you may find that you need more flexibility in certain
situations, especially when instantiating a concrete Collection implementation.

There are four hooks that you can override to change the
behavior of a Collection operation. These hooks have the following signatures
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

