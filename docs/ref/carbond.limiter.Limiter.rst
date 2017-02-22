.. class:: carbond.limiter.Limiter
    :heading:

=======================
carbond.limiter.Limiter
=======================

:class:`~carbond.limiter.Limiter` is an abstract base class that all other
limiters must extend. Generally, you will want to use
:class:`~carbond.limiter.FunctionLimiter` or
:class:`~carbond.limiter.PolicyLimiter` to implement a custom limiter.
However, if neither of these suites your needs, you can define your own limiter
class by extending this.

XXX - EXAMPLES:

Link to TooBusyLimiter class: :class:`~carbond.limiter.TooBusyLimiter`

Link to TooBusyLimiter class with full class name: :class:`carbond.limiter.TooBusyLimiter`

Link to TooBusyLimiter.absMaxOutstandingReqs: :attr:`~carbond.limiter.TooBusyLimiter.absMaxOutstandingReqs`

Link to TooBusyLimiter.absMaxOutstandingReqs with full attribute name: :attr:`carbond.limiter.TooBusyLimiter.absMaxOutstandingReqs`

Link to TooBusyLimiter.fn: :func:`~carbond.limiter.TooBusyLimiter.fn`


Class
-----

.. class:: carbond.limiter.Limiter
    
    *abstract*

    .. attribute:: carbond.limiter.Limiter.service

        :type: :class:`~carbond.Service`
        :required: ``true``

        The root service instance.

    .. attribute:: carbond.limiter.Limiter.node

        :type: :class:`~carbond.Endpoint`
        :required: ``true``

        The endpoint instance that this limiter is protecting (**NOTE**, this can
        be the same as :attr:`~carbond.limiter.Limiter.service`).

    .. attribute:: carbond.limiter.Limiter.preAuth

        :type: :class:`Boolean`
        :required: ``false``
        :default: ``false``

        Determines whether this limiter is invoked before or after authentication.
        (**NOTE**: if you are using
        :class:`~carbond.limiter.ReqPropertyLimiterSelector` and you want to
        check user info, you will want to

Methods
-------

.. class:: carbond.limiter.Limiter
    :noindex:
    :hidden:

    .. function:: carbond.limiter.Limiter.initialize(service, node)

        :param service: the root ``Service`` instance
        :type service: :class:`~carbond.Service`
        :param node: the ``Endpoint`` that we are attached to
        :type node: :class:`carbond.Endpoint`

        Called on service initialization. Sets the ``service`` and ``node``
        attributes.

    .. function:: carbond.limiter.Limiter.process(req, res, next)

        *abstract*
       
        :param req: the current ``Request`` object
        :type req: :class:`express.request`
        :param res: the current ``Response`` object
        :type res: :class:`express.response`
        :param next: continuation
        :type next: :class:`Function`
        
        Subclasses must override this method and ensure that the
        request-response cycle is ended or ``next`` is called (with or without an
        error).

    .. function:: carbond.limiter.Limiter.sendUnavailable(res, [message=undefined], [retryAfter=60]])

        :param res: the current ``Response`` object
        :type res: :class:`express.response`
        :param message: any other message you want to bubble up to the client
        :type message: :class:`String`
        :param retryAfter: hint to the client as to when to retry the request
                           (in seconds)
        :type retryAfter: :class:`Integer`
        
        Sends a ``503`` back to the client. 
        
        *TODO*: ``429`` s should also be supported.
        

Example
-------

.. .. literalinclude:: <path>
..     :language: js
..     :linenos:

