.. class:: carbond.collections.InsertObjectConfig
    :heading:

.. |br| raw:: html

   <br />

======================================
carbond.collections.InsertObjectConfig
======================================
*extends* :class:`~carbond.collections.CollectionOperationConfig`

The insert object operation config

Properties
----------

.. class:: carbond.collections.InsertObjectConfig
    :noindex:
    :hidden:

    .. attribute:: carbond.collections.InsertObjectConfig.example

       :type: object
       :default: undefined

       An example successful response body (201) used for documentation


    .. attribute:: carbond.collections.InsertObjectConfig.insertObjectSchema

       :type: object
       :default: undefined

       The schema used to validate the request body. If this is undefined, the collection level schema will be used.


    .. attribute:: carbond.collections.InsertObjectConfig.parameters

       :type: object.<string, carbond.OperationParameter>
       :required:

       The object parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          object, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: carbond.collections.InsertObjectConfig.returnsInsertedObject

       :type: boolean
       :default: ``true``

       Whether or not the HTTP layer returns the object inserted in the response

