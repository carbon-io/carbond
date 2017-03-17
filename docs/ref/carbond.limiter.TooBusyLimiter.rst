.. class:: carbond.limiter.TooBusyLimiter
    :heading:

==============================
carbond.limiter.TooBusyLimiter
==============================
*extends* :class:`~carbond.limiter.FunctionLimiter`

:class:`~carbond.limiter.TooBusyLimiter` limits connections based on how busy
the process is.

Properties
----------

.. class:: carbond.limiter.TooBusyLimiter
    :noindex:
    :hidden:

    .. attribute:: carbond.limiter.TooBusyLimiter.absMaxOutstandingReqs

        :type: :class:`int`
        :default: ``Infinity``

        The absolute maximum number of outstanding requests.

    .. attribute:: carbond.limiter.TooBusyLimiter.useFiberPoolSize

        :type: :class:`bool`
        :default: ``false``

        Use Fiber's pool size to set absMaxOutstandingReqs
    
    .. attribute:: carbond.limiter.TooBusyLimiter.fiberPoolAllowedOverflow

        :type: :class:`Number`
        :default: 0

        Allow for more requests than ``Fiber.poolSize`` if limiting on 
        ``Fiber.poolSize`` (i.e,
        ``absMaxOutstandingReqs == fiberPoolOverflow * Fiber.poolSize + Fiber.poolSize``).
        **Note**, this only applies if :attr:`~carbond.limiter.TooBusyLimiter.useFiberPoolSize` is
        ``true``.

    .. attribute:: carbond.limiter.TooBusyLimiter.toobusyMaxLag

        :type: :class:`Integer`
        :default: 70

        The number of milliseconds Node's event loop must lag to trigger rate
        limiting of future requests.

    .. attribute:: carbond.limiter.TooBusyLimiter.toobusyInterval

        :type: :class:`Integer`
        :default: 500

        The interval at which Node's event loop lag will be tested.

    .. attribute:: carbond.limiter.TooBusyLimiter.maxOutstandingReqs

        :type: :class:`Integer`
        
        The current allowed number of outstanding requests (*read-only*).

    .. attribute:: carbond.limiter.TooBusyLimiter.outstandingReqs

        :type: :class:`Integer`
        
        The current number of outstanding requests (*read-only*).

Methods
-------

.. class:: carbond.limiter.TooBusyLimiter
    :noindex:
    :hidden:

    .. function:: carbond.limiter.TooBusyLimiter.fn

        Overrides :attr:`~carbond.limiter.FunctionLimiter`

        :param req: the current ``Request`` object
        :type req: :class:`express.request`
        :param res: the current ``Response`` object
        :type res: :class:`express.response`
        :param next: continuation
        :type next: :class:`Function`
        
        Evaluates whether the current request should be allowed based on how
        busy the server process is. 
        
        Each time this method is invoked, it will check if the event loop 
        appears to be lagging and if the number of outstanding requests is 
        greater than ``Fiber`` 's current pool size. A warning will be logged 
        if the former is ``true`` and a debug message will be logged if the 
        latter is ``true``.

        If the current number of outstanding requests is greater than
        :attr:`~carbond.limiter.TooBusyLimiter.maxOutstandingReqs` or the event loop appears to be lagging
        too far behind, the request will be rejected and a ``503`` will be sent
        to the client. If the event loop is lagging,
        :attr:`~carbond.limiter.TooBusyLimiter.maxOutstandingRequests` will be updated to reflect the
        current number of outstanding requests.

        If the request is allowed and :attr:`~carbond.limiter.TooBusyLimiter.maxOutstandingReqs` is less
        than :attr:`~carbond.limiter.TooBusyLimiter.absMaxOutstandingReqs`, :attr:`~carbond.limiter.TooBusyLimiter.maxOutstandingReqs`
        will increase exponentially with each additional request up to
        :attr:`~carbond.limiter.TooBusyLimiter.absMaxOutstandingReqs`. 

        Finally, :attr:`~carbond.limiter.TooBusyLimiter.outstandingReqs` is incremented, a callback is
        registered do decrement the counter on request completion, and control
        is passed to the next handler.

Example
-------

.. .. literalinclude:: <path>
..     :language: js
..     :linenos:


