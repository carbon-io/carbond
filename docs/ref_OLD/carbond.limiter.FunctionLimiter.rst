===============================
carbond.limiter.FunctionLimiter
===============================

:js:class:`~carbond.limiter.FunctionLimiter` is the most basic limiter class.
Simply define :js:attr:`~carbond.limiter.FunctionLimiter.fn` and return
``true`` to allow further processing of the request and ``false`` to end 
processing. 

**NOTE**: :js:attr:`~carbond.limiter.FunctionLimiter.fn` is responsible
for ending the request-response cycle if processing is to stop. This can be
accomplished by calling :js:func:`express.request.end` (explicitly or
implicitly via ``send``, ``render``, or ``json``) or by using the helper method
:js:func:`~carbond.limiter.Limiter.sendUnavailable`.

Class
-----

.. js:class:: carbond.limiter.FunctionLimiter

    *extends*: :js:class:`~carbond.limiter.Limiter`

    .. js:attribute:: fn

       :type: :js:class:`Function`

       This function should either take the arguments ``(req, res)`` or 
       ``(req, res, next)``. **Note** that these are the same arguments passed
       to a standard express middleware function. If ``next`` is present in the
       argument list, ``fn`` will be responsible for calling next. Otherwise,
       the ``fn`` should return ``true`` to indicate that processing should
       continue or ``false`` to stop processing. In either case, ``fn`` is
       responsible for ending the request-response cycle if processing is to
       stop.

    .. js:function:: process(req, res, next) 

       :param req: the current ``Request`` object
       :type req: :js:class:`express.request`
       :param res: the current ``Response`` object
       :type res: :js:class:`express.response`
       :param next: continuation
       :type next: :js:class:`Function`

       This wraps ``fn``, catches any errors it may throw, and calls ``next`` if
       appropriate.

Example
-------

.. .. literalinclude:: <path>
..     :language: js
..     :linenos:

