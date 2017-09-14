.. class:: carbond.mongodb.MongoDBFindConfig
    :heading:

.. |br| raw:: html

   <br />

=================================
carbond.mongodb.MongoDBFindConfig
=================================
*extends* :class:`~carbond.collections.FindConfig`

The MongoDB find operation config

Properties
----------

.. class:: carbond.mongodb.MongoDBFindConfig
    :noindex:
    :hidden:

    .. attribute:: parameters

       :type: :class:`~object.<string, carbond.OperationParameter>`
       :required:

       The "projection" parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          sort, :class:`~carbond.OperationParameter`, ``undefined``, undefined
          projection, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: queryParameter

       :type: :class:`~object.<string, carbond.OperationParameter>`
       :required:

       The "query" parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          query, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: supportsQuery

       :type: boolean
       :default: ``true``

       Whether or not the query parameter is supported. Note, "query" here refers to a MongoDB query and not the query string component of the URL.

