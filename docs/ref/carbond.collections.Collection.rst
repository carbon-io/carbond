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

    .. attribute:: enabled

       :type: object
       :default: ``{'*': false}``

       Control which collection level operations


    .. attribute:: enabled.*

       :type: boolean
       :default: ``{'*': false}``

       The default value for all operations that are not explicitly specified


    .. attribute:: enabled.insert

       :type: boolean
       :default: ``{'*': false}``

       Enable or disable the insert operation


    .. attribute:: enabled.find

       :type: boolean
       :default: ``{'*': false}``

       Enable or disable the find operation


    .. attribute:: enabled.save

       :type: boolean
       :default: ``{'*': false}``

       Enable or disable the save operation


    .. attribute:: enabled.update

       :type: boolean
       :default: ``{'*': false}``

       Enable or disable the update operation


    .. attribute:: enabled.remove

       :type: boolean
       :default: ``{'*': false}``

       Enable or disable the remove operation


    .. attribute:: enabled.insertObject

       :type: boolean
       :default: ``{'*': false}``

       Enable or disable the insertObject operation


    .. attribute:: enabled.findObject

       :type: boolean
       :default: ``{'*': false}``

       Enable or disable the findObject operation


    .. attribute:: enabled.saveObject

       :type: boolean
       :default: ``{'*': false}``

       Enable or disable the saveObject operation


    .. attribute:: enabled.updateObject

       :type: boolean
       :default: ``{'*': false}``

       Enable or disable the updateObject operation


    .. attribute:: enabled.removeObject

       :type: boolean
       :default: ``{'*': false}``

       Enable or disable the removeObject operation


    .. attribute:: schema

       :type: object
       :default: ``:attr:`~carbond.collection.Collection.defaultSchema```

       The schema used to validate objects in this collection


    .. attribute:: example

       :type: object
       :default: ``undefined``

       An example object for this collection


    .. attribute:: idGenerator

       :type: object
       :default: ``undefined``

       An object with the method "generateId" that will be called to populate ID if present and when appropriate (e.g. :attr:`~carbond.collection.Colleciont.insert`)


    .. attribute:: idPathParameter

       :type: string
       :default: ``:attr:`~carbond.collection.Collection.defaultIdParameter```

       The PATH_ID parameter name (e.g., /collection/:PATH_ID)


    .. attribute:: idParameter

       :type: string
       :default: ``:attr:`~carbond.collection.Collection.defaultIdParameter```

       The ID parameter name (XXX: rename to "objectIdName" since this is not a "parameter" name?)


    .. attribute:: idHeader

       :type: string
       :default: ``:attr:`~carbond.collection.Collection.defaultIdHeader```

       The header name which should contain the EJSON serialized ID


    .. attribute:: insertConfig

       :type: object
       :default: ``o({}, carbond.collections.InsertConfigClass)``

       The config used to govern the behavior of the :attr:`~insert` operation


    .. attribute:: insertObjectConfig

       :type: object
       :default: ``o({}, carbond.collections.InsertObjectConfigClass)``

       The config used to govern the behavior of the :attr:`~insertObject` operation


    .. attribute:: findConfig

       :type: object
       :default: ``o({}, carbond.collections.FindConfigClass)``

       The config used to govern the behavior of the :attr:`~find` operation


    .. attribute:: findObjectConfig

       :type: object
       :default: ``o({}, carbond.collections.FindObjectConfigClass)``

       The config used to govern the behavior of the :attr:`~findObject` operation


    .. attribute:: saveConfig

       :type: object
       :default: ``o({}, carbond.collections.SaveConfigClass)``

       The config used to govern the behavior of the :attr:`~save` operation


    .. attribute:: saveObjectConfig

       :type: object
       :default: ``o({}, carbond.collections.SaveObjectConfigClass)``

       The config used to govern the behavior of the :attr:`~saveObject` operation


    .. attribute:: updateConfig

       :type: object
       :default: ``o({}, carbond.collections.UpdateConfigClass)``

       The config used to govern the behavior of the :attr:`~update` operation


    .. attribute:: updateObjectConfig

       :type: object
       :default: ``o({}, carbond.collections.UpdateObjectConfigClass)``

       The config used to govern the behavior of the :attr:`~updateObject` operation


    .. attribute:: removeConfig

       :type: object
       :default: ``o({}, carbond.collections.RemoveConfigClass)``

       The config used to govern the behavior of the :attr:`~remove` operation


    .. attribute:: removeObjectConfig

       :type: object
       :default: ``o({}, carbond.collections.RemoveObjectConfigClass)``

       The config used to govern the behavior of the :attr:`~removeObject` operation


    .. attribute:: ALL_COLLECTION_OPERATIONS

       :type: array
       :required:
       :ro:

       The list of valid collection operations


    .. attribute:: defaultIdPathParameter

       :type: string
       :required:
       :ro:

       The default path parameter name representing the ID for an object in this collection


    .. attribute:: defaultIdParameter

       :type: string
       :required:
       :ro:

       The default ID name of objects in this collection


    .. attribute:: defaultIdHeader

       :type: string
       :required:
       :ro:

       The default ID header name


    .. attribute:: defaultSchema

       :type: object
       :required:
       :ro:

       This is the default schema used to validate all objects in this collection. If a schema is not specified explicitly, this schema will be used.


    .. attribute:: defaultErrorSchema

       :type: object
       :required:
       :ro:

       This is the default error body schema.


    .. attribute:: InsertConfigClass

       :type: :class:`~carbond.collections.InsertConfig`
       :required:
       :ro:

       The config class used to instantiate the :attr:`~carbond.collections.Collection.insert` operation config


    .. attribute:: InsertObjectConfigClass

       :type: :class:`~carbond.collections.InsertObjectConfig`
       :required:
       :ro:

       The config class used to instantiate the :attr:`~carbond.collections.Collection.insertObject` operation config


    .. attribute:: FindConfigClass

       :type: :class:`~carbond.collections.FindConfig`
       :required:
       :ro:

       The config class used to instantiate the :attr:`~carbond.collections.Collection.find` operation config


    .. attribute:: FindObjectConfigClass

       :type: :class:`~carbond.collections.FindObjectConfig`
       :required:
       :ro:

       The config class used to instantiate the :attr:`~carbond.collections.Collection.findObject` operation config


    .. attribute:: SaveConfigClass

       :type: :class:`~carbond.collections.SaveConfig`
       :required:
       :ro:

       The config class used to instantiate the :attr:`~carbond.collections.Collection.save` operation config


    .. attribute:: SaveObjectConfigClass

       :type: :class:`~carbond.collections.SaveObjectConfig`
       :required:
       :ro:

       The config class used to instantiate the :attr:`~carbond.collections.Collection.saveObject` operation config


    .. attribute:: UpdateConfigClass

       :type: :class:`~carbond.collections.UpdateConfig`
       :required:
       :ro:

       The config class used to instantiate the :attr:`~carbond.collections.Collection.update` operation config


    .. attribute:: UpdateObjectConfigClass

       :type: :class:`~carbond.collections.UpdateObjectConfig`
       :required:
       :ro:

       The config class used to instantiate the :attr:`~carbond.collections.Collection.updateObject` operation config


    .. attribute:: RemoveConfigClass

       :type: :class:`~carbond.collections.RemoveConfig`
       :required:
       :ro:

       The config class used to instantiate the :attr:`~carbond.collections.Collection.remove` operation config


    .. attribute:: RemoveObjectConfigClass

       :type: :class:`~carbond.collections.RemoveObjectConfig`
       :required:
       :ro:

       The config class used to instantiate the :attr:`~carbond.collections.Collection.removeObject` operation config


    .. attribute:: supportsInsert

       :type: boolean
       :required:

       Whether or not the ``insert`` operation is supported


    .. attribute:: supportsInsertObject

       :type: boolean
       :required:

       Whether or not the ``insertObject`` operation is supported


    .. attribute:: supportsFind

       :type: boolean
       :required:

       Whether or not the ``find`` operation is supported


    .. attribute:: supportsFindObject

       :type: boolean
       :required:

       Whether or not the ``findObject`` operation is supported


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


    .. attribute:: supportsRemove

       :type: boolean
       :required:

       Whether or not the ``remove`` operation is supported


    .. attribute:: supportsRemoveObject

       :type: boolean
       :required:

       Whether or not the ``removeObject`` operation is supported


