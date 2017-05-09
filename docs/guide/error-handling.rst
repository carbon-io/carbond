==============
Error handling
==============

.. toctree::

To report errors back to a client of your :js:class:`~carbond.Service`, simply
throw an instance of the appropriate :js:class:`~httperrors.HttpError` subclass.

For example, the following will produce an HTTP ``400`` error (Bad Request) if
no request body is present when posting to either the ``/hello`` or ``/goodbye``
endpoints:

.. literalinclude:: ../code-frags/standalone-examples/ServiceErrorHandlingExample.js
    :language: javascript
    :linenos:
    :emphasize-lines: 14, 23

Note, all HTTP errors can be referenced via the ``HttpErrors`` property of the
``carbon-io`` module or via the :js:attr:`~carbond.Service.errors` property of
your :js:attr:`~carbond.Service` definition.

**Supported HTTP errors**

* ``400``: BadRequest
* ``401``: Unauthorized
* ``402``: PaymentRequired
* ``403``: Forbidden
* ``404``: NotFound
* ``405``: MethodNotAllowed
* ``406``: NotAcceptable
* ``407``: ProxyAuthenticationRequired
* ``408``: RequestTimeout
* ``409``: Conflict
* ``410``: Gone
* ``411``: LengthRequired
* ``412``: PreconditionFailed
* ``413``: RequestEntityTooLarge
* ``414``: RequestURITooLarge
* ``415``: UnsupportedMediaType
* ``416``: RequestedRangenotSatisfiable
* ``417``: ExpectationFailed
* ``418``: ImATeapot
* ``421``: MisdirectedRequest
* ``422``: UnprocessableEntity
* ``423``: Locked
* ``424``: FailedDependency
* ``426``: UpgradeRequired
* ``428``: PreconditionRequired
* ``429``: TooManyRequests
* ``431``: RequestHeaderFieldsTooLarge
* ``500``: InternalServerError
* ``501``: NotImplemented
* ``502``: BadGateway
* ``503``: ServiceUnavailable
* ``504``: GatewayTimeOut
* ``505``: HTTPVersionNotSupported
* ``506``: VariantAlsoNegotiates
* ``507``: InsufficientStorage
* ``508``: LoopDetected
* ``510``: NotExtended
* ``511``: NetworkAuthenticationRequired

.. todo:: add section documenting ``errorHandlingMiddleware``
