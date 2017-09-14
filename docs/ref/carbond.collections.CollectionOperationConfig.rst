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

    .. attribute:: additionalParameters

       :type: :class:`~object.<string, carbond.OperationParameter>`
       :required:

       Any additional parameters that should be added to the collection parameters. These can override parameters configured via the :class:`~carbond.collections.CollectionOperationConfig.parameters`. Note, these will all end up being passed down to operation handlers via the "context" parameter.


    .. attribute:: allowUnauthenticated

       :type: boolean
       :default: undefined

       Allow unauthenticated requests to the operation


    .. attribute:: description

       :type: string
       :default: undefined

       A brief description of the operation used by the documentation generator


    .. attribute:: endpoint

       :type: :class:`~carbond.Endpoint`
       :required:
       :ro:

       The parent endpoint/collection that this configuration is a member of


    .. attribute:: noDocument

       :type: boolean
       :default: undefined

       Exclude the operation from "docgen" API documentation


    .. attribute:: options

       :type: object
       :default: ``{}``

       Any options that should be passed down to the operation handler to be used by the underlying driver


    .. attribute:: responses

       :type: :class:`~carbond.OperationResponse[]`
       :required:

       Add custom responses for an operation. Note, this will override all default responses.

