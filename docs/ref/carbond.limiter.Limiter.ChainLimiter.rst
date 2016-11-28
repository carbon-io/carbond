====================================
carbond.limiter.Limiter.ChainLimiter
====================================

:js:class:`~carbond.limiter.Limiter.ChainLimiter` should be used to insert
multiple limiters at a given point in the :js:class:`~carbond.Endpoint.Endpoint`
tree. A request will be evaluated by each limiter in the chain in order with
evaluation stopping at the first limiter that rejects the request.

Class
-----

.. js:class:: carbond.limiter.Limiter.ChainLimiter

    *extends*: :js:class:`~carbond.limiter.Limiter.Limiter`

    .. js:attribute:: limiters

       :type: :js:class:`Array`

       An :js:class:`Array` of :js:class:`~carbond.limiter.Limiter.Limiter`
       instances.


    .. js:function:: initialize(service, node)
        
       :param service: the root ``Service`` instance
       :type service: :js:class:`~carbond.Service.Service`
       :param node: the ``Endpoint`` that we are attached to
       :type node: :js:class:`carbond.Endpoint.Endpoint`
       
       Called on service initialization. Cascades initialization to all limiters
       managed by this instance.

    .. js:function:: process(req, res, next) 

       :param req: the current ``Request`` object
       :type req: :js:class:`express.request`
       :param res: the current ``Response`` object
       :type res: :js:class:`express.response`
       :param next: continuation
       :type next: :js:class:`Function`

Example
-------

.. .. literalinclude:: <path>
..     :language: js
..     :linenos:

