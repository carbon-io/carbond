========================================
carbond.limiter.StaticKeyLimiterSelector
========================================

:js:class:`~carbond.limiter.StaticKeyLimiterSelector` is used to group 
incoming requests by a static key (essentially grouping all requests 
into the same bucket).

Class
-----

.. js:class:: carbond.limiter.StaticKeyLimiterSelector

    .. js:attribute:: staticKey

        :type: :js:class:`String`
        :default: "*"

        The static key used to group incoming requests.

    .. js:attribute:: hash

        :type: :js:class:`String`

        ``hash`` evaluates to :js:attr:`~.staticKey`.

    .. js:function:: key(req)

        :param req: the current request
        :type req: :js:class:`~express.request`
        :return: the key used to group the current request or ``undefined`` if
                 the key could not be generated
        :rtype: :js:class:`String`

        This simply returns :js:attr:`~.staticKey`.


Example
-------

.. .. literalinclude:: <path>
..     :language: js
..     :linenos:

