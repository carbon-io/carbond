.. class:: carbond.collections.Collection
    :heading:

.. |br| raw:: html

   <br />

==============================
carbond.collections.Collection
==============================
*extends* :class:`~carbond.Endpoint`

Provides a high-level abstraction for defining Endpoints that behave like a RESTful collection of resources

Properties
----------

.. class:: carbond.collections.Collection
    :noindex:
    :hidden:

    .. attribute:: carbond.collections.Collection.ALL_COLLECTION_OPERATIONS

       :type: array
       :ro:

       The list of valid collection operations


    .. attribute:: carbond.collections.Collection.defaultErrorSchema

       :type: Object
       :ro:

       This is the default error body schema.


    .. attribute:: carbond.collections.Collection.defaultIdHeader

       :type: string
       :ro:

       The default ID header name


    .. attribute:: carbond.collections.Collection.defaultIdParameter

       :type: string
       :ro:

       The default ID name of objects in this collection


    .. attribute:: carbond.collections.Collection.defaultIdPathParameter

       :type: string
       :ro:

       The default path parameter name representing the ID for an object in this collection


    .. attribute:: carbond.collections.Collection.defaultSchema

       :type: Object
       :ro:

       This is the default schema used to validate all objects in this collection. If a schema is not specified explicitly, this schema will be used.


    .. attribute:: carbond.collections.Collection.enabled

       :type: Object
       :default: ``{'*': false}``

       Control which collection level operations

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          \*, ``boolean``, ``undefined``, The default value for all operations that are not explicitly specified
          insert, ``boolean``, ``undefined``, Enable or disable the insert operation
          find, ``boolean``, ``undefined``, Enable or disable the find operation
          save, ``boolean``, ``undefined``, Enable or disable the save operation
          update, ``boolean``, ``undefined``, Enable or disable the update operation
          remove, ``boolean``, ``undefined``, Enable or disable the remove operation
          insertObject, ``boolean``, ``undefined``, Enable or disable the insertObject operation
          findObject, ``boolean``, ``undefined``, Enable or disable the findObject operation
          saveObject, ``boolean``, ``undefined``, Enable or disable the saveObject operation
          updateObject, ``boolean``, ``undefined``, Enable or disable the updateObject operation
          removeObject, ``boolean``, ``undefined``, Enable or disable the removeObject operation



    .. attribute:: carbond.collections.Collection.example

       :type: Object
       :default: undefined

       An example object for this collection


    .. attribute:: carbond.collections.Collection.findConfig

       :type: Object
       :default: ``o({}, carbond.collections.FindConfigClass)``

       The config used to govern the behavior of the :class:`~find` operation


    .. attribute:: carbond.collections.Collection.FindConfigClass

       :type: :class:`~carbond.collections.FindConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.find` operation config


    .. attribute:: carbond.collections.Collection.findObjectConfig

       :type: Object
       :default: ``o({}, carbond.collections.FindObjectConfigClass)``

       The config used to govern the behavior of the :class:`~findObject` operation


    .. attribute:: carbond.collections.Collection.FindObjectConfigClass

       :type: :class:`~carbond.collections.FindObjectConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.findObject` operation config


    .. attribute:: carbond.collections.Collection.idGenerator

       :type: Object
       :default: undefined

       An object with the method "generateId" that will be called to populate ID if present and when appropriate (e.g. :class:`~carbond.collection.Colleciont.insert`)


    .. attribute:: carbond.collections.Collection.idHeader

       :type: string
       :default: :class:`~carbond.collection.Collection.defaultIdHeader`

       The header name which should contain the EJSON serialized ID


    .. attribute:: carbond.collections.Collection.idParameter

       :type: string
       :default: :class:`~carbond.collection.Collection.defaultIdParameter`

       The ID parameter name (XXX: rename to "objectIdName" since this is not a "parameter" name?)


    .. attribute:: carbond.collections.Collection.idPathParameter

       :type: string
       :default: :class:`~carbond.collection.Collection.defaultIdParameter`

       The PATH_ID parameter name (e.g., /collection/:PATH_ID)


    .. attribute:: carbond.collections.Collection.insertConfig

       :type: Object
       :default: ``o({}, carbond.collections.InsertConfigClass)``

       The config used to govern the behavior of the :class:`~insert` operation


    .. attribute:: carbond.collections.Collection.InsertConfigClass

       :type: :class:`~carbond.collections.InsertConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.insert` operation config


    .. attribute:: carbond.collections.Collection.insertObjectConfig

       :type: Object
       :default: ``o({}, carbond.collections.InsertObjectConfigClass)``

       The config used to govern the behavior of the :class:`~insertObject` operation


    .. attribute:: carbond.collections.Collection.InsertObjectConfigClass

       :type: :class:`~carbond.collections.InsertObjectConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.insertObject` operation config


    .. attribute:: carbond.collections.Collection.removeConfig

       :type: Object
       :default: ``o({}, carbond.collections.RemoveConfigClass)``

       The config used to govern the behavior of the :class:`~remove` operation


    .. attribute:: carbond.collections.Collection.RemoveConfigClass

       :type: :class:`~carbond.collections.RemoveConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.remove` operation config


    .. attribute:: carbond.collections.Collection.removeObjectConfig

       :type: Object
       :default: ``o({}, carbond.collections.RemoveObjectConfigClass)``

       The config used to govern the behavior of the :class:`~removeObject` operation


    .. attribute:: carbond.collections.Collection.RemoveObjectConfigClass

       :type: :class:`~carbond.collections.RemoveObjectConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.removeObject` operation config


    .. attribute:: carbond.collections.Collection.saveConfig

       :type: Object
       :default: ``o({}, carbond.collections.SaveConfigClass)``

       The config used to govern the behavior of the :class:`~save` operation


    .. attribute:: carbond.collections.Collection.SaveConfigClass

       :type: :class:`~carbond.collections.SaveConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.save` operation config


    .. attribute:: carbond.collections.Collection.saveObjectConfig

       :type: Object
       :default: ``o({}, carbond.collections.SaveObjectConfigClass)``

       The config used to govern the behavior of the :class:`~saveObject` operation


    .. attribute:: carbond.collections.Collection.SaveObjectConfigClass

       :type: :class:`~carbond.collections.SaveObjectConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.saveObject` operation config


    .. attribute:: carbond.collections.Collection.schema

       :type: Object
       :default: :class:`~carbond.collection.Collection.defaultSchema`

       The schema used to validate objects in this collection


    .. attribute:: carbond.collections.Collection.supportsFind

       :type: boolean
       :required:

       Whether or not the ``find`` operation is supported


    .. attribute:: carbond.collections.Collection.supportsFindObject

       :type: boolean
       :required:

       Whether or not the ``findObject`` operation is supported


    .. attribute:: carbond.collections.Collection.supportsInsert

       :type: boolean
       :required:

       Whether or not the ``insert`` operation is supported


    .. attribute:: carbond.collections.Collection.supportsInsertObject

       :type: boolean
       :required:

       Whether or not the ``insertObject`` operation is supported


    .. attribute:: carbond.collections.Collection.supportsRemove

       :type: boolean
       :required:

       Whether or not the ``remove`` operation is supported


    .. attribute:: carbond.collections.Collection.supportsRemoveObject

       :type: boolean
       :required:

       Whether or not the ``removeObject`` operation is supported


    .. attribute:: carbond.collections.Collection.supportsSave

       :type: boolean
       :required:

       Whether or not the ``save`` operation is supported


    .. attribute:: carbond.collections.Collection.supportsSaveObject

       :type: boolean
       :required:

       Whether or not the ``saveObject`` operation is supported


    .. attribute:: carbond.collections.Collection.supportsUpdate

       :type: boolean
       :required:

       Whether or not the ``update`` operation is supported


    .. attribute:: carbond.collections.Collection.supportsUpdateObject

       :type: boolean
       :required:

       Whether or not the ``updateObject`` operation is supported


    .. attribute:: carbond.collections.Collection.updateConfig

       :type: Object
       :default: ``o({}, carbond.collections.UpdateConfigClass)``

       The config used to govern the behavior of the :class:`~update` operation


    .. attribute:: carbond.collections.Collection.UpdateConfigClass

       :type: :class:`~carbond.collections.UpdateConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.update` operation config


    .. attribute:: carbond.collections.Collection.updateObjectConfig

       :type: Object
       :default: ``o({}, carbond.collections.UpdateObjectConfigClass)``

       The config used to govern the behavior of the :class:`~updateObject` operation


    .. attribute:: carbond.collections.Collection.UpdateObjectConfigClass

       :type: :class:`~carbond.collections.UpdateObjectConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.updateObject` operation config


