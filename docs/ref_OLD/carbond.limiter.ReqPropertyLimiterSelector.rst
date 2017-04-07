==========================================
carbond.limiter.ReqPropertyLimiterSelector
==========================================

:js:class:`~carbond.limiter.ReqPropertyLimiterSelector` is used to group 
incoming requests by an arbitrary property on those requests (e.g., ``req.ip``).

Class
-----

.. js:class:: carbond.limiter.LimiterSelector

    .. js:attribute:: propertyPath
        
        :type: :js:class:`String`
        :required: ``true``

        A string representing a property to be resolved as the selector for an
        incoming request (e.g. "``req.user.username``").

    .. js:attribute:: transform
        
        :type: :js:class:`Function`
        :required: ``false``

        If this is specified, any property resolved by :js:attr:`~.propertyPath`
        will be passed through ``transform`` to generate the appropriate key
        (useful if the property being resolved is not a :js:class:`String`).

    .. js:attribute:: hash

        :type: :js:class:`String`

        ``hash`` evaluates to :js:attr:`~.propertyPath`.

    .. js:function:: key(req)

        :param req: the current request
        :type req: :js:class:`~express.request`
        :return: the key used to group the current request or ``undefined`` if
                 the key could not be generated
        :rtype: :js:class:`String`

        This resolves the property to be used on ``req`` using
        :js:attr:`~.propertyPath` and, if found, passes it through
        :js:attr:`~.transform` if appropriate before returning it.

Example
-------

.. .. literalinclude:: <path>
..     :language: js
..     :linenos:



