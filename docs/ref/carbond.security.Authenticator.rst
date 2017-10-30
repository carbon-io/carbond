.. class:: carbond.security.Authenticator
    :heading:

.. |br| raw:: html

   <br />

==============================
carbond.security.Authenticator
==============================

An abstract class used for authenticating requests. Authenticators should extend this class and implement their own authenticate method.

Methods
-------

.. class:: carbond.security.Authenticator
    :noindex:
    :hidden:

    .. function:: authenticate(req)

        :param req: The current request
        :type req: :class:`~carbond.Request`
        :throws: :class:`~HttpErrors.Unauthorized` If credentials are present but they fail verification.
        :throws: :class:`~HttpErrors.InternalServerError` If there is an exception on user lookup.
        :rtype: Object | undefined

        Authenticates the user for a request. Should be implemented by subclasses, for example: :class:`~carbond.security.MongoDBHttpBasicAuthenticator`.

    .. function:: getAuthenticationHeaders()

        :rtype: string[]

        Gets the names of the request headers where authentication details can be found. Should be implemented by subclasses, for example: :attr:`~carbond.security.ApiKeyAuthenticator`

    .. function:: getService()

        :rtype: :class:`~carbond.Service`

        A getter for the parent Service

    .. function:: initialize(service)

        :param service: The parent Service
        :type service: :class:`~carbond.Service`
        :rtype: undefined

        Initializes the authenticator. Called by :class:`~carbond.Service.start` on the parent Service and sets `this.service` to the parent Service.

    .. function:: isRootUser(user)

        :param user: An object representing a user
        :type user: Object
        :rtype: boolean

        Checks if a user is root.

    .. function:: throwUnauthenticated(msg)

        :param msg: The message returned with the 401 error.
        :type msg: string
        :throws: :class:`~HttpErrors.Unauthorized` 
        :rtype: undefined

        Throws a 401 Unauthorized Error.
