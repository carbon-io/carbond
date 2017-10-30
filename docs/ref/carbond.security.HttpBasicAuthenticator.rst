.. class:: carbond.security.HttpBasicAuthenticator
    :heading:

.. |br| raw:: html

   <br />

=======================================
carbond.security.HttpBasicAuthenticator
=======================================
*extends* :class:`~carbond.security.Authenticator`

An authenticator for the Basic HTTP Authenitcation Scheme.

Properties
----------

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


Methods
-------

.. class:: carbond.security.HttpBasicAuthenticator
    :noindex:
    :hidden:

    .. function:: authenticate(req)

        :param req: The current request
        :type req: Request
        :throws: :class:`~HttpErrors.Unauthorized` If credentials weren't validated
        :rtype: Object | undefined

        Authenticates a request using HTTP Baisc. Returns a user object that matches the username and password sent with the request. If no user matching the username and password is found, throws a 401 Unauthorized error.

    .. function:: findUser(username)

        :param username: The username sent by the client.
        :type username: string
        :throws: Error If the usernameField or passwordField are undefined.

        Find a user matching a username. Must be implemented by subcalsses.

    .. function:: validateCreds(username, password)

        :param username: username from the HTTP request
        :type username: string
        :param password: password from the HTTP request
        :type password: string
        :throws: :class:`~Service.errors.InternalServerError` 500 Internal Server Error
        :rtype: Object | undefined

        Finds a user matching a username and password. The password is checked using the hash function.
