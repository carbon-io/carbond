.. class:: carbond.Service
    :heading:

.. |br| raw:: html

   <br />

===============
carbond.Service
===============
*extends* :class:`~carbond.Endpoint`

Service is the main entry point to a carbond service

Static Properties
-----------------

.. class:: carbond.Service
    :noindex:
    :hidden:

    .. attribute:: ALL_METHODS

       :inheritedFrom: :class:`~carbond.Endpoint`
       :type: Object
       :required:

       A list of all HTTP methods recognized by carbond


Instance Properties
-------------------

.. class:: carbond.Service
    :noindex:
    :hidden:

    .. attribute:: adminRoot

       :type: string
       :default: ``'/service-admin'``

       The "administrative" root URL path component (this is only enabled if the "swagger" command line option is present)


    .. attribute:: allowUnauthenticated

       :inheritedFrom: :class:`~carbond.Endpoint`
       :type: string[]
       :required:

       Skip authentication for the HTTP methods listed on this endpoint


    .. attribute:: apiRoot

       :type: string
       :default: undefined

       The root component of the URL path component. This will be prepended to any routes that are yielded by the :class:`~carbond.Endpoint` tree.


    .. attribute:: authenticator

       :type: :class:`~carbond.security.Authenticator`
       :default: undefined

       The root authenticator. If present, all requests will be passed through the authenticator resulting in a 401 if authentication fails.


    .. attribute:: cluster

       :type: boolean
       :default: false

       Whether or not to use Node's ``cluster`` module


    .. attribute:: cmdargs

       :type: Object
       :default: ``{}``

       Additional command line argument definitions (will be merged into :class:`~carbond.Service.defaultCmdargs`)


    .. attribute:: corsEnabled

       :type: boolean
       :default: ``true``

       Flag determining whether CORS is enabled


    .. attribute:: db

       :type: Object
       :required:

       The connection object for :attr:`~carbond.Service.dbUri`


    .. attribute:: dbs

       :type: Object.<string, Object>
       :required:

       The connection objects for :attr:`~carbond.Service.dbUri`. The keys for this object will mirror those in :attr:`~carbond.Service.dbUri`, while the values will be the connection objects themselves.


    .. attribute:: dbUri

       :type: string
       :required:

       The database URI to connect to at startup (currently restricted to MongoDB)


    .. attribute:: dbUris

       :type: Object.<string, string>
       :required:

       Database URIs to connect to at startup (currently restricted to MongoDB)


    .. attribute:: defaultCmdargs

       :type: Object
       :default: ``{...}``

       The default command line arguments definition. :class:`~carbond.Service#cmdargs` can be used to extend the default set of command line arguments.


    .. attribute:: defaultDocgenOptions

       :type: Object
       :default: ``{...}``

       Default options for the "aglio" documentation generator

       .. csv-table::
          :class: details-table
          :header: "Name", "Type", "Default", "Description"
          :widths: 10, 10, 10, 10

          defaultDocgenOptions['github-flavored-markdown'], ``Object``, ````{}````, undefined
          defaultDocgenOptions['api-blueprint'], ``Object``, ````{}````, undefined
          defaultDocgenOptions['aglio'], ``Object``, ````{}````, undefined



    .. attribute:: description

       :type: string
       :default: ``'This is a Service'``

       A short description of this service


    .. attribute:: endpoints

       :type: Object
       :default: ``{}``

       The endpoint tree. Note, keys in the endpoint tree will be used to construct routes to the various :class:`~carbond.Operation`s servicing requests for an individual :class:`~carbond.Endpoint`.


    .. attribute:: env

       :type: string
       :required:

       carbond.DEFAULT_ENV}


    .. attribute:: errorHandlingMiddleware

       :type: function()[]
       :default: ``[]``

       Middleware that will be invoked in the event that an error is thrown. Error-handling middleware function signatures should conform to ``fn(err, req, res, next)``.


    .. attribute:: errors

       :type: Object
       :default: ``HttpErrors``

       A shortcut reference to the ``@carbon-io/http-errors`` module to be accessed using the service reference available throughout the ``carbond`` component hierarchy


    .. attribute:: fiberPoolSize

       :type: number
       :default: ``120``

       Sets the pool size for the underlying ``fibers`` module. Note, a new fiber will be created and destroyed for every fiber created beyond the pool size. If this occurs regularly, it can lead to significant performance degradation. While the default should usually suffice, this parameter should be tuned according to the expected number of concurrent requests.


    .. attribute:: generateOptionsMethodsInDocs

       :type: boolean
       :default: false

       Whether or not to include OPTIONS methods in static documentation


    .. attribute:: gracefulShutdown

       :type: boolean
       :default: ``true``

       Whether or not the service should gracefully shutdown when a stop is requested (i.e., whether or not open sockets should be allowed to timeout or severed immediately). The default for this is computed using :attr:`~carbond.DEFAULT_ENV` (e.g., ``DEFAULT_ENV === 'production'``).


    .. attribute:: hostname

       :type: string
       :default: ``'127.0.0.1'``

       The address that this service should listen on


    .. attribute:: logger

       :type: logging.Logger
       :default: ``{...}``

       The logger instance used by service log methods (e.g. undefined)


    .. attribute:: middleware

       :type: function()[]
       :default: ``[]``

       Middleware functions that will be executed via express before control is passed on to any :class:`~carbond.Operation`. Middleware function signatures should conform to ``fn(req, res, next)``.


    .. attribute:: noDocument

       :inheritedFrom: :class:`~carbond.Endpoint`
       :type: boolean
       :default: false

       Controls whether documentation for this endpoint is included in generated static documentation


    .. attribute:: numClusterWorkers

       :type: number
       :default: undefined

       The number of cluster workers to start. If left ``undefined`` or set to ``0``, it will be set to the number of CPUs present.


    .. attribute:: parameterParser

       :type: :class:`~carbond.ParameterParser`
       :default: ``o({_type: './ParameterParser'})``

       The parameter parser used to parse all incoming request parameters (i.e., query, header, body, and path). In most cases, the default parser should be sufficient.


    .. attribute:: parameters

       :inheritedFrom: :class:`~carbond.Endpoint`
       :type: Object.<string, carbond.OperationParameter>
       :required:

       Operation parameter definitions that apply to all operations supported by this endpoint. Note, these will be merged with any parameter definitions on the operations themselves and their parsed values will be passed to the handler via ``req.parameters[<parameter name>]``.


    .. attribute:: parent

       :inheritedFrom: :class:`~carbond.Endpoint`
       :type: :class:`~carbond.Endpoint`
       :ro:

       The parent endpoint for this endpoint in the endpoint tree


    .. attribute:: path

       :type: string
       :default: ``''``

       Since :class:`~carbond.Service` is itself an :class:`~carbond.Endpoint`, this can be used to set the URL path component that the service endpoint is accessible at


    .. attribute:: port

       :type: number
       :default: ``8888``

       The port that this service should bind


    .. attribute:: processUser

       :type: string
       :default: undefined

       If set, privileges will be dropped and the effective user for the process will be set to this


    .. attribute:: publicDirectories

       :type: Object.<string, string>
       :default: ``{}``

       Directories with static assets that should be exposed by the service. Keys are the URL paths under which these static assests should be served while values are the local filesystem paths at which the assets exist.


    .. attribute:: serverSocketTimeout

       :type: number
       :default: undefined

       The socket timeout for all incoming connections. Note, the system default is 2 minutes.


    .. attribute:: service

       :inheritedFrom: :class:`~carbond.Endpoint`
       :type: :class:`~carbond.Service`
       :ro:
       :deprecated:

       The root service object managing the endpoint tree. Getting a reference to this object is sometimes necessary or just convenient (i.e., HTTP error classes can be accessed via :attr:`~carbond.Service.errors`).


    .. attribute:: signalHandler

       :type: Object.<string, function()>
       :default: ``{...}``

       An object whose keys are signal names (e.g., "SIGINT") and whose values are functions invoked to handle the signal(s) corresponding to their aforementioned keys. Note, keys here can be a string of signal names delineated by spaces (e.g. "SIGINT SIGHUP"). In this case, the corresponding function will be called for any of the signals named in the key.


    .. attribute:: sslOptions

       :type: :class:`~carbond.SslOptions`
       :default: ``o({_type: './SslOptions'})``

       SSL options to use if running HTTPS


    .. attribute:: validateOutput

       :inheritedFrom: :class:`~carbond.Endpoint`
       :type: boolean
       :default: ``true``

       Controls whether or not response bodies are validated using the response :class:`~carbond.OperationResponse.schema` corresponding to the current response code


Abstract Methods
----------------

.. class:: carbond.Service
    :noindex:
    :hidden:

    .. function:: doStart(options)

        :param options: Parsed command line options
        :type options: Object
        :rtype: undefined

        Performs custom startup operations. This method will be called after initialization (e.g., database connections will be established and the endpoint tree will be built) but before the server's socket is bound. Override this method if your app requires further initialization.

    .. function:: doStop()

        :rtype: undefined

        Performs custom teardown operations. This method will be called first in the stop sequence.

Methods
-------

.. class:: carbond.Service
    :noindex:
    :hidden:

    .. function:: getOperation(method)

        :inheritedFrom: :class:`~carbond.Endpoint`
        :param method: The HTTP method corresponding to the operation to retrieve
        :type method: string
        :rtype: :class:`~carbond.Operation`

        Retrieves the operation instance corresponding to the passed HTTP method

    .. function:: getService()

        :inheritedFrom: :class:`~carbond.Endpoint`
        :rtype: :class:`~carbond.Service`

        Returns the root :class:`~carbond.Service` instance (note, this is preferred over accessing the ``service`` property itself)

    .. function:: isOperationAuthorized(method, user, req)

        :inheritedFrom: :class:`~carbond.Endpoint`
        :param method: The HTTP method corresponding to the operation that we are attempting to authorize
        :type method: string
        :param user: The user object
        :type user: Object
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :returns: Whether of not the operation is authorized
        :rtype: boolean

        Tests whether an operation is authorized given a user (as returned by the root authenticator) and any :class:`~carbond.security.Acl` that may apply to this endpoint

    .. function:: logDebug()

        :rtype: undefined

        Log a message at the "debug" level

    .. function:: logError()

        :rtype: undefined

        Log a message at the "error" level

    .. function:: logFatal()

        :rtype: undefined

        Log a message at the "fatal" level

    .. function:: logInfo()

        :rtype: undefined

        Log a message at the "info" level

    .. function:: logTrace()

        :rtype: undefined

        Log a message at the "trace" level

    .. function:: logWarning()

        :rtype: undefined

        Log a message at the "warn" level

    .. function:: on(event, listener)

        :param event: [choices: "start", "stop"]
        :type event: String
        :param listener: Callback to fire when ``event`` occurs
        :type listener: function
        :rtype: EventEmitter

        Register a service event callback

    .. function:: once(event, listener)

        :param event: the event type [choices: "start", "stop"]
        :type event: String
        :param listener: callback to fire when ``event`` occurs
        :type listener: function
        :rtype: EventEmitter

        Register a service event callback that executes once

    .. function:: operations()

        :inheritedFrom: :class:`~carbond.Endpoint`
        :rtype: :class:`~carbond.Operation[]`

        Gathers all operations defined on this endpoint

    .. function:: options(req, res)

        :inheritedFrom: :class:`~carbond.Endpoint`
        :param req: The request object
        :type req: :class:`~carbond.Request`
        :param res: The response object
        :type res: :class:`~carbond.Response`
        :rtype: undefined

        Implements the OPTIONS method handler

    .. function:: removeAllListeners(event)

        :param event: the event type [choices: "start", "stop"]
        :type event: ...String
        :rtype: EventEmitter

        Remove all listeners. If ``event`` is passed, remove all listeners for that specific event (or events).

    .. function:: removeListener(event, listener)

        :param event: the event type [choices: "start", "stop"]
        :type event: String
        :param listener: callback to fire when ``event`` occurs
        :type listener: function
        :rtype: EventEmitter

        Remove a specific listener for a particular event.

    .. function:: start(options, cb)

        :param options: Parsed command line options
        :type options: Object
        :param cb: Async callback (this can be omitted if calling from within a Fiber)
        :type cb: function
        :throws: Error 
        :rtype: undefined

        Initializes and starts the service

    .. function:: stop(cb)

        :param cb: Async callback (this can be omitted if calling from within a Fiber)
        :type cb: function
        :rtype: undefined

        Stops the service

    .. function:: supportedMethods()

        :inheritedFrom: :class:`~carbond.Endpoint`
        :rtype: string[]

        Returns a list of HTTP methods supported by this endpoint
