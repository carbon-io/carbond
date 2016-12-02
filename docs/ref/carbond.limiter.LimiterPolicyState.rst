==================================
carbond.limiter.LimiterPolicyState
==================================

:js:class:`~carbond.limiter.LimiterPolicyState` is used by
:js:class:`~carbond.limiter.LimterPolicy` to track request history. It may be
shared by multiple :js:class:`~carbond.limiter.LimterPolicy` instances if 
:js:attribute:`~carbond.limiter.LimterPolicy.sharedState` is ``true``.

Class
-----

.. js:class:: carbond.limiter.LimiterPolicyState

    .. js:function:: visit(req, selector[, timestamp])
        
         :param req: the current ``Request`` object
         :type req: :js:class:`express.request`
         :param selector: the selector for the current request
         :type res: :js:class:`String`
         :param timestamp: the time at which the request was processed
                           (``Date.now()`` if ``undefined``)
         :type next: :js:class:`Integer`

         Add the current request for ``selector``.

       
    .. js:function:: visits(req, res, next) 
        
         :param service: the root ``Service`` instance
         :type service: :js:class:`~carbond.Service`
         :return: the number of visits for this selector
         :rtype: :js:class:`Integer`

         Get the current number of visits saved for ``selector``.

    .. js:function:: purge(predicate, selector)

        :param predicate: requests that satisfy ``predicate`` will be purged
        :type predicate: :js:class:`Integer` or :js:class:`Function`

        Purge all visits that satisfy ``predicate``. If ``predicate`` is an
        :js:class:`Integer`, then it will be assumed to be a timestamp and all
        visits that happened before ``predicate`` will be purged. If it is a
        :js:class:`Function`, that function should take a single argument and
        return ``true`` if satisfied and ``false`` otherwise. The single
        argument to :js:func:`~purge` will contain the metadata for an
        individual visit (currently, this is a timestamp, but other metadata may
        be included in subclasses of :js:class:`~.LimiterPolicy`).

    .. js:function:: reset()

        Resets the state for all selectors.


Example
-------

.. .. literalinclude:: <path>
..     :language: js
..     :linenos:

