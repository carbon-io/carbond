.. class:: carbond.collections.SaveConfig
    :heading:

.. |br| raw:: html

   <br />

==============================
carbond.collections.SaveConfig
==============================
*extends* :class:`~carbond.collections.CollectionOperationConfig`

The save operation config

Properties
----------

.. class:: carbond.collections.SaveConfig
    :noindex:
    :hidden:

    .. attribute:: example

       :type: object
       :default: undefined

       An example response body used for documentation


    .. attribute:: parameters

       :type: object.<string, carbond.OperationParameter>
       :required:

       The objects parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          objects, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: returnsSavedObjects

       :type: boolean
       :default: ``true``

       Whether or not the HTTP layer returns the objects saved in the response


    .. attribute:: saveSchema

       :type: object
       :default: undefined

       The schema used to validate the request body. If this is undefined, the collection level schema (adapted for arrays) will be used.