Methods
-------

.. class:: carbond.collections.Collection
    :noindex:
    :hidden:

    .. function:: insert(objects, context, options)

        :param objects: An array of objects to insert
        :type objects: Array
        :param context: The operation parameters (see: :attr:`~carbond.collections.Collection.InsertConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :attr:`~carbond.collections.Collection.InsertConfigClass.options`)
        :type options: object
        :throws :class:`~carbond.collections.errors.CollectionError`: 
        :rtype: object[]

        Bulk insert objects into a collection

    .. function:: insertObject(object, context, options)

        :param object: An object to insert
        :type object: object
        :param context: The operation parameters (see: :attr:`~carbond.collections.Collection.InsertObjectConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :attr:`~carbond.collections.Collection.InsertObjectConfigClass.options`)
        :type options: object
        :throws :class:`~carbond.collections.errors.CollectionError`: 
        :rtype: object

        Insert a single object into a collection

    .. function:: find(context, options)

        :param context: The operation parameters (see: :attr:`~carbond.collections.Collection.FindConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :attr:`~carbond.collections.Collection.FindConfigClass.options`)
        :type options: object
        :throws :class:`~carbond.collections.errors.CollectionError`: 
        :rtype: object[]

        Retrieve objects from a collection

    .. function:: findObject(id, context, options)

        :param id: The object id
        :type id: string
        :param context: The operation parameters (see: :attr:`~carbond.collections.Collection.FindObjectConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :attr:`~carbond.collections.Collection.FindObjectConfigClass.options`)
        :type options: object
        :throws :class:`~carbond.collections.errors.CollectionError`: 
        :rtype: object | null

        Retrieve a single object from a collection

    .. function:: save(objects, context, options)

        :param objects: An array of objects (with IDs) to save
        :type objects: Array
        :param context: The operation parameters (see: :attr:`~carbond.collections.Collection.SaveConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :attr:`~carbond.collections.Collection.SaveConfigClass.options`)
        :type options: object
        :throws :class:`~carbond.collections.errors.CollectionError`: 
        :rtype: object[]

        Replace the collection with an array of objects

    .. function:: saveObject(object, context, options)

        :param object: The object to save (with ID)
        :type object: object
        :param context: The operation parameters (see: :attr:`~carbond.collections.Collection.SaveObjectConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :attr:`~carbond.collections.Collection.SaveObjectConfigClass.options`)
        :type options: object
        :throws :class:`~carbond.collections.errors.CollectionError`: 
        :rtype: :class:`~carbond.collections.Collection.SaveObjectResult`

        Replace or insert an object with a known ID

    .. function:: update(update, context, options)

        :param update: The update to be applied to the collection
        :type update: *
        :param context: The operation parameters (see: :attr:`~carbond.collections.Collection.UpdateConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :attr:`~carbond.collections.Collection.UpdateConfigClass.options`)
        :type options: object
        :throws :class:`~carbond.collections.errors.CollectionError`: 
        :rtype: :class:`~carbond.collections.Collection.UpdateResult`

        Update (or upsert) a number of objects in a collection

    .. function:: updateObject(id, update, context, options)

        :param id: The ID of the object to update
        :type id: string
        :param update: The update to be applied to the collection
        :type update: *
        :param context: The operation parameters (see: :attr:`~carbond.collections.Collection.UpdateObjectConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :attr:`~carbond.collections.Collection.UpdateObjectConfigClass.options`)
        :type options: object
        :throws :class:`~carbond.collections.errors.CollectionError`: 
        :rtype: :class:`~carbond.collections.Collection.UpdateObjectResult`

        Update a specific object

    .. function:: remove(context, options)

        :param context: The operation parameters (see: :attr:`~carbond.collections.Collection.RemoveConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :attr:`~carbond.collections.Collection.RemoveConfigClass.options`)
        :type options: object
        :throws :class:`~carbond.collections.errors.CollectionError`: 
        :rtype: number | array

        Remove objects from a collection

    .. function:: removeObject(id, context, options)

        :param id: The ID of the object to remove
        :type id: String
        :param context: The operation parameters (see: :attr:`~carbond.collections.Collection.RemoveConfigClass`)
        :type context: object
        :param options: A map of backend driver specific options (see: :attr:`~carbond.collections.Collection.RemoveConfigClass.options`)
        :type options: object
        :throws :class:`~carbond.collections.errors.CollectionError`: 
        :rtype: number | object

        Remove a specific object from a collection

    .. function:: getOperationConfigFieldName(op)

        :param op: The operation name (e.g., "insert")
        :type op: string
        :rtype: string

        Get the property name for an operation config by name

    .. function:: getOperationConfig(op)

        :param op: The operation name (e.g., "insert")
        :type op: string
        :rtype: :class:`~carbond.collections.CollectionOperationConfig`

        Get the config for an operation by name

    .. function:: configureInsertOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :attr:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureInsertObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :attr:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: preInsertOperation(--, req, res)

        :param --: The insert operation config
        :type --: :class:`~carbond.collections.InsertConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preInsertObjectOperation(--, req, res)

        :param --: The insert object operation config
        :type --: :class:`~carbond.collections.InsertObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: postInsertOperation(result, --, req, res)

        :param result: The inserted objects
        :type result: object[]
        :param --: The insert operation config
        :type --: :class:`~carbond.collections.Collection.InsertConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object[] | null

        Update the HTTP response to reflect the result of the operation

    .. function:: postInsertObjectOperation(result, --, req, res)

        :param result: The inserted object
        :type result: object
        :param --: The insert object operation config
        :type --: :class:`~carbond.collections.Collection.InsertObjectConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object | null

        Update the HTTP response to reflect the result of the operation

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

    .. function:: configureFindObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :attr:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: preFindOperation(--, req, res)

        :param --: The find operation config
        :type --: :class:`~carbond.collections.FindConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: postFindOperation(result, --, req, res)

        :param result: The found objects
        :type result: object[]
        :param --: The find operation config
        :type --: :class:`~carbond.collections.Collection.FindConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object[]

        Update the HTTP response to reflect the result of the operation

    .. function:: preFind(context, options)

        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreFindResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: postFind(result, context, options)

        :param result: The found object(s)
        :type result: object[]
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: object[]

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: configureFindObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :attr:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: preFindObjectOperation(--, req, res)

        :param --: The find object operation config
        :type --: :class:`~carbond.collections.FindObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

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

    .. function:: preFindObject(id, context, options)

        :param id: The object id
        :type id: string
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreFindObjectResult` | undefined

        Update or transform any parameters to be passed to the operation handler

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

    .. function:: configureSaveObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :attr:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: preSaveOperation(--, req, res)

        :param --: The save operation config
        :type --: :class:`~carbond.collections.SaveConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: postSaveOperation(result, --, req, res)

        :param result: The saved objects
        :type result: object[]
        :param --: The save operation config
        :type --: :class:`~carbond.collections.Collection.SaveConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object[] | null

        Update the HTTP response to reflect the result of the operation

    .. function:: preSave(objects, context, options)

        :param objects: The objects to save
        :type objects: object[]
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreSaveResult` | undefined

        Update or transform any parameters to be passed to the operation handler

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

    .. function:: configureSaveObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :attr:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: preSaveObjectOperation(--, req, res)

        :param --: The save object operation config
        :type --: :class:`~carbond.collections.SaveObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: postSaveObjectOperation(result, --, req, res)

        :param result: The saved object and a flag to indicate if it was created rather than replaced
        :type result: :class:`~carbond.collections.Collection.SaveObjectResult`
        :param --: The save object operation config
        :type --: :class:`~carbond.collections.Collection.SaveObjectConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object[] | null

        Update the HTTP response to reflect the result of the operation

    .. function:: preSaveObject(object, context, options)

        :param object: The object to save
        :type object: object
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreSaveObjectResult` | undefined

        Update or transform any parameters to be passed to the operation handler

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

    .. function:: configureUpdateOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :attr:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: preUpdateOperation(--, req, res)

        :param --: The update operation config
        :type --: :class:`~carbond.collections.UpdateConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: postUpdateOperation(result, --, req, res)

        :param result: The number of objects updated/upserted or the upserted object(s)
        :type result: :class:`~carbond.collections.Collection.UpdateResult`
        :param --: The update operation config
        :type --: :class:`~carbond.collections.Collection.UpdateConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object

        Update the HTTP response to reflect the result of the operation. It should be noted that the result can be either a number or an array of objects. If the underlying driver does not support returning the upserted object(s), then the result will always be a number and :attr:`~carbond.collections.UpdateConfig.returnsUpsertedObjects` should be configured to reflect this.

    .. function:: preUpdate(update, context, options)

        :param update: The update spec
        :type update: *
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreUpdateResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: postUpdate(result, update, context, options)

        :param result: The ``UpdateResult``
        :type result: :class:`~carbond.collections.Collection.UpdateResult`
        :param update: The update spec
        :type update: *
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.UpdateResult`

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: configureUpdateObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :attr:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: preUpdateObjectOperation(--, req, res)

        :param --: The update object operation config
        :type --: :class:`~carbond.collections.UpdateObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: postUpdateObjectOperation(result, --, req, res)

        :param result: The number of objects updated/upserted or the upserted object
        :type result: :class:`~carbond.collections.Collection.UpdateObjectResult`
        :param --: The update object operation config
        :type --: :class:`~carbond.collections.Collection.UpdateObjectConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object

        Update the HTTP response to reflect the result of the operation. It should be noted that the result can be either a number or an object. If the underlying driver does not support returning the upserted object, then the result will always be a number and :attr:`~carbond.collections.UpdateObjectConfig.returnsUpsertedObject` should be configured to reflect this.

    .. function:: preUpdateObject(id, update, context, options)

        :param id: The object id
        :type id: string
        :param update: The update spec
        :type update: *
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreUpdateObjectResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: postUpdateObject(result, update, update, context, options)

        :param result: The ``UpdateResult``
        :type result: :class:`~carbond.collections.Collection.UpdateResult`
        :param update: The update spec
        :type update: string
        :param update: The update spec
        :type update: *
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.UpdateResult`

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: configureRemoveOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :attr:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: preRemoveOperation(--, req, res)

        :param --: The remove operation config
        :type --: :class:`~carbond.collections.RemoveConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: postRemoveOperation(result, --, req, res)

        :param result: The number of objects removed or the removed objec(s)
        :type result: number | array
        :param --: The remove operation config
        :type --: :class:`~carbond.collections.Collection.RemoveConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object

        Update the HTTP response to reflect the result of the operation. It should be noted that the result can be either a number or an array of object(s). If the underlying driver does not support returning the removed object(s), then the result will always be a number and :attr:`~carbond.collections.RemoveConfig.returnsRemovedObjects` should be configured to reflect this.

    .. function:: preRemove(context, options)

        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreRemoveResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: postRemove(result, context, options)

        :param result: The number of objects (or the object(s) themselves) removed
        :type result: number | array
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: number | array

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: configureRemoveObjectOperation()

        :rtype: :class:`~carbond.collections.Collection.ConfigureOperationResult`

        Update the operation config using collection level config (e.g., :attr:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: preRemoveObjectOperation(--, req, res)

        :param --: The remove object operation config
        :type --: :class:`~carbond.collections.RemoveObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: :class:`~carbond.collections.Collection.PreOperationResult`

        Build the context and options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: postRemoveObjectOperation(result, --, req, res)

        :param result: The number of objects removed or the removed object
        :type result: number | object
        :param --: The remove object operation config
        :type --: :class:`~carbond.collections.Collection.RemoveObjectConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: object

        Update the HTTP response to reflect the result of the operation. It should be noted that the result can be either a number or an object. If the underlying driver does not support returning the removed object, then the result will always be a number and :attr:`~carbond.collections.RemoveObjectConfig.returnsRemovedObject` should be configured to reflect this.

    .. function:: preRemoveObject(id, context, options)

        :param id: The object id
        :type id: string
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: :class:`~carbond.collections.Collection.PreRemoveObjectResult` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: postRemoveObject(result, context, options)

        :param result: The number of objects (or the object itself) removed
        :type result: number | object
        :param context: The operation handler context
        :type context: object
        :param options: The operation handler options
        :type options: object
        :rtype: number | array

        Update or transform the operation result before passing it back up to the HTTP layer

Typedefs
--------

.. class:: carbond.collections.Collection
    :noindex:
    :hidden:

    .. attribute:: SaveObjectResult

       :type: object
       :val: {object} The saved object
       :created: {boolean} A flag indicating whether the object was created or replaced

       

    .. attribute:: UpdateResult

       :type: object
       :val: {number | object} The number of objects updated if no upsert took place, the number of objects upserted if configured not to return upserted objects, or the upserted object(s) if configured to return the upserted object(s) (see: :attr:`~carbond.collections.Collection.UpdateConfigClass`)
       :created: {boolean} A flag indicating whether an upsert took place

       

    .. attribute:: UpdateObjectResult

       :type: object
       :val: {number | object} The number of objects updated if no upsert took place, the number of objects upserted if configured not to return upserted objects, or the upserted object(s) if configured to return the upserted object(s) (see: :attr:`~carbond.collections.Collection.UpdateObjectConfigClass`)
       :created: {boolean} A flag indicating whether an upsert took place

       

    .. attribute:: ConfigureOperationResult

       :type: object
       :opConfig: {:class:`~carbond.collection.CollectionOperationConfig`} The operation config
       :defaultResponses: {:class:`~carbond.OperationResponse[]` | object[]} A list of default responses (raw Objects will be converted to instances of :attr:`~carbond.OperationResponse`)

       

    .. attribute:: PreOperationResult

       :type: object
       :context: {object} A map of parameters to be passed to the operation handler. Note, this is generally just ``req.parameters``.
       :options: {object} A map of options to be passed to the underlying driver used to communicate with the backing datastore. Generally, this will be pulled straight from :attr:`~carbond.collections.CollectionOperationConfig.options`, however, the pre operation method can be overridden to extend options based on the current request.

       

    .. attribute:: PreInsertResult

       :type: object
       :objects: {objects[]} The objects to insert
       :context: {object} The operation handler context
       :options: {object} The operation handler options

       

    .. attribute:: PreInsertObjectResult

       :type: object
       :object: {object} The object to insert
       :context: {object} The operation handler context
       :options: {object} The operation handler options

       

    .. attribute:: PreFindResult

       :type: object
       :context: {object} The operation handler context
       :options: {object} The operation handler options

       

    .. attribute:: PreFindObjectResult

       :type: object
       :id: {string} The object id
       :context: {object} The operation handler context
       :options: {object} The operation handler options

       

    .. attribute:: PreSaveResult

       :type: object
       :objects: {object[]} The objects to save
       :context: {object} The operation handler context
       :options: {object} The operation handler options

       

    .. attribute:: PreSaveObjectResult

       :type: object
       :object: {object} The object to save
       :context: {object} The operation handler context
       :options: {object} The operation handler options

       

    .. attribute:: PreUpdateResult

       :type: object
       :update: {*} The update spec
       :context: {object} The operation handler context
       :options: {object} The operation handler options

       

    .. attribute:: PreUpdateObjectResult

       :type: object
       :id: {string} The object id
       :update: {*} The update spec
       :context: {object} The operation handler context
       :options: {object} The operation handler options

       

    .. attribute:: PreRemoveResult

       :type: object
       :context: {object} The operation handler context
       :options: {object} The operation handler options

       

    .. attribute:: PreRemoveObjectResult

       :type: object
       :id: {string} The object id
       :context: {object} The operation handler context
       :options: {object} The operation handler options

       
