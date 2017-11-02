.. class:: carbond.collections.SaveObjectConfig
    :heading:

.. |br| raw:: html

   <br />

====================================
carbond.collections.SaveObjectConfig
====================================
*extends* :class:`~carbond.collections.CollectionOperationConfig`

The save object operation config

Properties
----------

.. class:: carbond.collections.SaveObjectConfig
    :noindex:
    :hidden:

    .. attribute:: example

       :type: object
       :default: undefined

       An example response body used for documentation


    .. attribute:: parameters

       :type: object.<string, carbond.OperationParameter>
       :required:

       The object parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          object, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: returnsSavedObject

       :type: boolean
       :default: ``true``

       Whether or not the HTTP layer returns the object saved in the response


    .. attribute:: saveObjectSchema

       :type: object
       :default: undefined

       The schema used to validate the request body. If this is undefined, the collection level schema will be used.


    .. attribute:: supportsUpsert

       :type: boolean
       :default: ``true``

       Whether of not the client is allowed to create objects in the collection using the PUT method (i.e., is the client allowed to control the ID of a newly created object)

