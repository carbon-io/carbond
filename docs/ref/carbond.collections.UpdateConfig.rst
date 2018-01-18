.. class:: carbond.collections.UpdateConfig
    :heading:

.. |br| raw:: html

   <br />

================================
carbond.collections.UpdateConfig
================================
*extends* :class:`~carbond.collections.CollectionOperationConfig`

The update operation config

Instance Properties
-------------------

.. class:: carbond.collections.UpdateConfig
    :noindex:
    :hidden:

    .. attribute:: additionalOptions

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: object.<string, \*>
       :required:

       Any additional options that should be added to options passed down to a handler.


    .. attribute:: additionalParameters

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: object.<string, carbond.OperationParameter>
       :required:

       Any additional parameters that should be added to the collection parameters. These can override parameters configured via the :class:`~carbond.collections.CollectionOperationConfig.parameters`. Note, these will all end up being passed down to operation handlers via the "options" parameter.


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

       :type: Object
       :default: undefined

       An example response body used for documentation


    .. attribute:: idParameter

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: string
       :ro:

       The collection object id property name. Note, this is configured on the top level :class:`~carbond.collections.Collection` and set on the configure during initialzation.


    .. attribute:: noDocument

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: boolean
       :default: false

       Exclude the operation from "docgen" API documentation


    .. attribute:: parameters

       :type: object.<string, carbond.OperationParameter>
       :required:

       The update parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          update, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: responses

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: Object.<string, carbond.OperationResponse>
       :required:

       Add custom responses for an operation. Note, this will override all default responses.


    .. attribute:: returnsUpsertedObjects

       :type: boolean
       :default: false

       Whether or not the HTTP layer returns objects created via an upsert


    .. attribute:: supportsUpsert

       :type: boolean
       :default: false

       Whether of not the client is allowed to create objects in the collection using the PATCH method


    .. attribute:: updateSchema

       :type: Object
       :default: undefined

       The schema used to validate the request body. No validation will be performed if this is left undefined.


    .. attribute:: upsertParameter

       :type: object.<string, carbond.OperationParameter>
       :required:

       The "upsert" parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          upsert, :class:`~carbond.OperationParameter`, ``undefined``, undefined


