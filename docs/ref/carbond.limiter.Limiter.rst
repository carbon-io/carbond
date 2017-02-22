=======================
carbond.limiter.Limiter
=======================

:js:class:`~carbond.limiter.Limiter` is an abstract base class that all other
limiters must extend. Generally, you will want to use
:js:class:`~carbond.limiter.FunctionLimiter` or
:js:class:`~carbond.limiter.PolicyLimiter` to implement a custom limiter.
However, if neither of these suites your needs, you can define your own limiter
class by extending this.

XXX - EXAMPLES:

Link to TooBusyLimiter class: :js:class:`~carbond.limiter.TooBusyLimiter`

Link to TooBusyLimiter.absMaxOutstandingReqs: :attr:`~carbond.limiter.TooBusyLimiter.absMaxOutstandingReqs`

Link to TooBusyLimiter.fn: :func:`~carbond.limiter.TooBusyLimiter.fn`


Class
-----

.. js:class:: carbond.limiter.Limiter
    
    *abstract*

    .. js:attribute:: service

        :type: :js:class:`~carbond.Service`
        :required: ``true``

        The root service instance.

    .. js:attribute:: node

        :type: :js:class:`~carbond.Endpoint`
        :required: ``true``

        The endpoint instance that this limiter is protecting (**NOTE**, this can
        be the same as :js:attr:`~service`).

    .. js:attribute:: preAuth

        :type: :js:class:`Boolean`
        :required: ``false``
        :default: ``false``

        Determines whether this limiter is invoked before or after authentication.
        (**NOTE**: if you are using
        :js:class:`~carbond.limiter.ReqPropertyLimiterSelector` and you want to
        check user info, you will want to

    .. js:function:: initialize(service, node)

        :param service: the root ``Service`` instance
        :type service: :js:class:`~carbond.Service`
        :param node: the ``Endpoint`` that we are attached to
        :type node: :js:class:`carbond.Endpoint`

        Called on service initialization. Sets the ``service`` and ``node``
        attributes.

    .. js:function:: process(req, res, next)

        *abstract*
       
        :param req: the current ``Request`` object
        :type req: :js:class:`express.request`
        :param res: the current ``Response`` object
        :type res: :js:class:`express.response`
        :param next: continuation
        :type next: :js:class:`Function`
        
        Subclasses must override this method and ensure that the
        request-response cycle is ended or ``next`` is called (with or without an
        error).

    .. js:function:: sendUnavailable(res, [message=undefined], [retryAfter=60]])

        :param res: the current ``Response`` object
        :type res: :js:class:`express.response`
        :param message: any other message you want to bubble up to the client
        :type message: :js:class:`String`
        :param retryAfter: hint to the client as to when to retry the request
                           (in seconds)
        :type retryAfter: :js:class:`Integer`
        
        Sends a ``503`` back to the client. 
        
        *TODO*: ``429`` s should also be supported.
        

Example
-------

.. .. literalinclude:: <path>
..     :language: js
..     :linenos:

