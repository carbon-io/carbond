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

    .. attribute:: example

       :type: object
       :default: undefined

       An example successful response body (201) used for documentation


    .. attribute:: insertObjectSchema

       :type: object
       :default: undefined

       The schema used to validate the request body. If this is undefined, the collection level schema will be used.


    .. attribute:: parameters

       :type: object.<string, carbond.OperationParameter>
       :required:

       The object parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          object, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: returnsInsertedObject

       :type: boolean
       :default: ``true``

       Whether or not the HTTP layer returns the object inserted in the response

