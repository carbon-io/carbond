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

    .. attribute:: ALL_METHODS

       :type: object
       :required:

       A list of all HTTP methods recognized by carbond


    .. attribute:: allowUnauthenticated

       :type: string[]
       :required:

       Skip authentication for the HTTP methods listed on this endpoint


    .. attribute:: description

       :type: string
       :default: undefined

       A brief description of what this endpoint does. This will be displayed in any generated documentation.


    .. attribute:: endpoints

       :type: :class:`~Object.<string, carbond.Endpoint>`
       :required:

       The endpoints that sit below this endpoint in the tree. URL paths to each endpoint are built during a depth first traversal of the tree on initialization using the property names defined on this Object.


    .. attribute:: noDocument

       :type: boolean
       :default: undefined

       Controls whether documentation for this endpoint is included in generated static documentation


    .. attribute:: parameters

       :type: :class:`~Object.<string, carbond.OperationParameter>`
       :required:

       Operation parameter definitions that apply to all operations supported by this endpoint. Note, these will be merged with any parameter definitions on the operations themselves and their parsed values will be passed to the handler via ``req.parameters[<parameter name>]``.


    .. attribute:: parent

       :type: :class:`~carbond.Endpoint`
       :required:
       :ro:

       The parent endpoint for this endpoint in the endpoint tree


    .. attribute:: path

       :type: string
       :required:
       :ro:

       The URI path that routes to this endpoint. This is built during service initialization and will overwrite any value specified on instantiation.


    .. attribute:: service

       :type: :class:`~carbond.Service`
       :required:
       :ro:

       The root service object managing the endpoint tree. Getting a reference to this object is sometimes necessary or just convenient (i.e., HTTP error classes can be accessed via :attr:`~carbond.Service.errors`).


    .. attribute:: validateOutput

       :type: boolean
       :default: ``true``

       Controls whether or not response bodies are validated using the response :class:`~carbond.OperationResponse.schema` corresponding to the current response code


Methods
-------

.. class:: carbond.Endpoint
    :noindex:
    :hidden:

    .. function:: getOperation(method)

        :param method: The HTTP method corresponding to the operation to retrieve
        :type method: string
        :rtype: :class:`~carbond.Operation`

        Retrieves the operation instance corresponding to the passed HTTP method

    .. function:: getService()

        :rtype: :class:`~carbond.Service`

        Returns the root :class:`~carbond.Service` instance (note, this is preferred over accessing the ``service`` property itself)

    .. function:: isOperationAuthorized(method, user, req)

        :param method: The HTTP method corresponding to the operation that we are attempting to authorize
        :type method: string
        :param user: The user object
        :type user: Object
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :rtype: boolean

        Tests whether an operation is authorized given a user (as returned by the root authenticator) and any :class:`~carbond.security.Acl` that may apply to this endpoint

    .. function:: operations()

        :rtype: :class:`~carbond.Operation[]`

        Gathers all operations defined on this endpoint

    .. function:: options(req, res)

        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: undefined

        Implements the OPTIONS method handler

    .. function:: supportedMethods()

        :rtype: string[]

        Returns a list of HTTP methods supported by this endpoint
