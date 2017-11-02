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

    .. attribute:: idParameterDefinition

       :type: boolean
       :required:

       The id parameter definition (will use :class:`~carbond.collections.Collection.idParameter` as name). This will be merged into :class:`~carbond.collections.FindConfig.parameters` if configured to support id queries.


    .. attribute:: maxPageSize

       :type: number
       :required:

       If set, then the "limit" parameter will be restricted to min(limit, maxPageSize)


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
