.. class:: carbond.collections.SaveObjectConfig
    :heading:

.. |br| raw:: html

   <br />

====================================
carbond.collections.SaveObjectConfig
====================================
*extends* :class:`~carbond.collections.CollectionOperationConfig`

The save object operation config

Instance Properties
-------------------

.. class:: carbond.collections.SaveObjectConfig
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

       The object parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          object, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: responses

       :inheritedFrom: :class:`~carbond.collections.CollectionOperationConfig`
       :type: Object.<string, carbond.OperationResponse>
       :required:

       Add custom responses for an operation. Note, this will override all default responses.


    .. attribute:: returnsSavedObject

       :type: boolean
       :default: ``true``

       Whether or not the HTTP layer returns the object saved in the response


    .. attribute:: saveObjectSchema

       :type: Object
       :default: undefined

       The schema used to validate the request body. If this is undefined, the collection level schema will be used.


    .. attribute:: supportsUpsert

       :type: boolean
       :default: ``true``

       Whether of not the client is allowed to create objects in the collection using the PUT method (i.e., is the client allowed to control the ID of a newly created object)

