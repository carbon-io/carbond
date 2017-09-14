.. class:: carbond.Operation
    :heading:

.. |br| raw:: html

   <br />

=================
carbond.Operation
=================

Operation class description

Properties
----------

.. class:: carbond.Operation
    :noindex:
    :hidden:

    .. attribute:: description

       :type: string
       :required:

       xxx


    .. attribute:: endpoint

       :type: :class:`~carbond.Endpoint`
       :required:

       xxx


    .. attribute:: limiter

       :type: xxx
       :required:

       xxx


    .. attribute:: name

       :type: string
       :required:

       xxx


    .. attribute:: parameters

       :type: xxx
       :required:

       xxx


    .. attribute:: responses

       :type: object
       :required:

       xxx


    .. attribute:: validateOutput

       :type: boolean
       :default: ``true``

       xxx


Methods
-------

.. class:: carbond.Operation
    :noindex:
    :hidden:

    .. function:: getAllParameters()

        :rtype: xxx

        Gets all parameters defined for this :class:`~carbond.Operation` which includes all parameters inherited from this.endpoint

    .. function:: getSanitizedURL(req)

        :param req: the current request
        :type req: :class:`~http.ClientRequest`
        :rtype: string

        undefined

    .. function:: getService()

        :rtype: :class:`~carbond.Service`

        getService description

    .. function:: service(req, res)

        :param req: xxx
        :type req: xxx
        :param res: xxx
        :type res: xxx
        :rtype: undefined

        service
