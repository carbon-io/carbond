.. class:: carbond.collections.UpdateObjectConfig
    :heading:

.. |br| raw:: html

   <br />

======================================
carbond.collections.UpdateObjectConfig
======================================
*extends* :class:`~carbond.collections.CollectionOperationConfig`

The update object operation config

Instance Properties
-------------------

.. class:: carbond.collections.UpdateObjectConfig
    :noindex:
    :hidden:

    .. attribute:: allowUnauthenticated

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: boolean
       :default: false

       Allow unauthenticated requests to the operation


    .. attribute:: description

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: string
       :default: undefined

       A brief description of the operation used by the documentation generator


    .. attribute:: endpoint

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: :class:`~carbond.Endpoint`
       :ro:

       The parent endpoint/collection that this configuration is a member of


    .. attribute:: example

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: object
       :default: undefined

       An example response body used for documentation


    .. attribute:: idParameterName

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: string
       :ro:

       The collection object id property name. Note, this is configured on the top level :class:`~carbond.collections.Collection` and set on the configure during initialzation.


    .. attribute:: noDocument

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: boolean
       :default: false

       Exclude the operation from "docgen" API documentation


    .. attribute:: options

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: object.<string, \*>
       :required:

       Any additional options that should be added to options passed down to a handler.


    .. attribute:: parameters

       :type: object.<string, carbond.OperationParameter>
       :required:

       The "upsert" parameter definition (will be omitted if :class:`~carbond.collections.UpdateObjectConfig.supportsUpsert` is ``false``)

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          update, :class:`~carbond.OperationParameter`, ``undefined``, undefined
          upsert, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: responses

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: Object.<string, carbond.OperationResponse>
       :required:

       Add custom responses for an operation. Note, this will override all default responses.


    .. attribute:: returnsUpsertedObject

       :type: boolean
       :default: false

       Whether or not the HTTP layer returns the object created via an upsert


    .. attribute:: schema

       :type: Object
       :default: undefined

       The schema used to validate the request body. No validation will be performed if this is left undefined.


    .. attribute:: supportsUpsert

       :type: boolean
       :default: false

       Whether of not the client is allowed to create objects in the collection using the PATCH method

