.. class:: carbond.security.MongoDBHttpBasicAuthenticator
    :heading:

.. |br| raw:: html

   <br />

==============================================
carbond.security.MongoDBHttpBasicAuthenticator
==============================================
*extends* :class:`~carbond.security.HttpBasicAuthenticator`

An implemetation of :class:`~carbond.security.HttpBasicAuthenticator` using MongoDB. It queries a MongoDB collection to find a user with a username and password that matches the username and password sent with the request.

Instance Properties
-------------------

.. class:: carbond.security.MongoDBHttpBasicAuthenticator
    :noindex:
    :hidden:

    .. attribute:: dbName

       :type: string
       :required:

       The name of the database to use if there are multiple databases on the parent Service (in :attr:`~carbond.service.dbs`)


    .. attribute:: passwordField

       :inheritedFrom: :class:`~carbond.security.HttpBasicAuthenticator`
       :type: string
       :required:

       Name of the field that contains the password in the database.


    .. attribute:: passwordHashFn

       :inheritedFrom: :class:`~carbond.security.HttpBasicAuthenticator`
       :type: string | function
       :default: ``noop``

       Either a string representing a :class:`~carbond.security.Hasher` (possible values are *noop*, *sha256*, and *bcrypt*), an instance of :class:`~carbond.security.Hasher` or a constructor function for a :class:`~carbond.security.Hasher`.


    .. attribute:: userCollection

       :type: string
       :required:

       The name of the collection in which users are stored


    .. attribute:: usernameField

       :inheritedFrom: :class:`~carbond.security.HttpBasicAuthenticator`
       :type: string
       :required:

       Name of the field that contains the username in the database.


Abstract Methods
----------------

.. class:: carbond.security.MongoDBHttpBasicAuthenticator
    :noindex:
    :hidden:

    .. function:: getAuthenticationHeaders()

        :inheritedFrom: :class:`~carbond.security.HttpBasicAuthenticator`
        :returns: An array of strings representing request headers.
        :rtype: string[]

        Gets the names of the request headers where authentication details can be found. Should be implemented by subclasses, for example: :attr:`~carbond.security.ApiKeyAuthenticator`

    .. function:: isRootUser(user)

        :inheritedFrom: :class:`~carbond.security.HttpBasicAuthenticator`
        :param user: An object representing a user
        :type user: Object
        :returns: ``true`` if the user is determined to be root, ``false`` otherwise.
        :rtype: boolean

        Checks if a user is root.

Methods
-------

.. class:: carbond.security.MongoDBHttpBasicAuthenticator
    :noindex:
    :hidden:

    .. function:: authenticate(req)

        :inheritedFrom: :class:`~carbond.security.HttpBasicAuthenticator`
        :param req: The current request
        :type req: Request
        :throws: HttpErrors.Unauthorized If credentials weren't validated
        :returns: An object representing the user. Undefined if no credentials are found on the request.
        :rtype: Object | undefined

        Authenticates a request using HTTP Baisc. Returns a user object that matches the username and password sent with the request. If no user matching the username and password is found, throws a 401 Unauthorized error.

    .. function:: findUser(username)

        :param username: The username sent by the client.
        :type username: string
        :throws: Error If the database or collection are undefined.
        :returns: An object representing the user if a match is found, otherwise undefined.
        :rtype: Object | undefined

        Queries the database for a user which has a username that matches the username sent in the request.

    .. function:: getService()

        :inheritedFrom: :class:`~carbond.security.HttpBasicAuthenticator`
        :returns: The parent Service
        :rtype: :class:`~carbond.Service`

        A getter for the parent Service

    .. function:: initialize(service)

        :inheritedFrom: :class:`~carbond.security.HttpBasicAuthenticator`
        :param service: The parent Service
        :type service: :class:`~carbond.Service`
        :rtype: undefined

        Initializes the authenticator. Called by :class:`~carbond.Service.start` on the parent Service and sets `this.service` to the parent Service.

    .. function:: throwUnauthenticated(msg)

        :inheritedFrom: :class:`~carbond.security.HttpBasicAuthenticator`
        :param msg: The message returned with the 401 error.
        :type msg: string
        :throws: HttpErrors.Unauthorized 
        :rtype: undefined

        Throws a 401 Unauthorized Error.

    .. function:: validateCreds(username, password)

        :inheritedFrom: :class:`~carbond.security.HttpBasicAuthenticator`
        :param username: username from the HTTP request
        :type username: string
        :param password: password from the HTTP request
        :type password: string
        :throws: Service.errors.InternalServerError 500 Internal Server Error
        :returns: Object representing the user if a user matching the username and password is found. Otherwise returns undefined.
        :rtype: Object | undefined

        Finds a user matching a username and password. The password is checked using the hash function.
