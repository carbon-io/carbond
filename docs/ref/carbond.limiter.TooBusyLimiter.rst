.. class:: carbond.limiter.TooBusyLimiter
    :heading:

.. |br| raw:: html

   <br />

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

    .. ifconfig:: carbonio_env != 'prod'
        
         .. attribute:: carbond.limiter.TooBusyLimiter.absMaxOutstandingReqs

            .. csv-table::
                :class: details-table

                "absMaxOutstandingReqs", :class:`Integer`
                *Required*, ""
                "Description", "The absolute maximum number of outstanding requests."


    .. attribute:: carbond.limiter.TooBusyLimiter.useFiberPoolSize

        .. csv-table::
            :class: details-table

            "useFiberPoolSize", :class:`Boolean`
            *Required*, ""
            "Description", "Use Fiber's pool size to set absMaxOutstandingReqs."

    
    .. attribute:: carbond.limiter.TooBusyLimiter.fiberPoolAllowedOverflow

        .. csv-table::
            :class: details-table

            "fiberPoolAllowedOverflow", :class:`Number`
            *Required*, ""
            "Description", "Allow for more requests than ``Fiber.poolSize`` if limiting on ``Fiber.poolSize`` (i.e, ``absMaxOutstandingReqs == fiberPoolOverflow * Fiber.poolSize + Fiber.poolSize``). **Note**\, this only applies if :attr:`~carbond.limiter.TooBusyLimiter.useFiberPoolSize` is ``true``."


    .. attribute:: carbond.limiter.TooBusyLimiter.toobusyMaxLag

        .. csv-table::
            :class: details-table

            "toobusyMaxLag", :class:`Integer`
            "Default", ``70``
            "Description", "The number of milliseconds Node's event loop must lag to trigger rate limiting of future requests."
        

    .. attribute:: carbond.limiter.TooBusyLimiter.toobusyInterval

        .. csv-table::
            :class: details-table

            "toobusyInterval", :class:`Integer`
            "Default", ``500``
            "Description", "The interval at which Node's event loop lag will be tested."
        

    .. attribute:: carbond.limiter.TooBusyLimiter.maxOutstandingReqs

        .. csv-table::
            :class: details-table

            "maxOutstandingReqs", :class:`Integer` *(read-only)*
            "Description", "The current allowed number of outstanding requests."
        

    .. attribute:: carbond.limiter.TooBusyLimiter.outstandingReqs
    
        .. csv-table::
            :class: details-table

            "outstandingReqs", :class:`Integer` *(read-only)*
            "Description", "The current number of outstanding requests."
        
        

Methods
-------

.. class:: carbond.limiter.TooBusyLimiter
    :noindex:
    :hidden:

    .. function:: carbond.limiter.TooBusyLimiter.fn

        .. csv-table::
            :class: details-table

            "fn (*req, res, next*)", "overrides :attr:`~carbond.limiter.FunctionLimiter`"
            "Arguments", "**req** (:class:`express.request`): The current `Request` object. |br|
            **res** (:class:`express.response`): The current `Response` object. |br|
            **next** (:class:`Function`): Continuation."
            "Returns", ":class:`Boolean`"
            "Description", "Evaluates whether the current request should be allowed based on how
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
            is passed to the next handler."


Example
-------

.. .. literalinclude:: <path>
..     :language: js
..     :linenos:


