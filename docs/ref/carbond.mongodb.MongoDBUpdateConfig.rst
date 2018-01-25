.. class:: carbond.mongodb.MongoDBUpdateConfig
    :heading:

.. |br| raw:: html

   <br />

===================================
carbond.mongodb.MongoDBUpdateConfig
===================================
*extends* :class:`~carbond.collections.UpdateConfig`

The MongoDB update operation config

Instance Properties
-------------------

.. class:: carbond.mongodb.MongoDBUpdateConfig
    :noindex:
    :hidden:

    .. attribute:: allowUnauthenticated

       :inheritedFrom: :class:`~carbond.collections.UpdateConfig`
       :type: boolean
       :default: false

       Allow unauthenticated requests to the operation


    .. attribute:: description

       :inheritedFrom: :class:`~carbond.collections.UpdateConfig`
       :type: string
       :default: undefined

       A brief description of the operation used by the documentation generator


    .. attribute:: driverOptions

       :type: object.<string, \*>
       :required:

       Options to be passed to the mongodb driver (XXX: link to leafnode docs)


    .. attribute:: endpoint

       :inheritedFrom: :class:`~carbond.collections.UpdateConfig`
       :type: :class:`~carbond.Endpoint`
       :ro:

       The parent endpoint/collection that this configuration is a member of


    .. attribute:: example

       :inheritedFrom: :class:`~carbond.collections.UpdateConfig`
       :type: object
       :default: undefined

       An example response body used for documentation


    .. attribute:: idParameterName

       :inheritedFrom: :class:`~carbond.collections.UpdateConfig`
       :type: string
       :ro:

       The collection object id property name. Note, this is configured on the top level :class:`~carbond.collections.Collection` and set on the configure during initialzation.


    .. attribute:: noDocument

       :inheritedFrom: :class:`~carbond.collections.UpdateConfig`
       :type: boolean
       :default: false

       Exclude the operation from "docgen" API documentation


    .. attribute:: options

       :inheritedFrom: :class:`~carbond.collections.UpdateConfig`
       :type: object.<string, \*>
       :required:

       Any additional options that should be added to options passed down to a handler.


    .. attribute:: parameters

       :type: object.<string, carbond.OperationParameter>
       :required:

       The "query" parameter definition (will be omitted if :class:`~carbond.collections.MongoDBFindConfig.supportsQuery` is ``false``)

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          query, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: responses

       :inheritedFrom: :class:`~carbond.collections.UpdateConfig`
       :type: Object.<string, carbond.OperationResponse>
       :required:

       Add custom responses for an operation. Note, this will override all default responses.


    .. attribute:: returnsUpsertedObjects

       :inheritedFrom: :class:`~carbond.collections.UpdateConfig`
       :type: boolean
       :default: false

       Whether or not the HTTP layer returns objects created via an upsert


    .. attribute:: schema

       :inheritedFrom: :class:`~carbond.collections.UpdateConfig`
       :type: Object
       :default: undefined

       The schema used to validate the request body. No validation will be performed if this is left undefined.


    .. attribute:: supportsQuery

       :type: boolean
       :default: ``true``

       Whether or not the query parameter is supported. Note, "query" here refers to a MongoDB query and not the query string component of the URL.


    .. attribute:: supportsUpsert

       :inheritedFrom: :class:`~carbond.collections.UpdateConfig`
       :type: boolean
       :default: false

       Whether of not the client is allowed to create objects in the collection using the PATCH method

