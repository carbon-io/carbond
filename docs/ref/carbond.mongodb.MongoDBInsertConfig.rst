.. class:: carbond.mongodb.MongoDBInsertConfig
    :heading:

.. |br| raw:: html

   <br />

===================================
carbond.mongodb.MongoDBInsertConfig
===================================
*extends* :class:`~carbond.collections.InsertConfig`

The MongoDB insert operation config

Instance Properties
-------------------

.. class:: carbond.mongodb.MongoDBInsertConfig
    :noindex:
    :hidden:

    .. attribute:: additionalOptions

       :inheritedFrom: :class:`~carbond.collections.InsertConfig`
       :type: object.<string, \*>
       :required:

       Any additional options that should be added to options passed down to a handler.


    .. attribute:: additionalParameters

       :inheritedFrom: :class:`~carbond.collections.InsertConfig`
       :type: object.<string, carbond.OperationParameter>
       :required:

       Any additional parameters that should be added to the collection parameters. These can override parameters configured via the :class:`~carbond.collections.CollectionOperationConfig.parameters`. Note, these will all end up being passed down to operation handlers via the "options" parameter.


    .. attribute:: allowUnauthenticated

       :inheritedFrom: :class:`~carbond.collections.InsertConfig`
       :type: boolean
       :default: false

       Allow unauthenticated requests to the operation


    .. attribute:: description

       :inheritedFrom: :class:`~carbond.collections.InsertConfig`
       :type: string
       :default: undefined

       A brief description of the operation used by the documentation generator


    .. attribute:: driverOptions

       :type: object.<string, \*>
       :required:

       Options to be passed to the mongodb driver (XXX: link to leafnode docs)


    .. attribute:: endpoint

       :inheritedFrom: :class:`~carbond.collections.InsertConfig`
       :type: :class:`~carbond.Endpoint`
       :ro:

       The parent endpoint/collection that this configuration is a member of


    .. attribute:: example

       :inheritedFrom: :class:`~carbond.collections.InsertConfig`
       :type: object
       :default: undefined

       An example response body (201) used for documentation


    .. attribute:: idParameter

       :inheritedFrom: :class:`~carbond.collections.InsertConfig`
       :type: string
       :ro:

       The collection object id property name. Note, this is configured on the top level :class:`~carbond.collections.Collection` and set on the configure during initialzation.


    .. attribute:: insertSchema

       :inheritedFrom: :class:`~carbond.collections.InsertConfig`
       :type: object
       :default: undefined

       The schema used to validate the request body. If this is undefined, the collection level schema (adapted for arrays) will be used.


    .. attribute:: noDocument

       :inheritedFrom: :class:`~carbond.collections.InsertConfig`
       :type: boolean
       :default: false

       Exclude the operation from "docgen" API documentation


    .. attribute:: parameters

       :inheritedFrom: :class:`~carbond.collections.InsertConfig`
       :type: object.<string, carbond.OperationParameter>
       :required:

       The body parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          objects, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: responses

       :inheritedFrom: :class:`~carbond.collections.InsertConfig`
       :type: Object.<string, carbond.OperationResponse>
       :required:

       Add custom responses for an operation. Note, this will override all default responses.


    .. attribute:: returnsInsertedObjects

       :inheritedFrom: :class:`~carbond.collections.InsertConfig`
       :type: boolean
       :default: ``true``

       Whether or not the HTTP layer returns the objects inserted in the response

