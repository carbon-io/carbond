.. class:: carbond.mongodb.MongoDBFindConfig
    :heading:

.. |br| raw:: html

   <br />

=================================
carbond.mongodb.MongoDBFindConfig
=================================
*extends* :class:`~carbond.collections.FindConfig`

The MongoDB find operation config

Instance Properties
-------------------

.. class:: carbond.mongodb.MongoDBFindConfig
    :noindex:
    :hidden:

    .. attribute:: additionalOptions

       :inheritedFrom: :class:`~carbond.collections.FindConfig`
       :type: object.<string, \*>
       :required:

       Any additional options that should be added to options passed down to a handler.


    .. attribute:: additionalParameters

       :inheritedFrom: :class:`~carbond.collections.FindConfig`
       :type: object.<string, carbond.OperationParameter>
       :required:

       Any additional parameters that should be added to the collection parameters. These can override parameters configured via the :class:`~carbond.collections.CollectionOperationConfig.parameters`. Note, these will all end up being passed down to operation handlers via the "options" parameter.


    .. attribute:: allowUnauthenticated

       :inheritedFrom: :class:`~carbond.collections.FindConfig`
       :type: boolean
       :default: false

       Allow unauthenticated requests to the operation


    .. attribute:: description

       :inheritedFrom: :class:`~carbond.collections.FindConfig`
       :type: string
       :default: undefined

       A brief description of the operation used by the documentation generator


    .. attribute:: driverOptions

       :type: object.<string, \*>
       :required:

       Options to be passed to the mongodb driver (XXX: link to leafnode docs)


    .. attribute:: endpoint

       :inheritedFrom: :class:`~carbond.collections.FindConfig`
       :type: :class:`~carbond.Endpoint`
       :ro:

       The parent endpoint/collection that this configuration is a member of


    .. attribute:: idParameter

       :inheritedFrom: :class:`~carbond.collections.FindConfig`
       :type: string
       :ro:

       The collection object id property name. Note, this is configured on the top level :class:`~carbond.collections.Collection` and set on the configure during initialzation.


    .. attribute:: idParameterDefinition

       :inheritedFrom: :class:`~carbond.collections.FindConfig`
       :type: boolean
       :required:

       The id parameter definition (will use :class:`~carbond.collections.Collection.idParameter` as name). This will be merged into :class:`~carbond.collections.FindConfig.parameters` if configured to support id queries.


    .. attribute:: maxPageSize

       :inheritedFrom: :class:`~carbond.collections.FindConfig`
       :type: number
       :required:

       If set, then the "limit" parameter will be restricted to min(limit, maxPageSize)


    .. attribute:: noDocument

       :inheritedFrom: :class:`~carbond.collections.FindConfig`
       :type: boolean
       :default: false

       Exclude the operation from "docgen" API documentation


    .. attribute:: pageSize

       :inheritedFrom: :class:`~carbond.collections.FindConfig`
       :type: boolean
       :required:

       The page size


    .. attribute:: paginationParameters

       :inheritedFrom: :class:`~carbond.collections.FindConfig`
       :type: object.<string, carbond.OperationParameter>
       :required:

       The "page" parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          page, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: parameters

       :type: object.<string, carbond.OperationParameter>
       :required:

       The "projection" parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          sort, :class:`~carbond.OperationParameter`, ``undefined``, undefined
          projection, :class:`~carbond.OperationParameter`, ``undefined``, undefined



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

       :inheritedFrom: :class:`~carbond.collections.FindConfig`
       :type: Object.<string, carbond.OperationResponse>
       :required:

       Add custom responses for an operation. Note, this will override all default responses.


    .. attribute:: skipAndLimitParameters

       :inheritedFrom: :class:`~carbond.collections.FindConfig`
       :type: object.<string, carbond.OperationParameter>
       :required:

       The "limit" parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          skip, :class:`~carbond.OperationParameter`, ``undefined``, undefined
          limit, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: supportsIdQuery

       :inheritedFrom: :class:`~carbond.collections.FindConfig`
       :type: boolean
       :required:

       Support id queries (id query parameter)


    .. attribute:: supportsPagination

       :type: boolean
       :required:

       Support pagination


    .. attribute:: supportsQuery

       :type: boolean
       :default: ``true``

       Whether or not the query parameter is supported. Note, "query" here refers to a MongoDB query and not the query string component of the URL.


    .. attribute:: supportsSkipAndLimit

       :type: boolean
       :required:

       Support skip and limit


Methods
-------

.. class:: carbond.mongodb.MongoDBFindConfig
    :noindex:
    :hidden:

    .. function:: addIdQueryParameter()

        :inheritedFrom: :class:`~carbond.collections.FindConfig`
        :rtype: undefined

        Merge :class:`~carbond.collections.FindConfig.idParameterDefinition` into :class:`~carbond.collections.FindConfig.parameters`
