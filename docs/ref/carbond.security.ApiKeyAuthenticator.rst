.. class:: carbond.security.ApiKeyAuthenticator
    :heading:

.. |br| raw:: html

   <br />

====================================
carbond.security.ApiKeyAuthenticator
====================================
*extends* :class:`~carbond.security.ApiKeyAuthenticator`

ApiKeyAuthenticator

Properties
----------

.. class:: carbond.security.ApiKeyAuthenticator
    :noindex:
    :hidden:

    .. attribute:: apiKeyField

       :type: xxx
       :required:

       xxx


    .. attribute:: apiKeyLocation

       :type: string
       :default: ``header``

       xxx


    .. attribute:: apiKeyParameterName

       :type: string
       :default: ``ApiKey``

       xxx


    .. attribute:: db

       :type: xxx
       :required:

       xxx


    .. attribute:: dbName

       :type: xxx
       :required:

       xxx


    .. attribute:: idGenerator

       :type: :class:`~carbond.UUIDGenerator`
       :required:

       xxx


    .. attribute:: maskUserObjectKeys

       :type: xxx
       :required:

       xxx


    .. attribute:: userCollection

       :type: xxx
       :required:

       xxx


Methods
-------

.. class:: carbond.security.ApiKeyAuthenticator
    :noindex:
    :hidden:

    .. function:: authenticate(req)

        :param req: xxx
        :type req: xxx
        :rtype: xxx

        authenticate description

    .. function:: findUser(apiKey)

        :param apiKey: xxx
        :type apiKey: xxx
        :rtype: undefined

        findUser description

    .. function:: findUser(apiKey)

        :param apiKey: xxx
        :type apiKey: xxx
        :throws: Error xxx
        :rtype: xxx

        findUser description

    .. function:: generateApiKey()

        :rtype: xxx

        generateApiKey description

    .. function:: getAuthenticationHeaders()

        :rtype: xxx

        getAuthenticationHeaders description
