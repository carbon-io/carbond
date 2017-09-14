.. class:: carbond.collections.UpdateObjectConfig
    :heading:

.. |br| raw:: html

   <br />

======================================
carbond.collections.UpdateObjectConfig
======================================
*extends* :class:`~carbond.collections.CollectionOperationConfig`

The update object operation config

Properties
----------

.. class:: carbond.collections.UpdateObjectConfig
    :noindex:
    :hidden:

    .. attribute:: example

       :type: object
       :default: undefined

       An example response body used for documentation


    .. attribute:: parameters

       :type: :class:`~object.<string, carbond.OperationParameter>`
       :required:

       Update object operation specific parameters


    .. attribute:: returnsUpsertedObject

       :type: boolean
       :default: undefined

       Whether or not the HTTP layer returns the object created via an upsert


    .. attribute:: supportsUpsert

       :type: boolean
       :default: undefined

       Whether of not the client is allowed to create objects in the collection using the PATCH method


    .. attribute:: updateObjectSchema

       :type: object
       :default: undefined

       The schema used to validate the request body. No validation will be performed if this is left undefined.


    .. attribute:: upsertParameter

       :type: :class:`~object.<string, carbond.OperationParameter>`
       :required:

       The "upsert" parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          upsert, :class:`~carbond.OperationParameter`, ``undefined``, undefined


