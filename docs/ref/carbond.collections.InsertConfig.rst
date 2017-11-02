.. class:: carbond.collections.InsertConfig
    :heading:

.. |br| raw:: html

   <br />

================================
carbond.collections.InsertConfig
================================
*extends* :class:`~carbond.collections.CollectionOperationConfig`

The insert operation config

Properties
----------

.. class:: carbond.collections.InsertConfig
    :noindex:
    :hidden:

    .. attribute:: example

       :type: object
       :default: undefined

       An example response body (201) used for documentation


    .. attribute:: insertSchema

       :type: object
       :default: undefined

       The schema used to validate the request body. If this is undefined, the collection level schema (adapted for arrays) will be used.


    .. attribute:: parameters

       :type: object.<string, carbond.OperationParameter>
       :required:

       The body parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          objects, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: returnsInsertedObjects

       :type: boolean
       :default: ``true``

       Whether or not the HTTP layer returns the objects inserted in the response

