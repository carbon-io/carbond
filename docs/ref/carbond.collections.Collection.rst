.. class:: carbond.collections.Collection
    :heading:

.. |br| raw:: html

   <br />

==============================
carbond.collections.Collection
==============================
*extends* :class:`~carbond.Endpoint`

Provides a high-level abstraction for defining Endpoints that behave like a RESTful collection of resources

Static Properties
-----------------

.. class:: carbond.collections.Collection
    :noindex:
    :hidden:

    .. attribute:: ALL_METHODS

       :inheritedFrom: :class:`~carbond.Endpoint`
       :type: Object
       :required:

       A list of all HTTP methods recognized by carbond


Instance Properties
-------------------

.. class:: carbond.collections.Collection
    :noindex:
    :hidden:

    .. attribute:: ALL_COLLECTION_OPERATIONS

       :type: array
       :ro:

       The list of valid collection operations


    .. attribute:: allowUnauthenticated

       :inheritedFrom: :class:`~carbond.Endpoint`
       :type: string[]
       :required:

       Skip authentication for the HTTP methods listed on this endpoint


    .. attribute:: defaultErrorSchema

       :type: Object
       :ro:

       This is the default error body schema.


    .. attribute:: defaultIdHeaderName

       :type: string
       :ro:

       The default ID header name


    .. attribute:: defaultIdParameter

       :type: string
       :ro:

       The default ID name of objects in this collection


    .. attribute:: defaultIdPathParameter

       :type: string
       :ro:

       The default path parameter name representing the ID for an object in this collection


    .. attribute:: defaultSchema

       :type: Object
       :ro:

       This is the default schema used to validate all objects in this collection. If a schema is not specified explicitly, this schema will be used.


    .. attribute:: description

       :inheritedFrom: :class:`~carbond.Endpoint`
       :type: string
       :default: undefined

       A brief description of what this endpoint does. This will be displayed in any generated documentation.


    .. attribute:: enabled

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



    .. attribute:: endpoints

       :inheritedFrom: :class:`~carbond.Endpoint`
       :type: Object.<string, carbond.Endpoint>
       :required:

       The endpoints that sit below this endpoint in the tree. URL paths to each endpoint are built during a depth first traversal of the tree on initialization using the property names defined on this Object.


    .. attribute:: example

       :type: Object
       :default: undefined

       An example object for this collection


    .. attribute:: findConfig

       :type: Object
       :default: ``o({}, carbond.collections.FindConfigClass)``

       The config used to govern the behavior of the :class:`~find` operation


    .. attribute:: FindConfigClass

       :type: :class:`~carbond.collections.FindConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.find` operation config


    .. attribute:: findObjectConfig

       :type: Object
       :default: ``o({}, carbond.collections.FindObjectConfigClass)``

       The config used to govern the behavior of the :class:`~findObject` operation


    .. attribute:: FindObjectConfigClass

       :type: :class:`~carbond.collections.FindObjectConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.findObject` operation config


    .. attribute:: idGenerator

       :type: Object
       :default: undefined

       An object with the method "generateId" that will be called to populate ID if present and when appropriate (e.g. :class:`~carbond.collections.Collection.insert`)


    .. attribute:: idHeaderName

       :type: string
       :default: :class:`~carbond.collections.Collection.defaultIdHeaderName`

       The header name which should contain the EJSON serialized ID


    .. attribute:: idParameterName

       :type: string
       :default: :class:`~carbond.collections.Collection.defaultIdParameter`

       The ID parameter name (XXX: rename to "objectIdName" since this is not a "parameter" name?)


    .. attribute:: idPathParameterName

       :type: string
       :default: :class:`~carbond.collections.Collection.defaultIdParameter`

       The PATH_ID parameter name (e.g., /collection/:PATH_ID)


    .. attribute:: insertConfig

       :type: Object
       :default: ``o({}, carbond.collections.InsertConfigClass)``

       The config used to govern the behavior of the :class:`~insert` operation


    .. attribute:: InsertConfigClass

       :type: :class:`~carbond.collections.InsertConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.insert` operation config


    .. attribute:: insertObjectConfig

       :type: Object
       :default: ``o({}, carbond.collections.InsertObjectConfigClass)``

       The config used to govern the behavior of the :class:`~insertObject` operation


    .. attribute:: InsertObjectConfigClass

       :type: :class:`~carbond.collections.InsertObjectConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.insertObject` operation config


    .. attribute:: noDocument

       :inheritedFrom: :class:`~carbond.Endpoint`
       :type: boolean
       :default: false

       Controls whether documentation for this endpoint is included in generated static documentation


    .. attribute:: parameters

       :inheritedFrom: :class:`~carbond.Endpoint`
       :type: Object.<string, carbond.OperationParameter>
       :required:

       Operation parameter definitions that apply to all operations supported by this endpoint. Note, these will be merged with any parameter definitions on the operations themselves and their parsed values will be passed to the handler via ``req.parameters[<parameter name>]``.


    .. attribute:: parent

       :inheritedFrom: :class:`~carbond.Endpoint`
       :type: :class:`~carbond.Endpoint`
       :ro:

       The parent endpoint for this endpoint in the endpoint tree


    .. attribute:: path

       :inheritedFrom: :class:`~carbond.Endpoint`
       :type: string
       :ro:

       The URI path that routes to this endpoint. This is built during service initialization and will overwrite any value specified on instantiation.


    .. attribute:: removeConfig

       :type: Object
       :default: ``o({}, carbond.collections.RemoveConfigClass)``

       The config used to govern the behavior of the :class:`~remove` operation


    .. attribute:: RemoveConfigClass

       :type: :class:`~carbond.collections.RemoveConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.remove` operation config


    .. attribute:: removeObjectConfig

       :type: Object
       :default: ``o({}, carbond.collections.RemoveObjectConfigClass)``

       The config used to govern the behavior of the :class:`~removeObject` operation


    .. attribute:: RemoveObjectConfigClass

       :type: :class:`~carbond.collections.RemoveObjectConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.removeObject` operation config


    .. attribute:: saveConfig

       :type: Object
       :default: ``o({}, carbond.collections.SaveConfigClass)``

       The config used to govern the behavior of the :class:`~save` operation


    .. attribute:: SaveConfigClass

       :type: :class:`~carbond.collections.SaveConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.save` operation config


    .. attribute:: saveObjectConfig

       :type: Object
       :default: ``o({}, carbond.collections.SaveObjectConfigClass)``

       The config used to govern the behavior of the :class:`~saveObject` operation


    .. attribute:: SaveObjectConfigClass

       :type: :class:`~carbond.collections.SaveObjectConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.saveObject` operation config


    .. attribute:: schema

       :type: Object
       :default: :class:`~carbond.collections.Collection.defaultSchema`

       The schema used to validate objects in this collection


    .. attribute:: service

       :inheritedFrom: :class:`~carbond.Endpoint`
       :type: :class:`~carbond.Service`
       :ro:
       :deprecated:

       The root service object managing the endpoint tree. Getting a reference to this object is sometimes necessary or just convenient (i.e., HTTP error classes can be accessed via :attr:`~carbond.Service.errors`).


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

       :type: Object
       :default: ``o({}, carbond.collections.UpdateConfigClass)``

       The config used to govern the behavior of the :class:`~update` operation


    .. attribute:: UpdateConfigClass

       :type: :class:`~carbond.collections.UpdateConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.update` operation config


    .. attribute:: updateObjectConfig

       :type: Object
       :default: ``o({}, carbond.collections.UpdateObjectConfigClass)``

       The config used to govern the behavior of the :class:`~updateObject` operation


    .. attribute:: UpdateObjectConfigClass

       :type: :class:`~carbond.collections.UpdateObjectConfig`
       :ro:

       The config class used to instantiate the :class:`~carbond.collections.Collection.updateObject` operation config


    .. attribute:: validateOutput

       :inheritedFrom: :class:`~carbond.Endpoint`
       :type: boolean
       :default: ``true``

       Controls whether or not response bodies are validated using the response :class:`~carbond.OperationResponse.schema` corresponding to the current response code


