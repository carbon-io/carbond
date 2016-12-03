===================================
carbond.limiter.WindowLimiterPolicy
===================================

:js:class:`~carbond.limiter.WindowLimiterPolicy` is a concrete implementation of
:js:class:`~carbond.limiter.LimiterPolicy` that limits the number of requests
allowed within a sliding window of time.

Class
-----

.. js:class:: carbond.limiter.WindowLimiterPolicy

    *extends*: :js:class:`~carbond.limiter.Limiter`

    .. js:attribute:: window

        :type: :js:class:`Integer`
        :default: 1000

        The sliding window in milliseconds.

    .. js:attribute:: reqLimit

        :type: :js:class:`Integer`
        :default: 1

        The number of requests allowed within ``window``.

    .. js:function:: allow(req, res, selector)
        
        :param req: the current ``Request`` object
        :type req: :js:class:`express.request`
        :param res: the current ``Response`` object
        :type res: :js:class:`express.response`
        :param selector: A string used to group similar requests
        :type selector: :js:class:`String`
        :return: ``true`` if the policy allows the request, else ``false``
        :rtype: :js:class:`Boolean`
       
        Overrides :js:func:`~carbond.limiter.LimiterPolicy.allow` to implement
        windowing logic.


Example
-------

.. .. literalinclude:: <path>
..     :language: js
..     :linenos:

