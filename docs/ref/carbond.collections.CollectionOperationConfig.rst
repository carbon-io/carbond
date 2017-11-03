.. class:: carbond.collections.CollectionOperationConfig
    :heading:

.. |br| raw:: html

   <br />

=============================================
carbond.collections.CollectionOperationConfig
=============================================

The base class for all collection configs

Properties
----------

.. class:: carbond.collections.CollectionOperationConfig
    :noindex:
    :hidden:

    .. attribute:: carbond.collections.CollectionOperationConfig.additionalOptions

       :type: object.<string, \*>
       :required:

       Any additional options that should be added to options passed down to a handler.


    .. attribute:: carbond.collections.CollectionOperationConfig.additionalParameters

       :type: object.<string, carbond.OperationParameter>
       :required:

       Any additional parameters that should be added to the collection parameters. These can override parameters configured via the :class:`~carbond.collections.CollectionOperationConfig.parameters`. Note, these will all end up being passed down to operation handlers via the "options" parameter.


    .. attribute:: carbond.collections.CollectionOperationConfig.allowUnauthenticated

       :type: boolean
       :default: false

       Allow unauthenticated requests to the operation


    .. attribute:: carbond.collections.CollectionOperationConfig.description

       :type: string
       :default: undefined

       A brief description of the operation used by the documentation generator


    .. attribute:: carbond.collections.CollectionOperationConfig.endpoint

       :type: :class:`~carbond.Endpoint`
       :ro:

       The parent endpoint/collection that this configuration is a member of


    .. attribute:: carbond.collections.CollectionOperationConfig.idParameter

       :type: string
       :ro:

       The collection object id property name. Note, this is configured on the top level :class:`~carbond.collections.Collection` and set on the configure during initialzation.


    .. attribute:: carbond.collections.CollectionOperationConfig.noDocument

       :type: boolean
       :default: false

       Exclude the operation from "docgen" API documentation


    .. attribute:: carbond.collections.CollectionOperationConfig.parameters

       :type: object.<string, carbond.OperationParameter>
       :ro:

       Operation specific parameters (e.g., "skip", "limit"). These will be passed down to the operation handlers via the options parameter if they are not explicitly passed via another leading parameter (e.g., "id" and "update" for :class:`~carbond.collections.Collection.updateObject`). Note, this should generally be left alone by instances. Instead, use :class:`~carbond.collections.CollectionOperationConfig.additionalParameters`.


    .. attribute:: carbond.collections.CollectionOperationConfig.responses

       :type: :class:`~carbond.OperationResponse[]`
       :required:

       Add custom responses for an operation. Note, this will override all default responses.

