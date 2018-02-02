=================
MongoDBCollection
=================

:js:class:`~carbond.mongodb.MongoDBCollection` is an example of a concrete
:js:class:`~carbond.collections.Collection` implementation and comes baked into
Carbon. Unlike :js:class:`~carbond.collections.Collection`, all handler
operations are implemented. You should only have to configure which operations
you want enabled along with some extra collection level and collection operation
level configuration.

.. literalinclude:: ../../code-frags/hello-world-mongodb/lib/HelloService.js
    :language: javascript
    :linenos:
    :lines: 1-12,14,16-

MongoDBCollection Configuration
-------------------------------

:js:class:`~carbond.mongodb.MongoDBCollection` extends
:js:class:`~carbond.collections.Collection` with the following configuration
properties:

    :js:attr:`~carbond.mongodb.MongoDBCollection.dbName`
        This is only necessary if the :js:class:`~carbond.Service` instance
        connects to multiple databases and should be a key in
        :js:attr:`~carbond.Service.dbUris`.
    :js:attr:`~carbond.mongodb.MongoDBCollection.collectionName`
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