Methods
-------

.. class:: carbond.collections.Collection
    :noindex:
    :hidden:

    .. function:: carbond.collections.Collection.configureFindObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: carbond.collections.Collection.configureFindOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: carbond.collections.Collection.configureInsertObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: carbond.collections.Collection.configureInsertOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: carbond.collections.Collection.configureRemoveObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: carbond.collections.Collection.configureRemoveOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: carbond.collections.Collection.configureSaveObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: carbond.collections.Collection.configureSaveOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: carbond.collections.Collection.configureUpdateObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: carbond.collections.Collection.configureUpdateOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: carbond.collections.Collection.find(options)

        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.FindConfigClass`)
        :type options: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: Object[]

        Retrieve objects from a collection

    .. function:: carbond.collections.Collection.findObject(id, options)

        :param id: The object id
        :type id: string
        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.FindObjectConfigClass`)
        :type options: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: Object | null

        Retrieve a single object from a collection

    .. function:: carbond.collections.Collection.getOperationConfig(op)

        :param op: The operation name (e.g., "insert")
        :type op: string
        :rtype: :class:`~carbond.collections.CollectionOperationConfig`

        Get the config for an operation by name

    .. function:: carbond.collections.Collection.getOperationConfigFieldName(op)

        :param op: The operation name (e.g., "insert")
        :type op: string
        :rtype: string

        Get the property name for an operation config by name

    .. function:: carbond.collections.Collection.insert(objects, options)

        :param objects: An array of objects to insert
        :type objects: Array
        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.InsertConfigClass`)
        :type options: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: Object[]

        Bulk insert objects into a collection

    .. function:: carbond.collections.Collection.insertObject(object, options)

        :param object: An object to insert
        :type object: Object
        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.InsertObjectConfigClass`)
        :type options: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: Object

        Insert a single object into a collection

    .. function:: carbond.collections.Collection.postFind(result, options)

        :param result: The found object(s)
        :type result: Object[]
        :param options: The operation handler options
        :type options: Object
        :rtype: Object[]

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: carbond.collections.Collection.postFindObject(result, id, options)

        :param result: The found object
        :type result: Object | null
        :param id: The object id
        :type id: string
        :param options: The operation handler options
        :type options: Object
        :rtype: Object | null

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: carbond.collections.Collection.postFindObjectOperation(result, config, req, res)

        :param result: The found object
        :type result: Object | null
        :param config: The find object operation config
        :type config: :class:`~carbond.collections.Collection.FindObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: Object | null

        Update the HTTP response to reflect the result of the operation

    .. function:: carbond.collections.Collection.postFindOperation(result, config, req, res)

        :param result: The found objects
        :type result: Object[]
        :param config: The find operation config
        :type config: :class:`~carbond.collections.Collection.FindConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: Object[]

        Update the HTTP response to reflect the result of the operation

    .. function:: carbond.collections.Collection.postInsert(result, objects, options)

        :param result: The inserted object(s)
        :type result: Object[]
        :param objects: The object(s) to insert
        :type objects: Object[]
        :param options: The operation handler options
        :type options: Object
        :rtype: Object[]

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: carbond.collections.Collection.postInsertObject(result, object, options)

        :param result: The inserted object
        :type result: Object
        :param object: The object to insert
        :type object: Object
        :param options: The operation handler options
        :type options: Object
        :rtype: Object

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: carbond.collections.Collection.postInsertObjectOperation(result, config, req, res)

        :param result: The inserted object
        :type result: Object
        :param config: The insert object operation config
        :type config: :class:`~carbond.collections.Collection.InsertObjectConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: Object | null

        Update the HTTP response to reflect the result of the operation

    .. function:: carbond.collections.Collection.postInsertOperation(result, config, req, res)

        :param result: The inserted objects
        :type result: Object[]
        :param config: The insert operation config
        :type config: :class:`~carbond.collections.Collection.InsertConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: Object[] | null

        Update the HTTP response to reflect the result of the operation

    .. function:: carbond.collections.Collection.postRemove(result, options)

        :param result: The number of objects (or the object(s) themselves) removed
        :type result: number | array
        :param options: The operation handler options
        :type options: Object
        :rtype: number | array

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: carbond.collections.Collection.postRemoveObject(result, options)

        :param result: The number of objects (or the object itself) removed
        :type result: number | Object
        :param options: The operation handler options
        :type options: Object
        :rtype: number | array

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: carbond.collections.Collection.postRemoveObjectOperation(result, config, req, res)

        :param result: The number of objects removed or the removed object
        :type result: number | Object
        :param config: The remove object operation config
        :type config: :class:`~carbond.collections.Collection.RemoveObjectConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: Object

        Update the HTTP response to reflect the result of the operation. It should be noted that the result can be either a number or an object. If the underlying driver does not support returning the removed object, then the result will always be a number and :class:`~carbond.collections.RemoveObjectConfig.returnsRemovedObject` should be configured to reflect this.

    .. function:: carbond.collections.Collection.postRemoveOperation(result, config, req, res)

        :param result: The number of objects removed or the removed objec(s)
        :type result: number | array
        :param config: The remove operation config
        :type config: :class:`~carbond.collections.Collection.RemoveConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: Object

        Update the HTTP response to reflect the result of the operation. It should be noted that the result can be either a number or an array of object(s). If the underlying driver does not support returning the removed object(s), then the result will always be a number and :class:`~carbond.collections.RemoveConfig.returnsRemovedObjects` should be configured to reflect this.

    .. function:: carbond.collections.Collection.postSave(result, objects, options)

        :param result: The saved objects
        :type result: Object[]
        :param objects: The objects to save
        :type objects: Object[]
        :param options: The operation handler options
        :type options: Object
        :rtype: Object[]

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: carbond.collections.Collection.postSaveObject(result, object, options)

        :param result: The ``SaveObjectResult``
        :type result: :class:`~carbond.collections.Collection.SaveObjectResult`
        :param object: The object to save
        :type object: Object
        :param options: The operation handler options
        :type options: Object
        :rtype: :class:`~carbond.collections.Collection.SaveObjectResult`

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: carbond.collections.Collection.postSaveObjectOperation(result, config, req, res)

        :param result: The saved object and a flag to indicate if it was created rather than replaced
        :type result: :class:`~carbond.collections.Collection.SaveObjectResult`
        :param config: The save object operation config
        :type config: :class:`~carbond.collections.Collection.SaveObjectConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: Object[] | null

        Update the HTTP response to reflect the result of the operation

    .. function:: carbond.collections.Collection.postSaveOperation(result, config, req, res)

        :param result: The saved objects
        :type result: Object[]
        :param config: The save operation config
        :type config: :class:`~carbond.collections.Collection.SaveConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: Object[] | null

        Update the HTTP response to reflect the result of the operation

    .. function:: carbond.collections.Collection.postUpdate(result, update, options)

        :param result: The ``UpdateResult``
        :type result: :class:`~carbond.collections.Collection.UpdateResult`
        :param update: The update spec
        :type update: \*
        :param options: The operation handler options
        :type options: Object
        :rtype: :class:`~carbond.collections.Collection.UpdateResult`

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: carbond.collections.Collection.postUpdateObject(result, update, update, options)

        :param result: The ``UpdateResult``
        :type result: :class:`~carbond.collections.Collection.UpdateResult`
        :param update: The update spec
        :type update: string
        :param update: The update spec
        :type update: \*
        :param options: The operation handler options
        :type options: Object
        :rtype: :class:`~carbond.collections.Collection.UpdateResult`

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: carbond.collections.Collection.postUpdateObjectOperation(result, config, req, res)

        :param result: The number of objects updated/upserted or the upserted object
        :type result: :class:`~carbond.collections.Collection.UpdateObjectResult`
        :param config: The update object operation config
        :type config: :class:`~carbond.collections.Collection.UpdateObjectConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: Object

        Update the HTTP response to reflect the result of the operation. It should be noted that the result can be either a number or an object. If the underlying driver does not support returning the upserted object, then the result will always be a number and :class:`~carbond.collections.UpdateObjectConfig.returnsUpsertedObject` should be configured to reflect this.

    .. function:: carbond.collections.Collection.postUpdateOperation(result, config, req, res)

        :param result: The number of objects updated/upserted or the upserted object(s)
        :type result: :class:`~carbond.collections.Collection.UpdateResult`
        :param config: The update operation config
        :type config: :class:`~carbond.collections.Collection.UpdateConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: Object

        Update the HTTP response to reflect the result of the operation. It should be noted that the result can be either a number or an array of objects. If the underlying driver does not support returning the upserted object(s), then the result will always be a number and :class:`~carbond.collections.UpdateConfig.returnsUpsertedObjects` should be configured to reflect this.

    .. function:: carbond.collections.Collection.preFind(options)

        :param options: The operation handler options
        :type options: Object
        :rtype: :class:`~carbond.collections.Collection.PreFindResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: carbond.collections.Collection.preFindObject(id, options)

        :param id: The object id
        :type id: string
        :param options: The operation handler options
        :type options: Object
        :rtype: :class:`~carbond.collections.Collection.PreFindObjectResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: carbond.collections.Collection.preFindObjectOperation(config, req, res)

        :param config: The find object operation config
        :type config: :class:`~carbond.collections.FindObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: carbond.collections.Collection.preFindOperation(config, req, res)

        :param config: The find operation config
        :type config: :class:`~carbond.collections.FindConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: carbond.collections.Collection.preInsert(objects, options)

        :param objects: The objects to insert
        :type objects: Object[]
        :param options: The operation handler options
        :type options: Object
        :rtype: :class:`~carbond.collections.Collection.PreInsertResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: carbond.collections.Collection.preInsertObject(object, options)

        :param object: The object to insert
        :type object: Object
        :param options: The operation handler options
        :type options: Object
        :rtype: :class:`~carbond.collections.Collection.PreInsertObjectResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: carbond.collections.Collection.preInsertObjectOperation(config, req, res)

        :param config: The insert object operation config
        :type config: :class:`~carbond.collections.InsertObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: carbond.collections.Collection.preInsertOperation(config, req, res)

        :param config: The insert operation config
        :type config: :class:`~carbond.collections.InsertConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: carbond.collections.Collection.preRemove(options)

        :param options: The operation handler options
        :type options: Object
        :rtype: :class:`~carbond.collections.Collection.PreRemoveResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: carbond.collections.Collection.preRemoveObject(id, options)

        :param id: The object id
        :type id: string
        :param options: The operation handler options
        :type options: Object
        :rtype: :class:`~carbond.collections.Collection.PreRemoveObjectResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: carbond.collections.Collection.preRemoveObjectOperation(config, req, res)

        :param config: The remove object operation config
        :type config: :class:`~carbond.collections.RemoveObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: carbond.collections.Collection.preRemoveOperation(config, req, res)

        :param config: The remove operation config
        :type config: :class:`~carbond.collections.RemoveConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: carbond.collections.Collection.preSave(objects, options)

        :param objects: The objects to save
        :type objects: Object[]
        :param options: The operation handler options
        :type options: Object
        :rtype: :class:`~carbond.collections.Collection.PreSaveResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: carbond.collections.Collection.preSaveObject(object, options)

        :param object: The object to save
        :type object: Object
        :param options: The operation handler options
        :type options: Object
        :rtype: :class:`~carbond.collections.Collection.PreSaveObjectResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: carbond.collections.Collection.preSaveObjectOperation(config, req, res)

        :param config: The save object operation config
        :type config: :class:`~carbond.collections.SaveObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: carbond.collections.Collection.preSaveOperation(config, req, res)

        :param config: The save operation config
        :type config: :class:`~carbond.collections.SaveConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: carbond.collections.Collection.preUpdate(update, options)

        :param update: The update spec
        :type update: \*
        :param options: The operation handler options
        :type options: Object
        :rtype: :class:`~carbond.collections.Collection.PreUpdateResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: carbond.collections.Collection.preUpdateObject(id, update, options)

        :param id: The object id
        :type id: string
        :param update: The update spec
        :type update: \*
        :param options: The operation handler options
        :type options: Object
        :rtype: :class:`~carbond.collections.Collection.PreUpdateObjectResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: carbond.collections.Collection.preUpdateObjectOperation(config, req, res)

        :param config: The update object operation config
        :type config: :class:`~carbond.collections.UpdateObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: carbond.collections.Collection.preUpdateOperation(config, req, res)

        :param config: The update operation config
        :type config: :class:`~carbond.collections.UpdateConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: carbond.collections.Collection.remove(options)

        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.RemoveConfigClass`)
        :type options: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: number | array

        Remove objects from a collection

    .. function:: carbond.collections.Collection.removeObject(id, options)

        :param id: The ID of the object to remove
        :type id: String
        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.RemoveConfigClass`)
        :type options: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: number | Object

        Remove a specific object from a collection

    .. function:: carbond.collections.Collection.save(objects, options)

        :param objects: An array of objects (with IDs) to save
        :type objects: Array
        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.SaveConfigClass`)
        :type options: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: Object[]

        Replace the collection with an array of objects

    .. function:: carbond.collections.Collection.saveObject(object, options)

        :param object: The object to save (with ID)
        :type object: Object
        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.SaveObjectConfigClass`)
        :type options: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: :class:`~carbond.collections.Collection.SaveObjectResult`

        Replace or insert an object with a known ID

    .. function:: carbond.collections.Collection.update(update, options)

        :param update: The update to be applied to the collection
        :type update: \*
        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.UpdateConfigClass`)
        :type options: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: :class:`~carbond.collections.Collection.UpdateResult`

        Update (or upsert) a number of objects in a collection

    .. function:: carbond.collections.Collection.updateObject(id, update, options)

        :param id: The ID of the object to update
        :type id: string
        :param update: The update to be applied to the collection
        :type update: \*
        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.UpdateObjectConfigClass`)
        :type options: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: :class:`~carbond.collections.Collection.UpdateObjectResult`

        Update a specific object

.. _carbond.collections.Collection.ConfigureOperationResult:

=================================
Typedef: ConfigureOperationResult
=================================

Properties
----------

    .. attribute:: opConfig

       :type: :class:`~carbond.collection.CollectionOperationConfig`
       :required:

       The operation config


    .. attribute:: defaultResponses

       :type: :class:`~carbond.OperationResponse[]` | Object[]
       :required:

       A list of default responses (raw Objects will be converted to instances of :class:`~carbond.OperationResponse`)


.. _carbond.collections.Collection.PreFindObjectResult:

============================
Typedef: PreFindObjectResult
============================

Properties
----------

    .. attribute:: id

       :type: string
       :default: undefined

       The object id


    .. attribute:: options

       :type: Object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreFindResult:

======================
Typedef: PreFindResult
======================

Properties
----------

    .. attribute:: options

       :type: Object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreInsertObjectResult:

==============================
Typedef: PreInsertObjectResult
==============================

Properties
----------

    .. attribute:: object

       :type: Object
       :default: undefined

       The object to insert


    .. attribute:: options

       :type: Object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreInsertResult:

========================
Typedef: PreInsertResult
========================

Properties
----------

    .. attribute:: objects

       :type: Object[]
       :default: undefined

       The objects to insert


    .. attribute:: options

       :type: Object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreOperationResult:

===========================
Typedef: PreOperationResult
===========================

Properties
----------

    .. attribute:: options

       :type: Object
       :required:

       A map of parameters to be passed to the operation handler. Note, this is generally just ``req.parameters``.


.. _carbond.collections.Collection.PreRemoveObjectResult:

==============================
Typedef: PreRemoveObjectResult
==============================

Properties
----------

    .. attribute:: id

       :type: string
       :default: undefined

       The object id


    .. attribute:: options

       :type: Object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreRemoveResult:

========================
Typedef: PreRemoveResult
========================

Properties
----------

    .. attribute:: options

       :type: Object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreSaveObjectResult:

============================
Typedef: PreSaveObjectResult
============================

Properties
----------

    .. attribute:: object

       :type: Object
       :default: undefined

       The object to save


    .. attribute:: options

       :type: Object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreSaveResult:

======================
Typedef: PreSaveResult
======================

Properties
----------

    .. attribute:: objects

       :type: Object[]
       :default: undefined

       The objects to save


    .. attribute:: options

       :type: Object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreUpdateObjectResult:

==============================
Typedef: PreUpdateObjectResult
==============================

Properties
----------

    .. attribute:: id

       :type: string
       :default: undefined

       The object id


    .. attribute:: update

       :type: \*
       :default: undefined

       The update spec


    .. attribute:: options

       :type: Object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreUpdateResult:

========================
Typedef: PreUpdateResult
========================

Properties
----------

    .. attribute:: update

       :type: \*
       :default: undefined

       The update spec


    .. attribute:: options

       :type: Object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.SaveObjectResult:

=========================
Typedef: SaveObjectResult
=========================

Properties
----------

    .. attribute:: val

       :type: Object
       :required:

       The saved object


    .. attribute:: created

       :type: boolean
       :required:

       A flag indicating whether the object was created or replaced


.. _carbond.collections.Collection.UpdateObjectResult:

===========================
Typedef: UpdateObjectResult
===========================

Properties
----------

    .. attribute:: val

       :type: number | Object
       :required:

       The number of objects updated if no upsert took place, the number of objects upserted if configured not to return upserted objects, or the upserted object(s) if configured to return the upserted object(s) (see: :class:`~carbond.collections.Collection.UpdateObjectConfigClass`)


    .. attribute:: created

       :type: boolean
       :required:

       A flag indicating whether an upsert took place


.. _carbond.collections.Collection.UpdateResult:

=====================
Typedef: UpdateResult
=====================

Properties
----------

    .. attribute:: val

       :type: number | Object
       :required:

       The number of objects updated if no upsert took place, the number of objects upserted if configured not to return upserted objects, or the upserted object(s) if configured to return the upserted object(s) (see: :class:`~carbond.collections.Collection.UpdateConfigClass`)


    .. attribute:: created

       :type: boolean
       :required:

       A flag indicating whether an upsert took place

