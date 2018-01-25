.. class:: carbond.security.Authenticator
    :heading:

.. |br| raw:: html

   <br />

==============================
carbond.security.Authenticator
==============================

An abstract class used for authenticating requests. Authenticators should extend this class and implement their own authenticate method.

Abstract Methods
----------------

.. class:: carbond.security.Authenticator
    :noindex:
    :hidden:

    .. function:: authenticate(req)

        :param req: The current request
        :type req: :class:`~carbond.Request`
        :throws: HttpErrors.Unauthorized If credentials are present but they fail verification.
        :throws: HttpErrors.InternalServerError If there is an exception on user lookup.
        :returns: This should return an object representing the user *or* undefined if the credendtials are missing.
        :rtype: Object | undefined

        Authenticates the user for a request. Should be implemented by subclasses, for example: :class:`~carbond.security.MongoDBHttpBasicAuthenticator`.

    .. function:: getAuthenticationHeaders()

        :returns: An array of strings representing request headers.
        :rtype: string[]

        Gets the names of the request headers where authentication details can be found. Should be implemented by subclasses, for example: :attr:`~carbond.security.ApiKeyAuthenticator`. Must be implemented by subclasses which use headers other than the Authorization header. Otherwise the custom headers will be blocked by the Service.

Methods
-------

.. class:: carbond.security.Authenticator
    :noindex:
    :hidden:

    .. function:: getService()

        :returns: The parent Service
        :rtype: :class:`~carbond.Service`

        A getter for the parent Service

    .. function:: initialize(service)

        :param service: The parent Service
        :type service: :class:`~carbond.Service`
        :rtype: undefined

        Initializes the authenticator. Called by :class:`~carbond.Service.start` on the parent Service and sets `this.service` to the parent Service.

    .. function:: throwUnauthenticated(msg)

        :param msg: The message returned with the 401 error.
        :type msg: string
        :throws: HttpErrors.Unauthorized 
        :rtype: undefined

        Throws a 401 Unauthorized Error.
