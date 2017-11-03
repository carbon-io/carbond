.. class:: carbond.Endpoint
    :heading:

.. |br| raw:: html

   <br />

================
carbond.Endpoint
================

The Endpoint class is a core abstraction in carbond which models an API as a tree of Endpoint instances, each of which is responsible for defining how to handle a given request to a particular URI

Properties
----------

.. class:: carbond.Endpoint
    :noindex:
    :hidden:

    .. attribute:: carbond.Endpoint.ALL_METHODS

       :type: object
       :required:

       A list of all HTTP methods recognized by carbond


    .. attribute:: carbond.Endpoint.allowUnauthenticated

       :type: string[]
       :required:

       Skip authentication for the HTTP methods listed on this endpoint


    .. attribute:: carbond.Endpoint.description

       :type: string
       :default: undefined

       A brief description of what this endpoint does. This will be displayed in any generated documentation.


    .. attribute:: carbond.Endpoint.endpoints

       :type: Object.<string, carbond.Endpoint>
       :required:

       The endpoints that sit below this endpoint in the tree. URL paths to each endpoint are built during a depth first traversal of the tree on initialization using the property names defined on this Object.


    .. attribute:: carbond.Endpoint.noDocument

       :type: boolean
       :default: false

       Controls whether documentation for this endpoint is included in generated static documentation


    .. attribute:: carbond.Endpoint.parameters

       :type: Object.<string, carbond.OperationParameter>
       :required:

       Operation parameter definitions that apply to all operations supported by this endpoint. Note, these will be merged with any parameter definitions on the operations themselves and their parsed values will be passed to the handler via ``req.parameters[<parameter name>]``.


    .. attribute:: carbond.Endpoint.parent

       :type: :class:`~carbond.Endpoint`
       :ro:

       The parent endpoint for this endpoint in the endpoint tree


    .. attribute:: carbond.Endpoint.path

       :type: string
       :ro:

       The URI path that routes to this endpoint. This is built during service initialization and will overwrite any value specified on instantiation.


    .. attribute:: carbond.Endpoint.service

       :type: :class:`~carbond.Service`
       :ro:

       The root service object managing the endpoint tree. Getting a reference to this object is sometimes necessary or just convenient (i.e., HTTP error classes can be accessed via :attr:`~carbond.Service.errors`).


    .. attribute:: carbond.Endpoint.validateOutput

       :type: boolean
       :default: ``true``

       Controls whether or not response bodies are validated using the response :class:`~carbond.OperationResponse.schema` corresponding to the current response code


Methods
-------

.. class:: carbond.Endpoint
    :noindex:
    :hidden:

    .. function:: carbond.Endpoint.getOperation(method)

        :param method: The HTTP method corresponding to the operation to retrieve
        :type method: string
        :rtype: :class:`~carbond.Operation`

        Retrieves the operation instance corresponding to the passed HTTP method

    .. function:: carbond.Endpoint.getService()

        :rtype: :class:`~carbond.Service`

        Returns the root :class:`~carbond.Service` instance (note, this is preferred over accessing the ``service`` property itself)

    .. function:: carbond.Endpoint.isOperationAuthorized(method, user, req)

        :param method: The HTTP method corresponding to the operation that we are attempting to authorize
        :type method: string
        :param user: The user object
        :type user: Object
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :rtype: boolean

        Tests whether an operation is authorized given a user (as returned by the root authenticator) and any :class:`~carbond.security.Acl` that may apply to this endpoint

    .. function:: carbond.Endpoint.operations()

        :rtype: :class:`~carbond.Operation[]`

        Gathers all operations defined on this endpoint

    .. function:: carbond.Endpoint.options(req, res)

        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: undefined

        Implements the OPTIONS method handler

    .. function:: carbond.Endpoint.supportedMethods()

        :rtype: string[]

        Returns a list of HTTP methods supported by this endpoint
