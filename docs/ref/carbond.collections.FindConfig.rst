.. class:: carbond.collections.FindConfig
    :heading:

.. |br| raw:: html

   <br />

==============================
carbond.collections.FindConfig
==============================
*extends* :class:`~carbond.collections.CollectionOperationConfig`

The find operation config

Instance Properties
-------------------

.. class:: carbond.collections.FindConfig
    :noindex:
    :hidden:

    .. attribute:: additionalOptions

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: object.<string, \*>
       :required:

       Any additional options that should be added to options passed down to a handler.


    .. attribute:: additionalParameters

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: object.<string, carbond.OperationParameter>
       :required:

       Any additional parameters that should be added to the collection parameters. These can override parameters configured via the :class:`~carbond.collections.CollectionOperationConfig.parameters`. Note, these will all end up being passed down to operation handlers via the "options" parameter.


    .. attribute:: allowUnauthenticated

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: boolean
       :default: false

       Allow unauthenticated requests to the operation


    .. attribute:: description

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: string
       :default: undefined

       A brief description of the operation used by the documentation generator


    .. attribute:: endpoint

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: :class:`~carbond.Endpoint`
       :ro:

       The parent endpoint/collection that this configuration is a member of


    .. attribute:: idParameter

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: string
       :ro:

       The collection object id property name. Note, this is configured on the top level :class:`~carbond.collections.Collection` and set on the configure during initialzation.


    .. attribute:: idParameterDefinition

       :type: boolean
       :required:

       The id parameter definition (will use :class:`~carbond.collections.Collection.idParameter` as name). This will be merged into :class:`~carbond.collections.FindConfig.parameters` if configured to support id queries.


    .. attribute:: maxPageSize

       :type: number
       :required:

       If set, then the "limit" parameter will be restricted to min(limit, maxPageSize)


    .. attribute:: noDocument

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: boolean
       :default: false

       Exclude the operation from "docgen" API documentation


    .. attribute:: pageSize

       :type: boolean
       :required:

       The page size


    .. attribute:: paginationParameters

       :type: object.<string, carbond.OperationParameter>
       :required:

       The "page" parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          page, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: parameters

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: object.<string, carbond.OperationParameter>
       :ro:

       Operation specific parameters (e.g., "skip", "limit"). These will be passed down to the operation handlers via the options parameter if they are not explicitly passed via another leading parameter (e.g., "id" and "update" for :class:`~carbond.collections.Collection.updateObject`). Note, this should generally be left alone by instances. Instead, use :class:`~carbond.collections.CollectionOperationConfig.additionalParameters`.


    .. attribute:: responses

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: Object.<string, carbond.OperationResponse>
       :required:

       Add custom responses for an operation. Note, this will override all default responses.


    .. attribute:: skipAndLimitParameters

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

       :type: boolean
       :required:

       Support id queries (id query parameter)


    .. attribute:: supportsPagination

       :type: boolean
       :required:

       Support pagination (note, if true, overrides ``supportsPagination``)


    .. attribute:: supportsSkipAndLimit

       :type: boolean
       :required:

       Support skip and limit


Methods
-------

.. class:: carbond.collections.FindConfig
    :noindex:
    :hidden:

    .. function:: addIdQueryParameter()

        :rtype: undefined

        Merge :class:`~carbond.collections.FindConfig.idParameterDefinition` into :class:`~carbond.collections.FindConfig.parameters`
