.. class:: carbond.security.ApiKeyAuthenticator
    :heading:

.. |br| raw:: html

   <br />

====================================
carbond.security.ApiKeyAuthenticator
====================================
*extends* :class:`~carbond.security.Authenticator`

An abstract class for API key authentication

Instance Properties
-------------------

.. class:: carbond.security.ApiKeyAuthenticator
    :noindex:
    :hidden:

    .. attribute:: apiKeyLocation

       :type: string
       :default: ``header``

       The loaction of the API key, either *header* or *query*.


    .. attribute:: apiKeyParameterName

       :type: string
       :default: ``Api-Key``

       The name of the API key parameter


    .. attribute:: idGenerator

       :type: :class:`~carbond.IdGenerator`
       :default: :class:`~carbond.UUIDGenerator`

       The ID generator to generate API keys.


    .. attribute:: maskUserObjectKeys

       :type: string[]
       :default: undefined

       An array of properties that should be masked on the user object in the logs. Used for masking sensitive information.


Abstract Methods
----------------

.. class:: carbond.security.ApiKeyAuthenticator
    :noindex:
    :hidden:

    .. function:: findUser(apiKey)

        :param apiKey: The API Key that was sent with this request
        :type apiKey: string
        :returns: A user object
        :rtype: Object

        An abstract method for finding the user from an API key. Should be implemented by subclasses. For example, :class:`~carbond.security.MongoDBApiKeyAuthenticator`

Methods
-------

.. class:: carbond.security.ApiKeyAuthenticator
    :noindex:
    :hidden:

    .. function:: authenticate(req)

        :param req: The current request
        :type req: Request
        :throws: HttpErrors.Unauthorized If no user matching the API key is found
        :throws: HttpErrors.InternalServerError If :class:`~carbond.security.ApiKeyAuthenticator.apiKeyLocation` is malformed, or if there is an error finding the user.
        :returns: An object representing the user
        :rtype: Object

        Authenticates the current request using an API key. Returns a user object that matches the API Key sent with the request. If no user matching the API key is found, throws a 401 Unauthorized error.

    .. function:: generateApiKey()

        :returns: A UUID (see [Wikipedia]undefined)
        :rtype: string

        Generates a UUID using :attr:`~carbond.security.ApiKeyAuthenticator.idGenerator`

    .. function:: getAuthenticationHeaders()

        :returns: An array containing the name of the header which contains the API key. An empty array if the location of the API key is in the querystring.
        :rtype: string[]

        Gets an array containing :attr:`~carbond.security.ApiKeyAuthenticator.apiKeyParameterName`

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
