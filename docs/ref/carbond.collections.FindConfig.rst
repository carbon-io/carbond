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


    .. attribute:: example

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: object
       :default: undefined

       An example response body used for documentation


    .. attribute:: idParameterName

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: string
       :ro:

       The collection object id property name. Note, this is configured on the top level :class:`~carbond.collections.Collection` and set on the configure during initialzation.


    .. attribute:: maxPageSize

       :type: number
       :required:

       If set, then the "limit" parameter will be restricted to min(limit, maxPageSize)


    .. attribute:: noDocument

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: boolean
       :default: false

       Exclude the operation from "docgen" API documentation


    .. attribute:: options

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: object.<string, \*>
       :required:

       Any additional options that should be added to options passed down to a handler.


    .. attribute:: pageSize

       :type: boolean
       :required:

       The page size


    .. attribute:: parameters

       :type: object.<string, carbond.OperationParameter>
       :required:

       The id query parameter (will use :class:`~carbond.collections.Collection.idParameterName` as name) (will be omitted if :class:`~carbond.collections.FindConfig.supportsIdQuery` is ``false``)

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          page, :class:`~carbond.OperationParameter`, ``undefined``, undefined
          pageSize, :class:`~carbond.OperationParameter`, ``undefined``, undefined
          skip, :class:`~carbond.OperationParameter`, ``undefined``, undefined
          limit, :class:`~carbond.OperationParameter`, ``undefined``, undefined
          idParameterName>, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: responses

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: Object.<string, carbond.OperationResponse>
       :required:

       Add custom responses for an operation. Note, this will override all default responses.


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
