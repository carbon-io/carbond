.. class:: carbond.collections.UpdateConfig
    :heading:

.. |br| raw:: html

   <br />

================================
carbond.collections.UpdateConfig
================================
*extends* :class:`~carbond.collections.CollectionOperationConfig`

The update operation config

Properties
----------

.. class:: carbond.collections.UpdateConfig
    :noindex:
    :hidden:

    .. attribute:: carbond.collections.UpdateConfig.example

       :type: object
       :default: undefined

       An example response body used for documentation


    .. attribute:: carbond.collections.UpdateConfig.parameters

       :type: object.<string, carbond.OperationParameter>
       :required:

       The update parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          update, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: carbond.collections.UpdateConfig.returnsUpsertedObjects

       :type: boolean
       :default: false

       Whether or not the HTTP layer returns objects created via an upsert


    .. attribute:: carbond.collections.UpdateConfig.supportsUpsert

       :type: boolean
       :default: false

       Whether of not the client is allowed to create objects in the collection using the PATCH method


    .. attribute:: carbond.collections.UpdateConfig.updateSchema

       :type: object
       :default: undefined

       The schema used to validate the request body. No validation will be performed if this is left undefined.


    .. attribute:: carbond.collections.UpdateConfig.upsertParameter

       :type: object.<string, carbond.OperationParameter>
       :required:

       The "upsert" parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          upsert, :class:`~carbond.OperationParameter`, ``undefined``, undefined


