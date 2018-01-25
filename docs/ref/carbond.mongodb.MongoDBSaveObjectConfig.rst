.. class:: carbond.mongodb.MongoDBSaveObjectConfig
    :heading:

.. |br| raw:: html

   <br />

=======================================
carbond.mongodb.MongoDBSaveObjectConfig
=======================================
*extends* :class:`~carbond.collections.SaveObjectConfig`

The MongoDB save object operation config

Instance Properties
-------------------

.. class:: carbond.mongodb.MongoDBSaveObjectConfig
    :noindex:
    :hidden:

    .. attribute:: allowUnauthenticated

       :inheritedFrom: :class:`~carbond.collections.SaveObjectConfig`
       :type: boolean
       :default: false

       Allow unauthenticated requests to the operation


    .. attribute:: description

       :inheritedFrom: :class:`~carbond.collections.SaveObjectConfig`
       :type: string
       :default: undefined

       A brief description of the operation used by the documentation generator


    .. attribute:: driverOptions

       :type: object.<string, \*>
       :required:

       Options to be passed to the mongodb driver (XXX: link to leafnode docs)


    .. attribute:: endpoint

       :inheritedFrom: :class:`~carbond.collections.SaveObjectConfig`
       :type: :class:`~carbond.Endpoint`
       :ro:

       The parent endpoint/collection that this configuration is a member of


    .. attribute:: example

       :inheritedFrom: :class:`~carbond.collections.SaveObjectConfig`
       :type: object
       :default: undefined

       An example response body used for documentation


    .. attribute:: idParameterName

       :inheritedFrom: :class:`~carbond.collections.SaveObjectConfig`
       :type: string
       :ro:

       The collection object id property name. Note, this is configured on the top level :class:`~carbond.collections.Collection` and set on the configure during initialzation.


    .. attribute:: noDocument

       :inheritedFrom: :class:`~carbond.collections.SaveObjectConfig`
       :type: boolean
       :default: false

       Exclude the operation from "docgen" API documentation


    .. attribute:: options

       :inheritedFrom: :class:`~carbond.collections.SaveObjectConfig`
       :type: object.<string, \*>
       :required:

       Any additional options that should be added to options passed down to a handler.


    .. attribute:: parameters

       :inheritedFrom: :class:`~carbond.collections.SaveObjectConfig`
       :type: object.<string, carbond.OperationParameter>
       :required:

       The object parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          object, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: responses

       :inheritedFrom: :class:`~carbond.collections.SaveObjectConfig`
       :type: Object.<string, carbond.OperationResponse>
       :required:

       Add custom responses for an operation. Note, this will override all default responses.


    .. attribute:: returnsSavedObject

       :inheritedFrom: :class:`~carbond.collections.SaveObjectConfig`
       :type: boolean
       :default: ``true``

       Whether or not the HTTP layer returns the object saved in the response


    .. attribute:: schema

       :inheritedFrom: :class:`~carbond.collections.SaveObjectConfig`
       :type: Object
       :default: undefined

       The schema used to validate the request body. If this is undefined, the collection level schema will be used.


    .. attribute:: supportsUpsert

       :inheritedFrom: :class:`~carbond.collections.SaveObjectConfig`
       :type: boolean
       :default: false

       Whether of not the client is allowed to create objects in the collection using the PUT method (i.e., is the client allowed to control the ID of a newly created object)

