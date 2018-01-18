.. class:: carbond.security.MongoDBApiKeyAuthenticator
    :heading:

.. |br| raw:: html

   <br />

===========================================
carbond.security.MongoDBApiKeyAuthenticator
===========================================
*extends* :class:`~carbond.security.ApiKeyAuthenticator`

An implemetation of :class:`~carbond.security.ApiKeyAuthenticator` using MongoDB. It queries a MongoDB collection to find a user with an API key that matches the key sent with the request.

Instance Properties
-------------------

.. class:: carbond.security.MongoDBApiKeyAuthenticator
    :noindex:
    :hidden:

    .. attribute:: apiKeyField

       :type: string
       :required:

       The name of the field where the API key can be found on the user documents


    .. attribute:: apiKeyLocation

       :inheritedFrom: :class:`~carbond.security.ApiKeyAuthenticator`
       :type: string
       :default: ``header``

       The loaction of the API key, either *header* or *query*.


    .. attribute:: apiKeyParameterName

       :inheritedFrom: :class:`~carbond.security.ApiKeyAuthenticator`
       :type: string
       :default: ``Api-Key``

       The name of the API key parameter


    .. attribute:: db

       :type: :class:`~leafnode.DB`
       :default: undefined

       A getter for the database object on the parent Service. If there are multiple databases, it will return the database defined in :attr:`~carbond.security.MongoDBApiKeyAuthenticator.dbName`


    .. attribute:: dbName

       :type: string
       :default: undefined

       The name of the database to use if there are multiple databases on the parent Service (in :attr:`~carbond.Service.dbs`)


    .. attribute:: idGenerator

       :inheritedFrom: :class:`~carbond.security.ApiKeyAuthenticator`
       :type: :class:`~carbond.IdGenerator`
       :default: :class:`~carbond.UUIDGenerator`

       The ID generator to generate API keys.


    .. attribute:: maskUserObjectKeys

       :inheritedFrom: :class:`~carbond.security.ApiKeyAuthenticator`
       :type: string[]
       :default: undefined

       An array of properties that should be masked on the user object in the logs. Used for masking sensitive information.


    .. attribute:: userCollection

       :type: string
       :required:

       The name of the collection in which users are stored


Abstract Methods
----------------

.. class:: carbond.security.MongoDBApiKeyAuthenticator
    :noindex:
    :hidden:

    .. function:: isRootUser(user)

        :inheritedFrom: :class:`~carbond.security.ApiKeyAuthenticator`
        :param user: An object representing a user
        :type user: Object
        :returns: ``true`` if the user is determined to be root, ``false`` otherwise.
        :rtype: boolean

        Checks if a user is root.

Methods
-------

.. class:: carbond.security.MongoDBApiKeyAuthenticator
    :noindex:
    :hidden:

    .. function:: authenticate(req)

        :inheritedFrom: :class:`~carbond.security.ApiKeyAuthenticator`
        :param req: The current request
        :type req: Request
        :throws: HttpErrors.Unauthorized If no user matching the API key is found
        :throws: HttpErrors.InternalServerError If :class:`~carbond.security.ApiKeyAuthenticator.apiKeyLocation` is malformed, or if there is an error finding the user.
        :returns: An object representing the user
        :rtype: Object

        Authenticates the current request using an API key. Returns a user object that matches the API Key sent with the request. If no user matching the API key is found, throws a 401 Unauthorized error.

    .. function:: findUser(apiKey)

        :param apiKey: The API key from the request
        :type apiKey: string
        :throws: Error if the db, userCollection, or apiKeyField is undefined.
        :returns: An object representing the user if a match is found, otherwise undefined.
        :rtype: Object | undefined

        Queries the database for a user which has an API key that matches the API key sent in the request.

    .. function:: generateApiKey()

        :inheritedFrom: :class:`~carbond.security.ApiKeyAuthenticator`
        :returns: A UUID (see [Wikipedia]undefined)
        :rtype: string

        Generates a UUID using :attr:`~carbond.security.ApiKeyAuthenticator.idGenerator`

    .. function:: getAuthenticationHeaders()

        :inheritedFrom: :class:`~carbond.security.ApiKeyAuthenticator`
        :returns: An array containing the name of the header which contains the API key. An empty array if the location of the API key is in the querystring.
        :rtype: string[]

        Gets an array containing :attr:`~carbond.security.ApiKeyAuthenticator.apiKeyParameterName`

    .. function:: getService()

        :inheritedFrom: :class:`~carbond.security.ApiKeyAuthenticator`
        :returns: The parent Service
        :rtype: :class:`~carbond.Service`

        A getter for the parent Service

    .. function:: initialize(service)

        :inheritedFrom: :class:`~carbond.security.ApiKeyAuthenticator`
        :param service: The parent Service
        :type service: :class:`~carbond.Service`
        :rtype: undefined

        Initializes the authenticator. Called by :class:`~carbond.Service.start` on the parent Service and sets `this.service` to the parent Service.

    .. function:: throwUnauthenticated(msg)

        :inheritedFrom: :class:`~carbond.security.ApiKeyAuthenticator`
        :param msg: The message returned with the 401 error.
        :type msg: string
        :throws: HttpErrors.Unauthorized 
        :rtype: undefined

        Throws a 401 Unauthorized Error.
