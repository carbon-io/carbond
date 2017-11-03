.. class:: carbond.mongodb.MongoDBFindObjectConfig
    :heading:

.. |br| raw:: html

   <br />

=======================================
carbond.mongodb.MongoDBFindObjectConfig
=======================================
*extends* :class:`~carbond.collections.FindObjectConfig`

The MongoDB find object operation config

Properties
----------

.. class:: carbond.mongodb.MongoDBFindObjectConfig
    :noindex:
    :hidden:

    .. attribute:: carbond.mongodb.MongoDBFindObjectConfig.driverOptions

       :type: object.<string, \*>
       :required:

       Options to be passed to the mongodb driver (XXX: link to leafnode docs)


    .. attribute:: carbond.mongodb.MongoDBFindObjectConfig.parameters

       :type: object.<string, carbond.OperationParameter>
       :required:

       The "projection" parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          projection, :class:`~carbond.OperationParameter`, ``undefined``, undefined


