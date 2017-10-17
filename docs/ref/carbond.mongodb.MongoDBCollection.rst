.. class:: carbond.mongodb.MongoDBCollection
    :heading:

.. |br| raw:: html

   <br />

=================================
carbond.mongodb.MongoDBCollection
=================================
*extends* :class:`~carbond.collections.Collection`

A concrete implementation of :class:`~carbond.collections.Collection` that supports MongoDB

Properties
----------

.. class:: carbond.mongodb.MongoDBCollection
    :noindex:
    :hidden:

    .. attribute:: collection

       :type: string
       :required:

       The database collection name


    .. attribute:: COLLECTION_QUERY_OPERATIONS

       :type: Array
       :required:
       :ro:

       The list of operations that support queries


    .. attribute:: db

       :type: string
       :default: undefined

       The database name. Note, this is only needed if the :class:`~carbond.Service` instance connects to multiple databases


    .. attribute:: defaultSchema

       :type: object
       :required:
       :ro:

       This is the default schema used to validate all objects in this collection. If a schema is not specified explicitly, this schema will be used.


    .. attribute:: FindConfigClass

       :type: :class:`~carbond.mongodb.MongoDBFindConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.mongodb.MongoDBCollection.find` operation config


    .. attribute:: FindObjectConfigClass

       :type: :class:`~carbond.mongodb.MongoDBFindObjectConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.mongodb.MongoDBCollection.findObject` operation config


    .. attribute:: idParameter

       :type: string
       :default: ``'_id'``

       The ID parameter name (XXX: rename to "objectIdName" since this is not a "parameter" name?)


    .. attribute:: InsertConfigClass

       :type: :class:`~carbond.mongodb.MongoDBInsertConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.mongodb.MongoDBCollection.insert` operation config


    .. attribute:: InsertObjectConfigClass

       :type: :class:`~carbond.mongodb.MongoDBInsertObjectConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.mongodb.MongoDBCollection.insertObject` operation config


    .. attribute:: querySchema

       :type: object
       :default: undefined

       The JSON schema used to validate the query spec for query enabled operations (e.g., :class:`~carbond.mongodb.MongoDBCollection.find`)


    .. attribute:: RemoveConfigClass

       :type: :class:`~carbond.mongodb.MongoDBRemoveConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.mongodb.MongoDBCollection.remove` operation config


    .. attribute:: RemoveObjectConfigClass

       :type: :class:`~carbond.mongodb.RemoveObjectConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.mongodb.MongoDBCollection.removeObject` operation config


    .. attribute:: MongoDBSaveConfigClass

       :type: :class:`~carbond.mongodb.MongoDBSaveConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.mongodb.MongoDBCollection.save` operation config


    .. attribute:: SaveObjectConfigClass

       :type: :class:`~carbond.mongodb.MongoDBSaveObjectConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.mongodb.MongoDBCollection.saveObject` operation config


    .. attribute:: UpdateConfigClass

       :type: :class:`~carbond.mongodb.MongoDBUpdateConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.mongodb.MongoDBCollection.update` operation config


    .. attribute:: UpdateObjectConfigClass

       :type: :class:`~carbond.mongodb.MongoDBUpdateObjectConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.mongodb.MongoDBCollection.updateObject` operation config


    .. attribute:: updateObjectSchema

       :type: object
       :default: undefined

       The JSON schema used to validate the update spec passed to :class:`~carbond.mongodb.MongoDBCollection.updateObject`


    .. attribute:: updateSchema

       :type: object
       :default: undefined

       The JSON schema used to validate the update spec passed to :class:`~carbond.mongodb.MongoDBCollection.update`


Methods
-------