Abstract Methods
----------------

.. class:: carbond.collections.Collection
    :noindex:
    :hidden:

    .. function:: find(options, context)

        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.FindConfigClass`)
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :returns: A list of objects
        :rtype: Object[]

        Retrieve objects from a collection

    .. function:: findObject(id, options, context)

        :param id: The object id
        :type id: string
        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.FindObjectConfigClass`)
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :returns: The found object or null
        :rtype: Object | null

        Retrieve a single object from a collection

    .. function:: insert(objects, options, context)

        :param objects: An array of objects to insert
        :type objects: Array
        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.InsertConfigClass`)
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :returns: The list of inserted objects
        :rtype: Object[]

        Bulk insert objects into a collection

    .. function:: insertObject(object, options, context)

        :param object: An object to insert
        :type object: Object
        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.InsertObjectConfigClass`)
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :returns: The inserted object
        :rtype: Object

        Insert a single object into a collection

    .. function:: remove(options, context)

        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.RemoveConfigClass`)
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :returns: An integer representing the number of objects removed or an array of the objects removed
        :rtype: number | array

        Remove objects from a collection

    .. function:: removeObject(id, options, context)

        :param id: The ID of the object to remove
        :type id: String
        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.RemoveConfigClass`)
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :returns: An integer representing the number of objects removed (0 or 1) or the the object removed
        :rtype: number | Object

        Remove a specific object from a collection

    .. function:: save(objects, options, context)

        :param objects: An array of objects (with IDs) to save
        :type objects: Array
        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.SaveConfigClass`)
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :returns: The list of saved objects
        :rtype: Object[]

        Replace the collection with an array of objects

    .. function:: saveObject(object, options, context)

        :param object: The object to save (with ID)
        :type object: Object
        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.SaveObjectConfigClass`)
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: :ref:`SaveObjectResult <carbond.collections.Collection.SaveObjectResult>`

        Replace or insert an object with a known ID

    .. function:: update(update, options, context)

        :param update: The update to be applied to the collection
        :type update: \*
        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.UpdateConfigClass`)
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: :ref:`UpdateResult <carbond.collections.Collection.UpdateResult>`

        Update (or upsert) a number of objects in a collection

    .. function:: updateObject(id, update, options, context)

        :param id: The ID of the object to update
        :type id: string
        :param update: The update to be applied to the collection
        :type update: \*
        :param options: The operation parameters (see: :class:`~carbond.collections.Collection.UpdateObjectConfigClass`)
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :throws: :class:`~carbond.collections.errors.CollectionError` 
        :rtype: :ref:`UpdateObjectResult <carbond.collections.Collection.UpdateObjectResult>`

        Update a specific object

Methods
-------

.. class:: carbond.collections.Collection
    :noindex:
    :hidden:

    .. function:: configureFindObjectOperation()

        :rtype: :ref:`ConfigureOperationResult <carbond.collections.Collection.ConfigureOperationResult>`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureFindOperation()

        :rtype: :ref:`ConfigureOperationResult <carbond.collections.Collection.ConfigureOperationResult>`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureInsertObjectOperation()

        :rtype: :ref:`ConfigureOperationResult <carbond.collections.Collection.ConfigureOperationResult>`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureInsertOperation()

        :rtype: :ref:`ConfigureOperationResult <carbond.collections.Collection.ConfigureOperationResult>`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureRemoveObjectOperation()

        :rtype: :ref:`ConfigureOperationResult <carbond.collections.Collection.ConfigureOperationResult>`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureRemoveOperation()

        :rtype: :ref:`ConfigureOperationResult <carbond.collections.Collection.ConfigureOperationResult>`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureSaveObjectOperation()

        :rtype: :ref:`ConfigureOperationResult <carbond.collections.Collection.ConfigureOperationResult>`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureSaveOperation()

        :rtype: :ref:`ConfigureOperationResult <carbond.collections.Collection.ConfigureOperationResult>`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureUpdateObjectOperation()

        :rtype: :ref:`ConfigureOperationResult <carbond.collections.Collection.ConfigureOperationResult>`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: configureUpdateOperation()

        :rtype: :ref:`ConfigureOperationResult <carbond.collections.Collection.ConfigureOperationResult>`

        Update the operation config using collection level config (e.g., :class:`~carbond.collections.Collection.schema`) and build operation responses. In general, this method should not need to be overridden or extended. Instead, customization should be driven by the operation config and the pre/post handler methods.

    .. function:: getOperation(method)

        :inheritedFrom: :class:`~carbond.Endpoint`
        :param method: The HTTP method corresponding to the operation to retrieve
        :type method: string
        :rtype: :class:`~carbond.Operation`

        Retrieves the operation instance corresponding to the passed HTTP method

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

    .. function:: getService()

        :inheritedFrom: :class:`~carbond.Endpoint`
        :rtype: :class:`~carbond.Service`

        Returns the root :class:`~carbond.Service` instance (note, this is preferred over accessing the ``service`` property itself)

    .. function:: isOperationAuthorized(method, user, req)

        :inheritedFrom: :class:`~carbond.Endpoint`
        :param method: The HTTP method corresponding to the operation that we are attempting to authorize
        :type method: string
        :param user: The user object
        :type user: Object
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :returns: Whether of not the operation is authorized
        :rtype: boolean

        Tests whether an operation is authorized given a user (as returned by the root authenticator) and any :class:`~carbond.security.Acl` that may apply to this endpoint

    .. function:: operations()

        :inheritedFrom: :class:`~carbond.Endpoint`
        :rtype: :class:`~carbond.Operation[]`

        Gathers all operations defined on this endpoint

    .. function:: options(req, res)

        :inheritedFrom: :class:`~carbond.Endpoint`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: undefined

        Implements the OPTIONS method handler

    .. function:: postFind(result, options, context)

        :param result: The found object(s)
        :type result: Object[]
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: Object[]

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postFindObject(result, id, options, context)

        :param result: The found object
        :type result: Object | null
        :param id: The object id
        :type id: string
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: Object | null

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postFindObjectOperation(result, config, req, res, context)

        :param result: The found object
        :type result: Object | null
        :param config: The find object operation config
        :type config: :class:`~carbond.collections.Collection.findObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :returns: Returns the found object
        :rtype: Object | null

        Update the HTTP response to reflect the result of the operation

    .. function:: postFindOperation(result, config, req, res, context)

        :param result: The found objects
        :type result: Object[]
        :param config: The find operation config
        :type config: :class:`~carbond.collections.Collection.findConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :returns: Returns the found objects
        :rtype: Object[]

        Update the HTTP response to reflect the result of the operation

    .. function:: postInsert(result, objects, options, context)

        :param result: The inserted object(s)
        :type result: Object[]
        :param objects: The object(s) to insert
        :type objects: Object[]
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: Object[]

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postInsertObject(result, object, options, context)

        :param result: The inserted object
        :type result: Object
        :param object: The object to insert
        :type object: Object
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: Object

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postInsertObjectOperation(result, config, req, res, context)

        :param result: The inserted object
        :type result: Object
        :param config: The insert object operation config
        :type config: :class:`~carbond.collections.Collection.InsertObjectConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :returns: Returns the inserted object if configured to do so and ``null`` otherwise
        :rtype: Object | null

        Update the HTTP response to reflect the result of the operation

    .. function:: postInsertOperation(result, config, req, res, context)

        :param result: The inserted objects
        :type result: Object[]
        :param config: The insert operation config
        :type config: :class:`~carbond.collections.Collection.InsertConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :returns: Returns the inserted objects if configured to do so and ``null`` otherwise
        :rtype: Object[] | null

        Update the HTTP response to reflect the result of the operation

    .. function:: postRemove(result, options, context)

        :param result: The number of objects (or the object(s) themselves) removed
        :type result: number | array
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: number | array

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postRemoveObject(result, options, context)

        :param result: The number of objects (or the object itself) removed
        :type result: number | Object
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: number | array

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postRemoveObjectOperation(result, config, req, res, context)

        :param result: The number of objects removed or the removed object
        :type result: number | Object
        :param config: The remove object operation config
        :type config: :class:`~carbond.collections.Collection.RemoveObjectConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :returns: Returns undefined} or the removed object
        :rtype: Object

        Update the HTTP response to reflect the result of the operation. It should be noted that the result can be either a number or an object. If the underlying driver does not support returning the removed object, then the result will always be a number and :class:`~carbond.collections.RemoveObjectConfig.returnsRemovedObject` should be configured to reflect this.

    .. function:: postRemoveOperation(result, config, req, res, context)

        :param result: The number of objects removed or the removed objec(s)
        :type result: number | array
        :param config: The remove operation config
        :type config: :class:`~carbond.collections.Collection.RemoveConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :returns: Returns undefined} or the removed objects
        :rtype: Object

        Update the HTTP response to reflect the result of the operation. It should be noted that the result can be either a number or an array of object(s). If the underlying driver does not support returning the removed object(s), then the result will always be a number and :class:`~carbond.collections.RemoveConfig.returnsRemovedObjects` should be configured to reflect this.

    .. function:: postSave(result, objects, options, context)

        :param result: The saved objects
        :type result: Object[]
        :param objects: The objects to save
        :type objects: Object[]
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: Object[]

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postSaveObject(result, object, options, context)

        :param result: The ``SaveObjectResult``
        :type result: :ref:`SaveObjectResult <carbond.collections.Collection.SaveObjectResult>`
        :param object: The object to save
        :type object: Object
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`SaveObjectResult <carbond.collections.Collection.SaveObjectResult>`

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postSaveObjectOperation(result, config, req, res, context)

        :param result: The saved object and a flag to indicate if it was created rather than replaced
        :type result: :ref:`SaveObjectResult <carbond.collections.Collection.SaveObjectResult>`
        :param config: The save object operation config
        :type config: :class:`~carbond.collections.Collection.SaveObjectConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :returns: Returns the saved object if configured to do so and ``null`` if not
        :rtype: Object[] | null

        Update the HTTP response to reflect the result of the operation

    .. function:: postSaveOperation(result, config, req, res, context)

        :param result: The saved objects
        :type result: Object[]
        :param config: The save operation config
        :type config: :class:`~carbond.collections.Collection.saveConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :returns: Returns the saved objects if configured to do so and ``null`` if not
        :rtype: Object[] | null

        Update the HTTP response to reflect the result of the operation

    .. function:: postUpdate(result, update, options, context)

        :param result: The ``UpdateResult``
        :type result: :ref:`UpdateResult <carbond.collections.Collection.UpdateResult>`
        :param update: The update spec
        :type update: \*
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`UpdateResult <carbond.collections.Collection.UpdateResult>`

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postUpdateObject(result, update, update, options, context)

        :param result: The ``UpdateResult``
        :type result: :ref:`UpdateResult <carbond.collections.Collection.UpdateResult>`
        :param update: The update spec
        :type update: string
        :param update: The update spec
        :type update: \*
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`UpdateResult <carbond.collections.Collection.UpdateResult>`

        Update or transform the operation result before passing it back up to the HTTP layer

    .. function:: postUpdateObjectOperation(result, config, req, res, context)

        :param result: The number of objects updated/upserted or the upserted object
        :type result: :ref:`UpdateObjectResult <carbond.collections.Collection.UpdateObjectResult>`
        :param config: The update object operation config
        :type config: :class:`~carbond.collections.Collection.UpdateObjectConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :returns: Returns undefined} or the upserted object
        :rtype: Object

        Update the HTTP response to reflect the result of the operation. It should be noted that the result can be either a number or an object. If the underlying driver does not support returning the upserted object, then the result will always be a number and :class:`~carbond.collections.UpdateObjectConfig.returnsUpsertedObject` should be configured to reflect this.

    .. function:: postUpdateOperation(result, config, req, res, context)

        :param result: The number of objects updated/upserted or the upserted object(s)
        :type result: :ref:`UpdateResult <carbond.collections.Collection.UpdateResult>`
        :param config: The update operation config
        :type config: :class:`~carbond.collections.Collection.UpdateConfigClass`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :returns: Returns undefined} or the upserted object(s)
        :rtype: Object

        Update the HTTP response to reflect the result of the operation. It should be noted that the result can be either a number or an array of objects. If the underlying driver does not support returning the upserted object(s), then the result will always be a number and :class:`~carbond.collections.UpdateConfig.returnsUpsertedObjects` should be configured to reflect this.

    .. function:: preFind(options, context)

        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreFindResult <carbond.collections.Collection.PreFindResult>` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preFindObject(id, options, context)

        :param id: The object id
        :type id: string
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreFindObjectResult <carbond.collections.Collection.PreFindObjectResult>` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preFindObjectOperation(config, req, res, context)

        :param config: The find object operation config
        :type config: :class:`~carbond.collections.FindObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreOperationResult <carbond.collections.Collection.PreOperationResult>`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preFindOperation(config, req, res, context)

        :param config: The find operation config
        :type config: :class:`~carbond.collections.FindConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreOperationResult <carbond.collections.Collection.PreOperationResult>`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preInsert(objects, options, context)

        :param objects: The objects to insert
        :type objects: Object[]
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreInsertResult <carbond.collections.Collection.PreInsertResult>` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preInsertObject(object, options, context)

        :param object: The object to insert
        :type object: Object
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreInsertObjectResult <carbond.collections.Collection.PreInsertObjectResult>` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preInsertObjectOperation(config, req, res, context)

        :param config: The insert object operation config
        :type config: :class:`~carbond.collections.InsertObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreOperationResult <carbond.collections.Collection.PreOperationResult>`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preInsertOperation(config, req, res, context)

        :param config: The insert operation config
        :type config: :class:`~carbond.collections.InsertConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreOperationResult <carbond.collections.Collection.PreOperationResult>`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preRemove(options, context)

        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreRemoveResult <carbond.collections.Collection.PreRemoveResult>` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preRemoveObject(id, options, context)

        :param id: The object id
        :type id: string
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreRemoveObjectResult <carbond.collections.Collection.PreRemoveObjectResult>` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preRemoveObjectOperation(config, req, res, context)

        :param config: The remove object operation config
        :type config: :class:`~carbond.collections.RemoveObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreOperationResult <carbond.collections.Collection.PreOperationResult>`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preRemoveOperation(config, req, res, context)

        :param config: The remove operation config
        :type config: :class:`~carbond.collections.RemoveConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreOperationResult <carbond.collections.Collection.PreOperationResult>`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preSave(objects, options, context)

        :param objects: The objects to save
        :type objects: Object[]
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreSaveResult <carbond.collections.Collection.PreSaveResult>` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preSaveObject(object, options, context)

        :param object: The object to save
        :type object: Object
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreSaveObjectResult <carbond.collections.Collection.PreSaveObjectResult>` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preSaveObjectOperation(config, req, res, context)

        :param config: The save object operation config
        :type config: :class:`~carbond.collections.SaveObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreOperationResult <carbond.collections.Collection.PreOperationResult>`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preSaveOperation(config, req, res, context)

        :param config: The save operation config
        :type config: :class:`~carbond.collections.SaveConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreOperationResult <carbond.collections.Collection.PreOperationResult>`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preUpdate(update, options, context)

        :param update: The update spec
        :type update: \*
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreUpdateResult <carbond.collections.Collection.PreUpdateResult>` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preUpdateObject(id, update, options, context)

        :param id: The object id
        :type id: string
        :param update: The update spec
        :type update: \*
        :param options: The operation handler options
        :type options: Object
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreUpdateObjectResult <carbond.collections.Collection.PreUpdateObjectResult>` | undefined

        Update or transform any parameters to be passed to the operation handler

    .. function:: preUpdateObjectOperation(config, req, res, context)

        :param config: The update object operation config
        :type config: :class:`~carbond.collections.UpdateObjectConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreOperationResult <carbond.collections.Collection.PreOperationResult>`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: preUpdateOperation(config, req, res, context)

        :param config: The update operation config
        :type config: :class:`~carbond.collections.UpdateConfig`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :param context: A free form object to pass data between hook and handler methods
        :type context: Object
        :rtype: :ref:`PreOperationResult <carbond.collections.Collection.PreOperationResult>`

        Build the options to be passed to the operation handler from the request and operation config. Note, in general, this should not need to be overridden or extended.

    .. function:: supportedMethods()

        :inheritedFrom: :class:`~carbond.Endpoint`
        :rtype: string[]

        Returns a list of HTTP methods supported by this endpoint

