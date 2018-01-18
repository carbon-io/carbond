.. class:: carbond.mongodb.MongoDBUpdateObjectConfig
    :heading:

.. |br| raw:: html

   <br />

=========================================
carbond.mongodb.MongoDBUpdateObjectConfig
=========================================
*extends* :class:`~carbond.collections.UpdateObjectConfig`

The MongoDB update object operation config

Instance Properties
-------------------

.. class:: carbond.mongodb.MongoDBUpdateObjectConfig
    :noindex:
    :hidden:

    .. attribute:: additionalOptions

       :inheritedFrom: :class:`~carbond.collections.UpdateObjectConfig`
       :type: object.<string, \*>
       :required:

       Any additional options that should be added to options passed down to a handler.


    .. attribute:: additionalParameters

       :inheritedFrom: :class:`~carbond.collections.UpdateObjectConfig`
       :type: object.<string, carbond.OperationParameter>
       :required:

       Any additional parameters that should be added to the collection parameters. These can override parameters configured via the :class:`~carbond.collections.CollectionOperationConfig.parameters`. Note, these will all end up being passed down to operation handlers via the "options" parameter.


    .. attribute:: allowUnauthenticated

       :inheritedFrom: :class:`~carbond.collections.UpdateObjectConfig`
       :type: boolean
       :default: false

       Allow unauthenticated requests to the operation


    .. attribute:: description

       :inheritedFrom: :class:`~carbond.collections.UpdateObjectConfig`
       :type: string
       :default: undefined

       A brief description of the operation used by the documentation generator


    .. attribute:: driverOptions

       :type: object.<string, \*>
       :required:

       Options to be passed to the mongodb driver (XXX: link to leafnode docs)


    .. attribute:: endpoint

       :inheritedFrom: :class:`~carbond.collections.UpdateObjectConfig`
       :type: :class:`~carbond.Endpoint`
       :ro:

       The parent endpoint/collection that this configuration is a member of


    .. attribute:: example

       :inheritedFrom: :class:`~carbond.collections.UpdateObjectConfig`
       :type: Object
       :default: undefined

       An example response body used for documentation


    .. attribute:: idParameter

       :inheritedFrom: :class:`~carbond.collections.UpdateObjectConfig`
       :type: string
       :ro:

       The collection object id property name. Note, this is configured on the top level :class:`~carbond.collections.Collection` and set on the configure during initialzation.


    .. attribute:: noDocument

       :inheritedFrom: :class:`~carbond.collections.UpdateObjectConfig`
       :type: boolean
       :default: false

       Exclude the operation from "docgen" API documentation


    .. attribute:: parameters

       :inheritedFrom: :class:`~carbond.collections.UpdateObjectConfig`
       :type: object.<string, carbond.OperationParameter>
       :required:

       Update object operation specific parameters


    .. attribute:: responses

       :inheritedFrom: :class:`~carbond.collections.UpdateObjectConfig`
       :type: Object.<string, carbond.OperationResponse>
       :required:

       Add custom responses for an operation. Note, this will override all default responses.


    .. attribute:: returnsUpsertedObject

       :inheritedFrom: :class:`~carbond.collections.UpdateObjectConfig`
       :type: boolean
       :default: false

       Whether or not the HTTP layer returns the object created via an upsert


    .. attribute:: supportsUpsert

       :inheritedFrom: :class:`~carbond.collections.UpdateObjectConfig`
       :type: boolean
       :default: false

       Whether of not the client is allowed to create objects in the collection using the PATCH method


    .. attribute:: updateObjectSchema

       :inheritedFrom: :class:`~carbond.collections.UpdateObjectConfig`
       :type: Object
       :default: undefined

       The schema used to validate the request body. No validation will be performed if this is left undefined.


    .. attribute:: upsertParameter

       :inheritedFrom: :class:`~carbond.collections.UpdateObjectConfig`
       :type: object.<string, carbond.OperationParameter>
       :required:

       The "upsert" parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          upsert, :class:`~carbond.OperationParameter`, ``undefined``, undefined


