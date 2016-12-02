=============================
carbond.limiter.LimiterPolicy
=============================

:js:class:`~carbond.limiter.LimiterPolicy` is used to define some policy over
requests to a particular endpoint based on some key representing a request
(e.g., as extracted by an accompanying instance of
:js:class:`~carbond.limiter.LimiterSelector`) and some historical context.

Class
-----

.. js:class:: carbond.limiter.LimiterPolicy

    *abstract*

    .. js:attribute:: sharedState

        :type: :js:class:`Boolean`
        :required: ``false``
        :default: ``false``

        If ``true``, :js:attr:`~state` will be shared with any other
        :js:class:`~carbond.limiter.PolicyLimiter` that also indicates it wants
        to share state.

    .. js:attribute:: limiter

        :type: :js:class:`~carbond.limiter.Limiter`
        :required: ``true``

        The :js:class:`~carbond.limiter.Limiter` instance using this policy.

    .. js:attribute:: node

        :type: :js:class:`~carbond.Endpoint`
        :required: ``true``

        The :js:class:`~carbond.Endpoint` this the :js:attr:`~limiter` instance 
        is attached to.

    .. js:attribute:: stateKey

        :type: :js:class:`String`

        This is a *read-only* attribute used to lookup the state object for a
        :js:class:`LimiterPolicy` instance.

    .. js:attribute:: state

        :type: :js:class:`carbond.limiter.LimiterPolicyState`

        This is a *read-only* attribute that holding a pointer to the state 
        object associated with this policy.

    .. js:function:: initializeState(state)
        
        :param state: a shared ``LimiterPolicyState`` instance or ``undefined``
        :type service: :js:class:`~carbond.limiter.LimiterPolicyState`
       
        Called on initialization. Sets and/or gets the policy state.

    .. js:function:: allow(req, res, selector) 

        *abstract*

        :param req: the current ``Request`` object
        :type req: :js:class:`express.request`
        :param res: the current ``Response`` object
        :type res: :js:class:`express.response`
        :param selector: A string used to group similar requests
        :type selector: :js:class:`String`
        :return: ``true`` if the policy allows the request, else ``false``
        :rtype: :js:class:`Boolean`

        This method should be overridden to evaluate the current request as
        identified by ``selector`` in the context of :js:attr:`state` and decide
        whether or not it should be allowed.

Example
-------

.. .. literalinclude:: <path>
..     :language: js
..     :linenos:

