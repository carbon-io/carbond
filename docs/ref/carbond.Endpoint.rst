.. class:: carbond.Endpoint
    :heading:

.. |br| raw:: html

   <br />

================
carbond.Endpoint
================

Endpoint class description

Properties
----------

.. class:: carbond.Endpoint
    :noindex:
    :hidden:

    .. attribute:: acl

       :type: xxx
       :required:

       xxx


    .. attribute:: ALL_METHODS

       :type: object
       :required:

       xxx


    .. attribute:: allowUnauthenticated

       :type: xxx
       :required:

       xxx


    .. attribute:: dataAcl

       :type: xxx
       :required:

       xxx


    .. attribute:: description

       :type: string
       :required:

       xxx


    .. attribute:: endpoints

       :type: xxx
       :required:

       xxx


    .. attribute:: noDocument

       :type: boolean
       :default: undefined

       xxx


    .. attribute:: parameters

       :type: xxx
       :required:

       xxx


    .. attribute:: parent

       :type: xxx
       :required:

       xxx


    .. attribute:: path

       :type: string
       :required:

       xxx


    .. attribute:: sanitizeMode

       :type: string
       :default: ``strict``

       sanitizeModexxx


    .. attribute:: sanitizesOutput

       :type: boolean
       :default: undefined

       xxx


    .. attribute:: service

       :type: :class:`~carbond.Service`
       :required:

       xxx


    .. attribute:: validateOutput

       :type: boolean
       :default: ``true``

       xxx


Methods
-------

.. class:: carbond.Endpoint
    :noindex:
    :hidden:

    .. function:: getOperation(method)

        :param method: xxx
        :type method: function
        :rtype: xxx

        getOperation method description

    .. function:: getService()

        :rtype: :class:`~carbond.Service`

        getService descroption

    .. function:: isOperationAuthorized(method, user, req)

        :param method: xxx
        :type method: function
        :param user: xxx
        :type user: xxx
        :param req: xxx
        :type req: xxx
        :rtype: boolean

        isOperationAuthorized description

    .. function:: operations()

        :rtype: xxx

        operations method description

    .. function:: options(req, res)

        :param req: xxx
        :type req: xxx
        :param res: xxx
        :type res: xxx
        :rtype: undefined

        options description

    .. function:: supportedMethods()

        :rtype: xxx

        supportedMethods description
