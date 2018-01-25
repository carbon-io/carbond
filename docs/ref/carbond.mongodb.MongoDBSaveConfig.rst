.. class:: carbond.mongodb.MongoDBSaveConfig
    :heading:

.. |br| raw:: html

   <br />

=================================
carbond.mongodb.MongoDBSaveConfig
=================================
*extends* :class:`~carbond.collections.SaveConfig`

The MongoDB save operation config

Instance Properties
-------------------

.. class:: carbond.mongodb.MongoDBSaveConfig
    :noindex:
    :hidden:

    .. attribute:: allowUnauthenticated

       :inheritedFrom: :class:`~carbond.collections.SaveConfig`
       :type: boolean
       :default: false

       Allow unauthenticated requests to the operation


    .. attribute:: description

       :inheritedFrom: :class:`~carbond.collections.SaveConfig`
       :type: string
       :default: undefined

       A brief description of the operation used by the documentation generator


    .. attribute:: driverOptions

       :type: object.<string, \*>
       :required:

       Options to be passed to the mongodb driver (XXX: link to leafnode docs)


    .. attribute:: endpoint

       :inheritedFrom: :class:`~carbond.collections.SaveConfig`
       :type: :class:`~carbond.Endpoint`
       :ro:

       The parent endpoint/collection that this configuration is a member of


    .. attribute:: example

       :inheritedFrom: :class:`~carbond.collections.SaveConfig`
       :type: object
       :default: undefined

       An example response body used for documentation


    .. attribute:: idParameterName

       :inheritedFrom: :class:`~carbond.collections.SaveConfig`
       :type: string
       :ro:

       The collection object id property name. Note, this is configured on the top level :class:`~carbond.collections.Collection` and set on the configure during initialzation.


    .. attribute:: noDocument

       :inheritedFrom: :class:`~carbond.collections.SaveConfig`
       :type: boolean
       :default: false

       Exclude the operation from "docgen" API documentation


    .. attribute:: options

       :inheritedFrom: :class:`~carbond.collections.SaveConfig`
       :type: object.<string, \*>
       :required:

       Any additional options that should be added to options passed down to a handler.


    .. attribute:: parameters

       :inheritedFrom: :class:`~carbond.collections.SaveConfig`
       :type: object.<string, carbond.OperationParameter>
       :required:

       The objects parameter definition

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          objects, :class:`~carbond.OperationParameter`, ``undefined``, undefined



    .. attribute:: responses

       :inheritedFrom: :class:`~carbond.collections.SaveConfig`
       :type: Object.<string, carbond.OperationResponse>
       :required:

       Add custom responses for an operation. Note, this will override all default responses.


    .. attribute:: returnsSavedObjects

       :inheritedFrom: :class:`~carbond.collections.SaveConfig`
       :type: boolean
       :default: ``true``

       Whether or not the HTTP layer returns the objects saved in the response


    .. attribute:: schema

       :inheritedFrom: :class:`~carbond.collections.SaveConfig`
       :type: Object
       :default: undefined

       The schema used to validate the request body. If this is undefined, the collection level schema (adapted for arrays) will be used.