.. class:: carbond.mongodb.MongoDBCollection
    :noindex:
    :hidden:

    .. function:: find(options)

        :param options: The operation parameters (see: :class:`~carbond.mongodb.MongoDBCollection.FindConfigClass`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: object[]

        Retrieve objects from a collection

    .. function:: findObject(id, options)

        :param id: The object id
        :type id: string
        :param options: The operation parameters (see: :class:`~carbond.mongodb.MongoDBCollection.FindObjectConfigClass`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: object | null

        Retrieve a single object from a collection

    .. function:: insert(objects, options)

        :param objects: An array of objects to insert
        :type objects: Array
        :param options: The operation parameters (see: :class:`~carbond.mongodb.MongoDBCollection.InsertConfigClass`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: object[]

        Bulk insert objects into a collection

    .. function:: insertObject(object, options)

        :param object: An object to insert
        :type object: object
        :param options: The operation parameters (see: :class:`~carbond.mongodb.MongoDBCollection.InsertObjectConfigClass`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: object

        Insert a single object into a collection

    .. function:: preFindObjectOperation(config, req, res)

        :param config: The find object operation config
        :type config: :class:`~carbond.collections.FindObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preFindOperation(config, req, res)

        :param config: The find operation config
        :type config: :class:`~carbond.collections.FindConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preInsertObjectOperation(config, req, res)

        :param config: The insert object operation config
        :type config: :class:`~carbond.collections.InsertObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preInsertOperation(config, req, res)

        :param config: The insert operation config
        :type config: :class:`~carbond.collections.InsertConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preRemoveObjectOperation(config, req, res)

        :param config: The remove object operation config
        :type config: :class:`~carbond.collections.RemoveObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preRemoveOperation(config, req, res)

        :param config: The remove operation config
        :type config: :class:`~carbond.collections.RemoveConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preSaveObjectOperation(config, req, res)

        :overrides: :attr:`~carbond.collections.Collection.preSaveObjectOperation`
        :param config: The save object operation config
        :type config: :class:`~carbond.mongodb.MongoDBCollection.SaveObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preSaveOperation(config, req, res)

        :param config: The save operation config
        :type config: :class:`~carbond.collections.SaveConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preUpdateObjectOperation(config, req, res)

        :param config: The update object operation config
        :type config: :class:`~carbond.collections.UpdateObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preUpdateOperation(config, req, res)

        :param config: The update operation config
        :type config: :class:`~carbond.collections.UpdateConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: remove(options)

        :param options: The operation parameters (see: :class:`~carbond.mongodb.MongoDBCollection.RemoveConfigClass`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: number | array

        Remove objects from a collection

    .. function:: removeObject(id, options)

        :param id: The ID of the object to remove
        :type id: String
        :param options: The operation parameters (see: :class:`~carbond.mongodb.MongoDBCollection.RemoveConfigClass`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: number | object

        Remove a specific object from a collection

    .. function:: save(objects, options)

        :param objects: An array of objects (with IDs) to save
        :type objects: Array
        :param options: The operation parameters (see: :class:`~carbond.mongodb.MongoDBCollection.SaveConfigClass`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: object[]

        Replace the collection with an array of objects

    .. function:: saveObject(object, options)

        :overrides: :attr:`~carbond.collections.Collection.saveObject`
        :param object: The object to save (with ID)
        :type object: object
        :param options: The operation parameters (see: :class:`~carbond.mongodb.Collection.SaveObjectConfigClass`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: :class:`~carbond.collections.Collection.SaveObjectResult`

        Replace or insert an object with a known ID

    .. function:: update(update, options)

        :overrides: :attr:`~carbond.collections.Collection.update`
        :param update: The update to be applied to the collection
        :type update: object
        :param options: The operation parameters (see: :class:`~carbond.mongodb.MongoDBCollection.UpdateConfigClass`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: :class:`~carbond.collections.Collection.UpdateResult`

        Update (or upsert) a number of objects in a collection

    .. function:: updateObject(id, update, options)

        :param id: The ID of the object to update
        :type id: string
        :param update: The update to be applied to the collection
        :type update: object
        :param options: The operation parameters (see: :class:`~carbond.mongodb.MongoDBCollection.UpdateObjectConfigClass`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: :class:`~carbond.collections.Collection.UpdateObjectResult`

        Update a specific object
