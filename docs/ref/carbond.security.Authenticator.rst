.. class:: carbond.security.Authenticator
    :heading:

.. |br| raw:: html

   <br />

==============================
carbond.security.Authenticator
==============================

Methods
-------

.. class:: carbond.security.Authenticator
    :noindex:
    :hidden:

    .. function:: authenticate(req)

        :param req: xxx
        :type req: xxx
        :throws: :class:`~Service.errors.Unauthorized` If credentials are present but they fail verification.
        :throws: :class:`~Service.errors.InternalServerError` If there is an exception on user lookup.
        :rtype: Object | undefined

        authenticate description

    .. function:: getAuthenticationHeaders()

        :rtype: xxx

        getAuthenticationHeaders description

    .. function:: getService()

        :rtype: xxx

        getService description

    .. function:: initialize(service)

        :param service: xxx
        :type service: xxx
        :rtype: xxx

        initialize description

    .. function:: isRootUser(user)

        :param user: xxx
        :type user: xxx
        :rtype: boolean

        isRootUser description

    .. function:: throwUnauthenticated(msg)

        :param msg: xxx
        :type msg: xxx
        :throws: :class:`~Service.errors.Unauthorized` xxx
        :rtype: undefined

        throwUnauthenticated description
