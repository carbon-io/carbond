.. class:: carbond.security.MongoDBApiKeyAuthenticator
    :heading:

.. |br| raw:: html

   <br />

===========================================
carbond.security.MongoDBApiKeyAuthenticator
===========================================
*extends* :class:`~carbond.security.ApiKeyAuthenticator`

An implemetation of :class:`~carbond.security.ApiKeyAuthenticator` using MongoDB. It queries a MongoDB collection to find a user with an API key that matches the key sent with the request.

Properties
----------

.. class:: carbond.security.MongoDBApiKeyAuthenticator
    :noindex:
    :hidden:

    .. attribute:: carbond.security.MongoDBApiKeyAuthenticator.apiKeyField

       :type: string
       :required:

       The name of the field where the API key can be found on the user documents


    .. attribute:: carbond.security.MongoDBApiKeyAuthenticator.db

       :type: :class:`~leafnode.DB`
       :default: undefined

       A getter for the database object on the parent Service. If there are multiple databases, it will return the database defined in :attr:`~carbond.security.MongoDBApiKeyAuthenticator.dbName`


    .. attribute:: carbond.security.MongoDBApiKeyAuthenticator.dbName

       :type: string
       :default: undefined

       The name of the database to use if there are multiple databases on the parent Service (in :attr:`~carbond.Service.dbs`)


    .. attribute:: carbond.security.MongoDBApiKeyAuthenticator.userCollection

       :type: string
       :required:

       The name of the collection in which users are stored


Methods
-------

.. class:: carbond.security.MongoDBApiKeyAuthenticator
    :noindex:
    :hidden:

    .. function:: carbond.security.MongoDBApiKeyAuthenticator.findUser(apiKey)

        :param apiKey: The API key from the request
        :type apiKey: string
        :throws: Error if the db, userCollection, or apiKeyField is undefined.
        :rtype: Object | undefined

        Queries the database for a user which has an API key that matches the API key sent in the request.
