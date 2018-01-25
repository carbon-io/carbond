.. class:: carbond.security.HttpBasicAuthenticator
    :heading:

.. |br| raw:: html

   <br />

=======================================
carbond.security.HttpBasicAuthenticator
=======================================
*extends* :class:`~carbond.security.Authenticator`

An authenticator for the Basic HTTP Authenitcation Scheme.

Instance Properties
-------------------

.. class:: carbond.security.HttpBasicAuthenticator
    :noindex:
    :hidden:

    .. attribute:: passwordField

       :type: string
       :required:

       Name of the field that contains the password in the database.


    .. attribute:: passwordHashFn

       :type: string | function
       :default: ``noop``

       Either a string representing a :class:`~carbond.security.Hasher` (possible values are *noop*, *sha256*, and *bcrypt*), an instance of :class:`~carbond.security.Hasher` or a constructor function for a :class:`~carbond.security.Hasher`.


    .. attribute:: usernameField

       :type: string
       :required:

       Name of the field that contains the username in the database.


Abstract Methods
----------------

.. class:: carbond.security.HttpBasicAuthenticator
    :noindex:
    :hidden:

    .. function:: findUser(username)

        :param username: The username sent by the client.
        :type username: string
        :throws: Error If the usernameField or passwordField are undefined.

        Find a user matching a username. Must be implemented by subcalsses.

    .. function:: getAuthenticationHeaders()

        :inheritedFrom: :class:`~carbond.security.Authenticator`
        :returns: An array of strings representing request headers.
        :rtype: string[]

        Gets the names of the request headers where authentication details can be found. Should be implemented by subclasses, for example: :attr:`~carbond.security.ApiKeyAuthenticator`. Must be implemented by subclasses which use headers other than the Authorization header. Otherwise the custom headers will be blocked by the Service.

Methods
-------

.. class:: carbond.security.HttpBasicAuthenticator
    :noindex:
    :hidden:

    .. function:: authenticate(req)

        :param req: The current request
        :type req: Request
        :throws: HttpErrors.Unauthorized If credentials weren't validated
        :returns: An object representing the user. Undefined if no credentials are found on the request.
        :rtype: Object | undefined

        Authenticates a request using HTTP Baisc. Returns a user object that matches the username and password sent with the request. If no user matching the username and password is found, throws a 401 Unauthorized error.

    .. function:: getService()

        :inheritedFrom: :class:`~carbond.security.Authenticator`
        :returns: The parent Service
        :rtype: :class:`~carbond.Service`

        A getter for the parent Service

    .. function:: initialize(service)

        :inheritedFrom: :class:`~carbond.security.Authenticator`
        :param service: The parent Service
        :type service: :class:`~carbond.Service`
        :rtype: undefined

        Initializes the authenticator. Called by :class:`~carbond.Service.start` on the parent Service and sets `this.service` to the parent Service.

    .. function:: throwUnauthenticated(msg)

        :inheritedFrom: :class:`~carbond.security.Authenticator`
        :param msg: The message returned with the 401 error.
        :type msg: string
        :throws: HttpErrors.Unauthorized 
        :rtype: undefined

        Throws a 401 Unauthorized Error.

    .. function:: validateCreds(username, password)

        :param username: username from the HTTP request
        :type username: string
        :param password: password from the HTTP request
        :type password: string
        :throws: Service.errors.InternalServerError 500 Internal Server Error
        :returns: Object representing the user if a user matching the username and password is found. Otherwise returns undefined.
        :rtype: Object | undefined

        Finds a user matching a username and password. The password is checked using the hash function.
