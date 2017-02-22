.. js:class:: TooBusyLimiter()
    :heading:

==============================
carbond.limiter.TooBusyLimiter
==============================

:js:class:`~carbond.limiter.TooBusyLimiter` limits connections based on how busy
the process is.

Class
-----

.. js:class:: carbond.limiter.TooBusyLimiter

    *extends*: :js:class:`~carbond.limiter.FunctionLimiter`

Properties
----------

.. js:class:: Collection()
    :noindex:
    :hidden:

    .. js:attribute:: absMaxOutstandingReqs

        :type: :js:class:`int`
        :default: ``Infinity``

        The absolute maximum number of outstanding requests.

    .. js:attribute:: useFiberPoolSize

        :type: :js:class:`bool`
        :default: ``false``

        Use Fiber's pool size to set absMaxOutstandingReqs
    
    .. js:attribute:: fiberPoolAllowedOverflow

        :type: :js:class:`Number`
        :default: 0

        Allow for more requests than ``Fiber.poolSize`` if limiting on 
        ``Fiber.poolSize`` (i.e,
        ``absMaxOutstandingReqs == fiberPoolOverflow * Fiber.poolSize + Fiber.poolSize``).
        **Note**, this only applies if :js:attr:`~.useFiberPoolSize` is
        ``true``.

    .. js:attribute:: toobusyMaxLag

        :type: :js:class:`Integer`
        :default: 70

        The number of milliseconds Node's event loop must lag to trigger rate
        limiting of future requests.

    .. js:attribute:: toobusyInterval

        :type: :js:class:`Integer`
        :default: 500

        The interval at which Node's event loop lag will be tested.

    .. js:attribute:: maxOutstandingReqs

        :type: :js:class:`Integer`
        
        The current allowed number of outstanding requests (*read-only*).

    .. js:attribute:: outstandingReqs

        :type: :js:class:`Integer`
        
        The current number of outstanding requests (*read-only*).

Methods
-------

.. js:class:: Collection()
    :noindex:
    :hidden:

    .. js:function:: fn

        Overrides :js:attr:`~carbond.limiter.FunctionLimiter`

        :param req: the current ``Request`` object
        :type req: :js:class:`express.request`
        :param res: the current ``Response`` object
        :type res: :js:class:`express.response`
        :param next: continuation
        :type next: :js:class:`Function`
        
        Evaluates whether the current request should be allowed based on how
        busy the server process is. 
        
        Each time this method is invoked, it will check if the event loop 
        appears to be lagging and if the number of outstanding requests is 
        greater than ``Fiber`` 's current pool size. A warning will be logged 
        if the former is ``true`` and a debug message will be logged if the 
        latter is ``true``.

        If the current number of outstanding requests is greater than
        :js:attr:`~.maxOutstandingReqs` or the event loop appears to be lagging
        too far behind, the request will be rejected and a ``503`` will be sent
        to the client. If the event loop is lagging,
        :js:attr:`~.maxOutstandingRequests` will be updated to reflect the
        current number of outstanding requests.

        If the request is allowed and :js:attr:`~.maxOutstandingReqs` is less
        than :js:attr:`~.absMaxOutstandingReqs`, :js:attr:`~.maxOutstandingReqs`
        will increase exponentially with each additional request up to
        :js:attr:`~.absMaxOutstandingReqs`. 

        Finally, :js:attr:`~.outstandingReqs` is incremented, a callback is
        registered do decrement the counter on request completion, and control
        is passed to the next handler.

Example
-------

.. .. literalinclude:: <path>
..     :language: js
..     :linenos:


