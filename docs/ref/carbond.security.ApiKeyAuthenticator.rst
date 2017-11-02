.. class:: carbond.security.ApiKeyAuthenticator
    :heading:

.. |br| raw:: html

   <br />

====================================
carbond.security.ApiKeyAuthenticator
====================================
*extends* :class:`~carbond.security.Authenticator`

An abstract class for API key authentication

Properties
----------

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


Methods
-------

.. class:: carbond.security.ApiKeyAuthenticator
    :noindex:
    :hidden:

    .. function:: authenticate(req)

        :param req: The current request
        :type req: Request
        :throws: :class:`~HttpErrors.Unauthorized` If no user matching the API key is found
        :throws: :class:`~HttpErrors.InternalServerError` If :class:`~carbond.security.ApiKeyAuthenticator.apiKeyLocation` is malformed, or if there is an error finding the user.
        :rtype: Object

        Authenticates the current request using an API key. Returns a user object that matches the API Key sent with the request. If no user matching the API key is found, throws a 401 Unauthorized error.

    .. function:: findUser(apiKey)

        :param apiKey: The API Key that was sent with this request
        :type apiKey: string
        :rtype: Object

        An abstract method for finding the user from an API key. Should be implemented by subclasses. For example, :class:`~carbond.security.MongoDBApiKeyAuthenticator`

    .. function:: generateApiKey()

        :rtype: string

        Generates a UUID using :attr:`~carbond.security.ApiKeyAuthenticator.idGenerator`

    .. function:: getAuthenticationHeaders()

        :rtype: string[]

        Gets an array containing :attr:`~carbond.security.ApiKeyAuthenticator.apiKeyParameterName`
