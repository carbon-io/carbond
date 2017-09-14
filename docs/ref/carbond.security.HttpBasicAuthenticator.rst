.. class:: carbond.security.HttpBasicAuthenticator
    :heading:

.. |br| raw:: html

   <br />

=======================================
carbond.security.HttpBasicAuthenticator
=======================================
*extends* :class:`~carbond.security.Authenticator`

HttpBasicAuthenticator description

Properties
----------

.. class:: carbond.security.HttpBasicAuthenticator
    :noindex:
    :hidden:

    .. attribute:: passwordField

       :type: string
       :required:

       xxx


    .. attribute:: passwordHashFn

       :type: string
       :default: ``noop``

       xxx


    .. attribute:: usernameField

       :type: string
       :required:

       xxx


Methods
-------

.. class:: carbond.security.HttpBasicAuthenticator
    :noindex:
    :hidden:

    .. function:: authenticate(req)

        :param req: xxx
        :type req: xxx
        :rtype: xxx

        authenticate

    .. function:: findUser(username)

        :param username: The username sent by the client.
        :type username: string
        :throws: Error xxx

        findUser NOTE: this should be extended

    .. function:: validateCreds(username, password)

        :param username: xxx
        :type username: string
        :param password: xxx
        :type password: string
        :throws: :class:`~Service.errors.InternalServerError` xxx
        :rtype: xxx

        validateCreds description
