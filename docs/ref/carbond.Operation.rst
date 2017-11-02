.. class:: carbond.Operation
    :heading:

.. |br| raw:: html

   <br />

=================
carbond.Operation
=================

Handles HTTP requests for a specific method (e.g., "GET") to a specific :class:`~carbond.Endpoint` by assigning to a property on the endpoint that corresponds to that HTTP method (e.g. :class:`~carbond.Endpoint.get`). This can be instantiated explicitly in the context of an :class:`~carbond.Endpoint` or implicitly if just a handler method is provided. In the latter case, the operation object will be built and instantiated for you.

Properties
----------

.. class:: carbond.Operation
    :noindex:
    :hidden:

    .. attribute:: carbond.Operation.description

       :type: string
       :default: undefined

       A brief description of what this operation does. This will be displayed in any generated documentation.


    .. attribute:: endpoint

       :type: :class:`~carbond.Endpoint`
       :required:

       xxx


    .. attribute:: name

       :type: string
       :required:
       :ro:

       The operation name (i.e., HTTP method)


    .. attribute:: parameters

       :type: Object.<string, carbond.OperationParameter>
       :default: ``{}``

       Any parameters that are specific to this operation (as opposed to those defined on the parent endpoint)


    .. attribute:: responses

       :type: Object.<string, carbond.OperationResponse>
       :default: ``{}``

       Response definitions for this operation. These will be used for validation purposes as well as generated static documentation.


    .. attribute:: validateOutput

       :type: boolean
       :default: ``true``

       Flag determining whether responses are validated using the definitions in :class:`~carbond.Operation.responses`


Methods
-------

.. class:: carbond.Operation
    :noindex:
    :hidden:

    .. function:: getAllParameters()

        :rtype: Object.<string, carbond.OperationParameter>

        Gets all parameters defined for this :class:`~carbond.Operation` which includes all parameters inherited from this.endpoint

    .. function:: getSanitizedURL(req)

        :param req: the current request
        :type req: http.ClientRequest
        :rtype: string

        Returns a new URL with the query string portion removed

    .. function:: getService()

        :rtype: :class:`~carbond.Service`

        Returns the root :class:`~carbond.Service` instance

    .. function:: service(req, res)

        :param req: The current request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :throws: :class:`~httperrors.HttpError` 
        :rtype: Object | null | undefined

        Handles incoming requests, generating the appropriate response. Responses can be sent by the handler itself or this can be delegated to the service. If an object is returned, it will be serialized (and validated if configured to do so) and sent as the body of the response. If ``null`` is returned, it will end the response. If ``undefined`` is returned, it will be the responsibility of the handler to end the response. If the response status code is something other than ``204``, it should be set by the handler. Additionally, custom headers should be set on the response object before returning. To respond with an error (status code > 400), an instance of :class:`~httperrors.HttpError` can be thrown.
