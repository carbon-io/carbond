.. class:: carbond.collections.FindConfig
    :heading:

.. |br| raw:: html

   <br />

==============================
carbond.collections.FindConfig
==============================
*extends* :class:`~carbond.collections.CollectionOperationConfig`

The find operation config

Properties
----------

.. class:: carbond.collections.FindConfig
    :noindex:
    :hidden:

    .. attribute:: carbond.collections.FindConfig.idParameterDefinition

       :type: boolean
       :required:

       The id parameter definition (will use :class:`~carbond.collections.Collection.idParameter` as name). This will be merged into :class:`~carbond.collections.FindConfig.parameters` if configured to support id queries.


    .. attribute:: carbond.collections.FindConfig.maxPageSize

       :type: number
       :required:

       If set, then the "limit" parameter will be restricted to min(limit, maxPageSize)


    .. attribute:: carbond.collections.FindConfig.pageSize

       :type: boolean
       :required:

       The page size


    .. attribute:: carbond.collections.FindConfig.paginationParameters

       :type: object.<string, carbond.OperationParameter>
       :required:

       The "page" parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          page, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: carbond.collections.FindConfig.skipAndLimitParameters

       :type: object.<string, carbond.OperationParameter>
       :required:

       The "limit" parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          skip, :class:`~carbond.OperationParameter`, ``undefined``, undefined
          limit, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: carbond.collections.FindConfig.supportsIdQuery

       :type: boolean
       :required:

       Support id queries (id query parameter)


    .. attribute:: carbond.collections.FindConfig.supportsPagination

       :type: boolean
       :required:

       Support pagination (note, if true, overrides ``supportsPagination``)


    .. attribute:: carbond.collections.FindConfig.supportsSkipAndLimit

       :type: boolean
       :required:

       Support skip and limit


Methods
-------

.. class:: carbond.collections.FindConfig
    :noindex:
    :hidden:

    .. function:: carbond.collections.FindConfig.addIdQueryParameter()

        :rtype: undefined

        Merge :class:`~carbond.collections.FindConfig.idParameterDefinition` into :class:`~carbond.collections.FindConfig.parameters`
