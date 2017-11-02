.. class:: carbond.mongodb.MongoDBRemoveConfig
    :heading:

.. |br| raw:: html

   <br />

===================================
carbond.mongodb.MongoDBRemoveConfig
===================================
*extends* :class:`~carbond.collections.RemoveConfig`

The MongoDB remove operation config

Properties
----------

.. class:: carbond.mongodb.MongoDBRemoveConfig
    :noindex:
    :hidden:

    .. attribute:: driverOptions

       :type: object.<string, \*>
       :required:

       Options to be passed to the mongodb driver (XXX: link to leafnode docs)


    .. attribute:: queryParameter

       :type: object.<string, carbond.OperationParameter>
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