.. _carbond.collections.Collection.ConfigureOperationResult:

.. rubric:: Typedef: ConfigureOperationResult

Properties
----------

    .. attribute:: opConfig

       :type: :class:`~carbond.collections.CollectionOperationConfig`
       :required:

       The operation config


    .. attribute:: defaultResponses

       :type: :class:`~carbond.OperationResponse[]` | Object[]
       :required:

       A list of default responses (raw Objects will be converted to instances of :class:`~carbond.OperationResponse`)


.. _carbond.collections.Collection.PreFindObjectResult:

.. rubric:: Typedef: PreFindObjectResult

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

.. rubric:: Typedef: PreFindResult

Properties
----------

    .. attribute:: options

       :type: Object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreInsertObjectResult:

.. rubric:: Typedef: PreInsertObjectResult

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

.. rubric:: Typedef: PreInsertResult

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

.. rubric:: Typedef: PreOperationResult

Properties
----------

    .. attribute:: options

       :type: Object
       :required:

       A map of parameters to be passed to the operation handler. Note, this is generally just ``req.parameters``.


.. _carbond.collections.Collection.PreRemoveObjectResult:

.. rubric:: Typedef: PreRemoveObjectResult

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

.. rubric:: Typedef: PreRemoveResult

Properties
----------

    .. attribute:: options

       :type: Object
       :default: undefined

       The operation handler options


.. _carbond.collections.Collection.PreSaveObjectResult:

.. rubric:: Typedef: PreSaveObjectResult

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

.. rubric:: Typedef: PreSaveResult

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

.. rubric:: Typedef: PreUpdateObjectResult

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

.. rubric:: Typedef: PreUpdateResult

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

.. rubric:: Typedef: SaveObjectResult

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

.. rubric:: Typedef: UpdateObjectResult

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

.. rubric:: Typedef: UpdateResult

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

