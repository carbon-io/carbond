.. class:: carbond.mongodb.MongoDBRemoveConfig
    :heading:

.. |br| raw:: html

   <br />

===================================
carbond.mongodb.MongoDBRemoveConfig
===================================
*extends* :class:`~carbond.collections.RemoveConfig`

The MongoDB remove operation config

Instance Properties
-------------------

.. class:: carbond.mongodb.MongoDBRemoveConfig
    :noindex:
    :hidden:

    .. attribute:: allowUnauthenticated

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: boolean
       :default: false

       Allow unauthenticated requests to the operation


    .. attribute:: description

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: string
       :default: undefined

       A brief description of the operation used by the documentation generator


    .. attribute:: driverOptions

       :type: object.<string, \*>
       :required:

       Options to be passed to the mongodb driver (XXX: link to leafnode docs)


    .. attribute:: endpoint

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: :class:`~carbond.Endpoint`
       :ro:

       The parent endpoint/collection that this configuration is a member of


    .. attribute:: example

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: object
       :default: undefined

       An example response body used for documentation


    .. attribute:: idParameterName

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: string
       :ro:

       The collection object id property name. Note, this is configured on the top level :class:`~carbond.collections.Collection` and set on the configure during initialzation.


    .. attribute:: noDocument

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: boolean
       :default: false

       Exclude the operation from "docgen" API documentation


    .. attribute:: options

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: object.<string, \*>
       :required:

       Any additional options that should be added to options passed down to a handler.


    .. attribute:: parameters

       :type: object.<string, carbond.OperationParameter>
       :required:

       The "query" parameter definition (will be omitted if :class:`~carbond.collections.MongoDBRemoveConfig.supportsQuery` is ``false``)

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          query, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: responses

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: Object.<string, carbond.OperationResponse>
       :required:

       Add custom responses for an operation. Note, this will override all default responses.


    .. attribute:: returnsRemovedObjects

       :inheritedFrom: :class:`~carbond.collections.RemoveConfig`
       :type: boolean
       :default: false

       Whether or not the HTTP layer returns objects removed


    .. attribute:: supportsQuery

       :type: boolean
       :default: ``true``

       Whether or not the query parameter is supported. Note, "query" here refers to a MongoDB query and not the query string component of the URL.

