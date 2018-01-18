.. class:: carbond.mongodb.MongoDBRemoveConfig
    :heading:

.. |br| raw:: html

   <br />

===================================
carbond.mongodb.MongoDBRemoveConfig
===================================
*extends* :class:`~carbond.collections.RemoveConfig`

The MongoDB remove operation config

Instance Properties
-------------------

.. class:: carbond.mongodb.MongoDBRemoveConfig
    :noindex:
    :hidden:

    .. attribute:: additionalOptions

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: object.<string, \*>
       :required:

       Any additional options that should be added to options passed down to a handler.


    .. attribute:: additionalParameters

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: object.<string, carbond.OperationParameter>
       :required:

       Any additional parameters that should be added to the collection parameters. These can override parameters configured via the :class:`~carbond.collections.CollectionOperationConfig.parameters`. Note, these will all end up being passed down to operation handlers via the "options" parameter.


    .. attribute:: allowUnauthenticated

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: boolean
       :default: false

       Allow unauthenticated requests to the operation


    .. attribute:: description

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: string
       :default: undefined

       A brief description of the operation used by the documentation generator


    .. attribute:: driverOptions

       :type: object.<string, \*>
       :required:

       Options to be passed to the mongodb driver (XXX: link to leafnode docs)


    .. attribute:: endpoint

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: :class:`~carbond.Endpoint`
       :ro:

       The parent endpoint/collection that this configuration is a member of


    .. attribute:: idParameter

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: string
       :ro:

       The collection object id property name. Note, this is configured on the top level :class:`~carbond.collections.Collection` and set on the configure during initialzation.


    .. attribute:: noDocument

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: boolean
       :default: false

       Exclude the operation from "docgen" API documentation


    .. attribute:: parameters

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: object.<string, carbond.OperationParameter>
       :ro:

       Operation specific parameters (e.g., "skip", "limit"). These will be passed down to the operation handlers via the options parameter if they are not explicitly passed via another leading parameter (e.g., "id" and "update" for :class:`~carbond.collections.Collection.updateObject`). Note, this should generally be left alone by instances. Instead, use :class:`~carbond.collections.CollectionOperationConfig.additionalParameters`.


    .. attribute:: queryParameter

       :type: object.<string, carbond.OperationParameter>
       :required:

       The "query" parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          query, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: responses

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: Object.<string, carbond.OperationResponse>
       :required:

       Add custom responses for an operation. Note, this will override all default responses.


    .. attribute:: returnsRemovedObjects

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: boolean
       :default: false

       Whether or not the HTTP layer returns objects removed


    .. attribute:: supportsQuery

       :type: boolean
       :default: ``true``

       Whether or not the query parameter is supported. Note, "query" here refers to a MongoDB query and not the query string component of the URL.

