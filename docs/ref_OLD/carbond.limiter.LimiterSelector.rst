===============================
carbond.limiter.LimiterSelector
===============================

:js:class:`~carbond.limiter.LimiterSelector` is used to group incoming requests.
Each new incoming request will then be evaluated against a
:js:class:`~carbond.limiter.LimiterPolicy` in the context of its group.

Class
-----

.. js:class:: carbond.limiter.LimiterSelector

    *abstract*

    .. js:attribute:: hash

        *abstract*
        
        :type: :js:class:`String`

        A key used to bucket similar instances of :js:class:`~.LimiterSelector`.

    .. js:function:: key(req)

        *abstract*
        
        :param req: the current request
        :type req: :js:class:`~express.request`
        :return: the key used to group the current request or ``undefined`` if
                 the key could not be generated
        :rtype: :js:class:`String`

        This function takes a request and returns a key that can be used to
        group the request in order to apply a :js:class:`LimiterPolicy` to the
        request in the appropriate context.


Example
-------

.. .. literalinclude:: <path>
..     :language: js
..     :linenos:


