.. class:: carbond.collections.Collection
    :heading:

.. |br| raw:: html

   <br />

==============================
carbond.collections.Collection
==============================
*extends* :class:`~carbond.Endpoint`

Provides a highlevel abstraction for defining Endpoints that behave like a RESTful collection of resources

Properties
----------

.. class:: carbond.collections.Collection
    :noindex:
    :hidden:

    .. attribute:: ALL_COLLECTION_OPERATIONS

       :type: array
       :required:
       :ro:

       The list of valid collection operations


    .. attribute:: defaultErrorSchema

       :type: object
       :required:
       :ro:

       This is the default error body schema.


    .. attribute:: defaultIdHeader

       :type: string
       :required:
       :ro:

       The default ID header name


    .. attribute:: defaultIdParameter

       :type: string
       :required:
       :ro:

       The default ID name of objects in this collection


    .. attribute:: defaultIdPathParameter

       :type: string
       :required:
       :ro:

       The default path parameter name representing the ID for an object in this collection


    .. attribute:: defaultSchema

       :type: object
       :required:
       :ro:

       This is the default schema used to validate all objects in this collection. If a schema is not specified explicitly, this schema will be used.


    .. attribute:: enabled

       :type: object
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



    .. attribute:: example

       :type: object
       :default: undefined

       An example object for this collection


    .. attribute:: findConfig

       :type: object
       :default: ``o({}, carbond.collections.FindConfigClass)``

       The config used to govern the behavior of the :class:`~find` operation


    .. attribute:: FindConfigClass

       :type: :class:`~carbond.collections.FindConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.find` operation config


    .. attribute:: findObjectConfig

       :type: object
       :default: ``o({}, carbond.collections.FindObjectConfigClass)``

       The config used to govern the behavior of the :class:`~findObject` operation


    .. attribute:: FindObjectConfigClass

       :type: :class:`~carbond.collections.FindObjectConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.findObject` operation config


    .. attribute:: idGenerator

       :type: object
       :default: undefined

       An object with the method "generateId" that will be called to populate ID if present and when appropriate (e.g. :class:`~carbond.collection.Colleciont.insert`)


    .. attribute:: idHeader

       :type: string
       :default: :class:`~carbond.collection.Collection.defaultIdHeader`

       The header name which should contain the EJSON serialized ID


    .. attribute:: idParameter

       :type: string
       :default: :class:`~carbond.collection.Collection.defaultIdParameter`

       The ID parameter name (XXX: rename to "objectIdName" since this is not a "parameter" name?)


    .. attribute:: idPathParameter

       :type: string
       :default: :class:`~carbond.collection.Collection.defaultIdParameter`

       The PATH_ID parameter name (e.g., /collection/:PATH_ID)


    .. attribute:: insertConfig

       :type: object
       :default: ``o({}, carbond.collections.InsertConfigClass)``

       The config used to govern the behavior of the :class:`~insert` operation


    .. attribute:: InsertConfigClass

       :type: :class:`~carbond.collections.InsertConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.insert` operation config


    .. attribute:: insertObjectConfig

       :type: object
       :default: ``o({}, carbond.collections.InsertObjectConfigClass)``

       The config used to govern the behavior of the :class:`~insertObject` operation


    .. attribute:: InsertObjectConfigClass

       :type: :class:`~carbond.collections.InsertObjectConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.insertObject` operation config


    .. attribute:: removeConfig

       :type: object
       :default: ``o({}, carbond.collections.RemoveConfigClass)``

       The config used to govern the behavior of the :class:`~remove` operation


    .. attribute:: RemoveConfigClass

       :type: :class:`~carbond.collections.RemoveConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.remove` operation config


    .. attribute:: removeObjectConfig

       :type: object
       :default: ``o({}, carbond.collections.RemoveObjectConfigClass)``

       The config used to govern the behavior of the :class:`~removeObject` operation


    .. attribute:: RemoveObjectConfigClass

       :type: :class:`~carbond.collections.RemoveObjectConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.removeObject` operation config


    .. attribute:: saveConfig

       :type: object
       :default: ``o({}, carbond.collections.SaveConfigClass)``

       The config used to govern the behavior of the :class:`~save` operation


    .. attribute:: SaveConfigClass

       :type: :class:`~carbond.collections.SaveConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.save` operation config


    .. attribute:: saveObjectConfig

       :type: object
       :default: ``o({}, carbond.collections.SaveObjectConfigClass)``

       The config used to govern the behavior of the :class:`~saveObject` operation


    .. attribute:: SaveObjectConfigClass

       :type: :class:`~carbond.collections.SaveObjectConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.saveObject` operation config


    .. attribute:: schema

       :type: object
       :default: :class:`~carbond.collection.Collection.defaultSchema`

       The schema used to validate objects in this collection


    .. attribute:: supportsFind

       :type: boolean
       :required:

       Whether or not the ``find`` operation is supported


    .. attribute:: supportsFindObject

       :type: boolean
       :required:

       Whether or not the ``findObject`` operation is supported


    .. attribute:: supportsInsert

       :type: boolean
       :required:

       Whether or not the ``insert`` operation is supported


    .. attribute:: supportsInsertObject

       :type: boolean
       :required:

       Whether or not the ``insertObject`` operation is supported


    .. attribute:: supportsRemove

       :type: boolean
       :required:

       Whether or not the ``remove`` operation is supported


    .. attribute:: supportsRemoveObject

       :type: boolean
       :required:

       Whether or not the ``removeObject`` operation is supported


    .. attribute:: supportsSave

       :type: boolean
       :required:

       Whether or not the ``save`` operation is supported


    .. attribute:: supportsSaveObject

       :type: boolean
       :required:

       Whether or not the ``saveObject`` operation is supported


    .. attribute:: supportsUpdate

       :type: boolean
       :required:

       Whether or not the ``update`` operation is supported


    .. attribute:: supportsUpdateObject

       :type: boolean
       :required:

       Whether or not the ``updateObject`` operation is supported


    .. attribute:: updateConfig

       :type: object
       :default: ``o({}, carbond.collections.UpdateConfigClass)``

       The config used to govern the behavior of the :class:`~update` operation


    .. attribute:: UpdateConfigClass

       :type: :class:`~carbond.collections.UpdateConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.update` operation config


    .. attribute:: updateObjectConfig

       :type: object
       :default: ``o({}, carbond.collections.UpdateObjectConfigClass)``

       The config used to govern the behavior of the :class:`~updateObject` operation


    .. attribute:: UpdateObjectConfigClass

       :type: :class:`~carbond.collections.UpdateObjectConfig`
       :required:
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.updateObject` operation config


Methods
-------

.. class:: carbond.collections.Collection
    :noindex:
    :hidden:

    .. function:: configureFindObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureFindObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureInsertObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureInsertOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureRemoveObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureRemoveOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureSaveObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureSaveOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureUpdateObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureUpdateOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: find(context, options)

        :param context: The operation parameters (see: :class:`~carbond.collections.Collection.FindConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :class:`~carbond.collections.Collection.FindConfigClass.options`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: object[]

        Retrieve objects from a collection

    .. function:: findObject(id, context, options)

        :param id: The object id
        :type id: string
        :param context: The operation parameters (see: :class:`~carbond.collections.Collection.FindObjectConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :class:`~carbond.collections.Collection.FindObjectConfigClass.options`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: object | null

        Retrieve a single object from a collection

    .. function:: getOperationConfig(op)

        :param op: The operation name (e.g., "insert")
        :type op: string
        :rtype: :class:`~carbond.collections.CollectionOperationConfig`

        Get the config for an operation by name

    .. function:: getOperationConfigFieldName(op)

        :param op: The operation name (e.g., "insert")
        :type op: string
        :rtype: string

        Get the property name for an operation config by name

    .. function:: insert(objects, context, options)

        :param objects: An array of objects to insert
        :type objects: Array
        :param context: The operation parameters (see: :class:`~carbond.collections.Collection.InsertConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :class:`~carbond.collections.Collection.InsertConfigClass.options`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: object[]

        Bulk insert objects into a collection

    .. function:: insertObject(object, context, options)

        :param object: An object to insert
        :type object: object
        :param context: The operation parameters (see: :class:`~carbond.collections.Collection.InsertObjectConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :class:`~carbond.collections.Collection.InsertObjectConfigClass.options`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: object

        Insert a single object into a collection

    .. function:: postFind(result, context, options)

        :param result: The found object(s)
        :type result: object[]
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: object[]

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postFindObject(result, id, context, options)

        :param result: The found object
        :type result: object | null
        :param id: The object id
        :type id: string
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: object | null

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postFindObjectOperation(result, config, req, res)

        :param result: The found object
        :type result: object | null
        :param config: The find object operation config
        :type config: :class:`~carbond.collections.Collection.FindObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object | null

        Update the HTTP response to reflect the result of the operation

    .. function:: postFindOperation(result, config, req, res)

        :param result: The found objects
        :type result: object[]
        :param config: The find operation config
        :type config: :class:`~carbond.collections.Collection.FindConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object[]

        Update the HTTP response to reflect the result of the operation

    .. function:: postInsert(result, objects, context, options)

        :param result: The inserted object(s)
        :type result: object[]
        :param objects: The object(s) to insert
        :type objects: object[]
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: object[]

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postInsertObject(result, object, context, options)

        :param result: The inserted object
        :type result: object
        :param object: The object to insert
        :type object: object
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: object

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postInsertObjectOperation(result, config, req, res)

        :param result: The inserted object
        :type result: object
        :param config: The insert object operation config
        :type config: :class:`~carbond.collections.Collection.InsertObjectConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object | null

        Update the HTTP response to reflect the result of the operation

    .. function:: postInsertOperation(result, config, req, res)

        :param result: The inserted objects
        :type result: object[]
        :param config: The insert operation config
        :type config: :class:`~carbond.collections.Collection.InsertConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object[] | null

        Update the HTTP response to reflect the result of the operation

    .. function:: postRemove(result, context, options)

        :param result: The number of objects (or the object(s) themselves) removed
        :type result: number | array
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: number | array

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postRemoveObject(result, context, options)

        :param result: The number of objects (or the object itself) removed
        :type result: number | object
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: number | array

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postRemoveObjectOperation(result, config, req, res)

        :param result: The number of objects removed or the removed object
        :type result: number | object
        :param config: The remove object operation config
        :type config: :class:`~carbond.collections.Collection.RemoveObjectConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object

        Update the HTTP response to reflect the result of the operation. It should be noted that the result can be either a number or an object. If the underlying driver does not support returning the removed object, then the result will always be a number and :class:`~carbond.collections.RemoveObjectConfig.returnsRemovedObject` should be configured to reflect this.

    .. function:: postRemoveOperation(result, config, req, res)

        :param result: The number of objects removed or the removed objec(s)
        :type result: number | array
        :param config: The remove operation config
        :type config: :class:`~carbond.collections.Collection.RemoveConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object

        Update the HTTP response to reflect the result of the operation. It should be noted that the result can be either a number or an array of object(s). If the underlying driver does not support returning the removed object(s), then the result will always be a number and :class:`~carbond.collections.RemoveConfig.returnsRemovedObjects` should be configured to reflect this.

    .. function:: postSave(result, objects, context, options)

        :param result: The saved objects
        :type result: object[]
        :param objects: The objects to save
        :type objects: object[]
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: object[]

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postSaveObject(result, object, context, options)

        :param result: The ``SaveObjectResult``
        :type result: :class:`~carbond.collections.Collection.SaveObjectResult`
        :param object: The object to save
        :type object: object
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.SaveObjectResult`

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postSaveObjectOperation(result, config, req, res)

        :param result: The saved object and a flag to indicate if it was created rather than replaced
        :type result: :class:`~carbond.collections.Collection.SaveObjectResult`
        :param config: The save object operation config
        :type config: :class:`~carbond.collections.Collection.SaveObjectConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object[] | null

        Update the HTTP response to reflect the result of the operation

    .. function:: postSaveOperation(result, config, req, res)

        :param result: The saved objects
        :type result: object[]
        :param config: The save operation config
        :type config: :class:`~carbond.collections.Collection.SaveConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object[] | null

        Update the HTTP response to reflect the result of the operation

    .. function:: postUpdate(result, update, context, options)

        :param result: The ``UpdateResult``
        :type result: :class:`~carbond.collections.Collection.UpdateResult`
        :param update: The update spec
        :type update: \*
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.UpdateResult`

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postUpdateObject(result, update, update, context, options)

        :param result: The ``UpdateResult``
        :type result: :class:`~carbond.collections.Collection.UpdateResult`
        :param update: The update spec
        :type update: string
        :param update: The update spec
        :type update: \*
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.UpdateResult`

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postUpdateObjectOperation(result, config, req, res)

        :param result: The number of objects updated/upserted or the upserted object
        :type result: :class:`~carbond.collections.Collection.UpdateObjectResult`
        :param config: The update object operation config
        :type config: :class:`~carbond.collections.Collection.UpdateObjectConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object

        Update the HTTP response to reflect the result of the operation. It should be noted that the result can be either a number or an object. If the underlying driver does not support returning the upserted object, then the result will always be a number and :class:`~carbond.collections.UpdateObjectConfig.returnsUpsertedObject` should be configured to reflect this.

    .. function:: postUpdateOperation(result, config, req, res)

        :param result: The number of objects updated/upserted or the upserted object(s)
        :type result: :class:`~carbond.collections.Collection.UpdateResult`
        :param config: The update operation config
        :type config: :class:`~carbond.collections.Collection.UpdateConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object

        Update the HTTP response to reflect the result of the operation. It should be noted that the result can be either a number or an array of objects. If the underlying driver does not support returning the upserted object(s), then the result will always be a number and :class:`~carbond.collections.UpdateConfig.returnsUpsertedObjects` should be configured to reflect this.

    .. function:: preFind(context, options)

        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreFindResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preFindObject(id, context, options)

        :param id: The object id
        :type id: string
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreFindObjectResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preFindObjectOperation(config, req, res)

        :param config: The find object operation config
        :type config: :class:`~carbond.collections.FindObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preFindOperation(config, req, res)

        :param config: The find operation config
        :type config: :class:`~carbond.collections.FindConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preInsert(objects, context, options)

        :param objects: The objects to insert
        :type objects: object[]
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreInsertResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preInsertObject(object, context, options)

        :param object: The object to insert
        :type object: object
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreInsertObjectResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preInsertObjectOperation(config, req, res)

        :param config: The insert object operation config
        :type config: :class:`~carbond.collections.InsertObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preInsertOperation(config, req, res)

        :param config: The insert operation config
        :type config: :class:`~carbond.collections.InsertConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preRemove(context, options)

        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreRemoveResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preRemoveObject(id, context, options)

        :param id: The object id
        :type id: string
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreRemoveObjectResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preRemoveObjectOperation(config, req, res)

        :param config: The remove object operation config
        :type config: :class:`~carbond.collections.RemoveObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preRemoveOperation(config, req, res)

        :param config: The remove operation config
        :type config: :class:`~carbond.collections.RemoveConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preSave(objects, context, options)

        :param objects: The objects to save
        :type objects: object[]
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreSaveResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preSaveObject(object, context, options)

        :param object: The object to save
        :type object: object
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreSaveObjectResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preSaveObjectOperation(config, req, res)

        :param config: The save object operation config
        :type config: :class:`~carbond.collections.SaveObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preSaveOperation(config, req, res)

        :param config: The save operation config
        :type config: :class:`~carbond.collections.SaveConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preUpdate(update, context, options)

        :param update: The update spec
        :type update: \*
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreUpdateResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preUpdateObject(id, update, context, options)

        :param id: The object id
        :type id: string
        :param update: The update spec
        :type update: \*
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreUpdateObjectResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preUpdateObjectOperation(config, req, res)

        :param config: The update object operation config
        :type config: :class:`~carbond.collections.UpdateObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preUpdateOperation(config, req, res)

        :param config: The update operation config
        :type config: :class:`~carbond.collections.UpdateConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: remove(context, options)

        :param context: The operation parameters (see: :class:`~carbond.collections.Collection.RemoveConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :class:`~carbond.collections.Collection.RemoveConfigClass.options`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: number | array

        Remove objects from a collection

    .. function:: removeObject(id, context, options)

        :param id: The ID of the object to remove
        :type id: String
        :param context: The operation parameters (see: :class:`~carbond.collections.Collection.RemoveConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :class:`~carbond.collections.Collection.RemoveConfigClass.options`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: number | object

        Remove a specific object from a collection

    .. function:: save(objects, context, options)

        :param objects: An array of objects (with IDs) to save
        :type objects: Array
        :param context: The operation parameters (see: :class:`~carbond.collections.Collection.SaveConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :class:`~carbond.collections.Collection.SaveConfigClass.options`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: object[]

        Replace the collection with an array of objects

    .. function:: saveObject(object, context, options)

        :param object: The object to save (with ID)
        :type object: object
        :param context: The operation parameters (see: :class:`~carbond.collections.Collection.SaveObjectConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :class:`~carbond.collections.Collection.SaveObjectConfigClass.options`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: :class:`~carbond.collections.Collection.SaveObjectResult`

        Replace or insert an object with a known ID

    .. function:: update(update, context, options)

        :param update: The update to be applied to the collection
        :type update: \*
        :param context: The operation parameters (see: :class:`~carbond.collections.Collection.UpdateConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :class:`~carbond.collections.Collection.UpdateConfigClass.options`)
        :type options: object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: :class:`~carbond.collections.Collection.UpdateResult`

        Update (or upsert) a number of objects in a collection

    .. function:: updateObject(id, update, context, options)

        :param id: The ID of the object to update
        :type id: string
        :param update: The update to be applied to the collection
        :type update: \*
        :param context: The operation parameters (see: :class:`~carbond.collections.Collection.UpdateObjectConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :class:`~carbond.collections.Collection.UpdateObjectConfigClass.options`)
        :type options: object
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

       :type: :class:`~carbond.OperationResponse[]` | object[]
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


    .. attribute:: context

       :type: object
       :default: undefined

       The operation handler context


    .. attribute:: options

       :type: object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreFindResult:

======================
Typedef: PreFindResult
======================

Properties
----------

    .. attribute:: context

       :type: object
       :default: undefined

       The operation handler context


    .. attribute:: options

       :type: object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreInsertObjectResult:

==============================
Typedef: PreInsertObjectResult
==============================

Properties
----------

    .. attribute:: object

       :type: object
       :default: undefined

       The object to insert


    .. attribute:: context

       :type: object
       :default: undefined

       The operation handler context


    .. attribute:: options

       :type: object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreInsertResult:

========================
Typedef: PreInsertResult
========================

Properties
----------

    .. attribute:: objects

       :type: objects[]
       :default: undefined

       The objects to insert


    .. attribute:: context

       :type: object
       :default: undefined

       The operation handler context


    .. attribute:: options

       :type: object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreOperationResult:

===========================
Typedef: PreOperationResult
===========================

Properties
----------

    .. attribute:: context

       :type: object
       :required:

       A map of parameters to be passed to the operation handler. Note, this is generally just ``req.parameters``.


    .. attribute:: options

       :type: object
       :required:

       A map of options to be passed to the underlying driver used to communicate with the backing datastore. Generally, this will be pulled straight from :class:`~carbond.collections.CollectionOperationConfig.options`, however, the pre operation method can be overridden to extend options based on the current request.


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


    .. attribute:: context

       :type: object
       :default: undefined

       The operation handler context


    .. attribute:: options

       :type: object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreRemoveResult:

========================
Typedef: PreRemoveResult
========================

Properties
----------

    .. attribute:: context

       :type: object
       :default: undefined

       The operation handler context


    .. attribute:: options

       :type: object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreSaveObjectResult:

============================
Typedef: PreSaveObjectResult
============================

Properties
----------

    .. attribute:: object

       :type: object
       :default: undefined

       The object to save


    .. attribute:: context

       :type: object
       :default: undefined

       The operation handler context


    .. attribute:: options

       :type: object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreSaveResult:

======================
Typedef: PreSaveResult
======================

Properties
----------

    .. attribute:: objects

       :type: object[]
       :default: undefined

       The objects to save


    .. attribute:: context

       :type: object
       :default: undefined

       The operation handler context


    .. attribute:: options

       :type: object
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


    .. attribute:: context

       :type: object
       :default: undefined

       The operation handler context


    .. attribute:: options

       :type: object
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


    .. attribute:: context

       :type: object
       :default: undefined

       The operation handler context


    .. attribute:: options

       :type: object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.SaveObjectResult:

=========================
Typedef: SaveObjectResult
=========================

Properties
----------

    .. attribute:: val

       :type: object
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

       :type: number | object
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

       :type: number | object
       :required:

       The number of objects updated if no upsert took place, the number of objects upserted if configured not to return upserted objects, or the upserted object(s) if configured to return the upserted object(s) (see: :class:`~carbond.collections.Collection.UpdateConfigClass`)


    .. attribute:: created

       :type: boolean
       :required:

       A flag indicating whether an upsert took place

