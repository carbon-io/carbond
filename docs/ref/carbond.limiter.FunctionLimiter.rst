====================================
carbond.limiter.Limiter.ChainLimiter
====================================

:js:class:`~carbond.limiter.Limiter.FunctionLimiter` is the most basic limiter
class. Simply subclass the 

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

