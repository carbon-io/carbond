.. class:: carbond.Service
    :heading:

.. |br| raw:: html

   <br />

===============
carbond.Service
===============
*extends* :class:`~carbond.Endpoint`

Service class description

Properties
----------

.. class:: carbond.Service
    :noindex:
    :hidden:

    .. attribute:: adminRoot

       :type: string
       :default: ``/serviceadmin``

       xxx


    .. attribute:: apiRoot

       :type: xxx
       :required:

       xxx


    .. attribute:: authenticator

       :type: xxx
       :required:

       xxx


    .. attribute:: busyLimiter

       :type: xxx
       :required:

       xxx


    .. attribute:: cluster

       :type: boolean
       :default: undefined

       xxx


    .. attribute:: cmdargs

       :type: object
       :default: ``{}``

       Additional command line argument definitions (will be merged into :class:`~carbond.Service.defaultCmdargs`)


    .. attribute:: corsEnabled

       :type: boolean
       :default: ``true``

       xxx


    .. attribute:: db

       :type: xxx
       :required:

       xxx


    .. attribute:: dbs

       :type: object
       :required:

       xxx


    .. attribute:: dbUri

       :type: string
       :required:

       xxx


    .. attribute:: dbUris

       :type: object
       :required:

       xxx


    .. attribute:: defaultBusyLimiterClass

       :type: :class:`~carbond.limiter.TooBusyLimiter`
       :required:

       xxx


    .. attribute:: defaultCmdargs

       :type: object
       :default: ``{...}``

       The default command line arguments definition. :class:`~carbond.Service#cmdargs` can be used to extend the default set of command line arguments.


    .. attribute:: defaultDocgenOptions

       :type: xxx
       :required:

       xxx


    .. attribute:: description

       :type: string
       :default: ``'This is a Service'``

       A short description of this service


    .. attribute:: endpoints

       :type: object
       :required:

       xxx


    .. attribute:: env

       :type: xxx
       :required:

       xxx


    .. attribute:: errorHandlingMiddleware

       :type: xxx
       :required:

       xxx


    .. attribute:: fiberPoolSize

       :type: number
       :required:

       xxx


    .. attribute:: generateOptionsMethodsInDocs

       :type: boolean
       :default: undefined

       xxx


    .. attribute:: gracefulShutdown

       :type: string
       :default: ``production``

       xxx


    .. attribute:: hostname

       :type: string
       :default: ``'127.0.0.1'``

       The address that this service should listen on


    .. attribute:: limiter

       :type: xxx
       :required:

       xxx


    .. attribute:: middleware

       :type: xxx
       :required:

       xxx


    .. attribute:: numClusterWorkers

       :type: number
       :required:

       xxx


    .. attribute:: parameterParser

       :type: xxx
       :required:

       xxx


    .. attribute:: path

       :type: string
       :required:

       xxx


    .. attribute:: port

       :type: number
       :default: ``8888``

       The port that this service should bind


    .. attribute:: processUser

       :type: xxx
       :required:

       xxx


    .. attribute:: publicDirectories

       :type: xxx
       :required:

       xxx


    .. attribute:: serverSocketTimeout

       :type: xxx
       :required:

       xxx


    .. attribute:: serviceName

       :type: string
       :required:

       xxx


    .. attribute:: sslOptions

       :type: xxx
       :required:

       xxx


Methods
-------

.. class:: carbond.Service
    :noindex:
    :hidden:

    .. function:: doStart(options)

        :param options: xxx
        :type options: xxx
        :rtype: undefined

        doStart description

    .. function:: doStop()

        :rtype: undefined

        doStop description

    .. function:: logDebug()

        :rtype: undefined

        logDebug description

    .. function:: logError()

        :rtype: undefined

        logError description

    .. function:: logFatal()

        :rtype: undefined

        logFatal description

    .. function:: logInfo()

        :rtype: undefined

        logInfo description

    .. function:: logTrace()

        :rtype: undefined

        logTrace description

    .. function:: logWarning()

        :rtype: undefined

        logWarning description

    .. function:: maskSecret(str)

        :param str: xxx
        :type str: string
        :rtype: string

        maskSecret description

    .. function:: on(event, listener)

        :param event: [choices: "start", "stop"]
        :type event: String
        :param listener: callback to fire when `event` occurs
        :type listener: function
        :rtype: function

        Register an event callback.

    .. function:: once(event, listener)

        :param event: the event type [choices: "start", "stop"]
        :type event: String
        :param listener: callback to fire when `event` occurs
        :type listener: function
        :rtype: function

        Register an event callback that executes once.

    .. function:: removeAllListeners(event...)

        :param event...: the event type [choices: "start", "stop"]
        :type event...: String
        :rtype: xxx

        Remove all listeners. If `event` is passed, remove all events for that specific event (or events).

    .. function:: removeListener(event.., listener)

        :param event..: the event type [choices: "start", "stop"]
        :type event..: String
        :param listener: callback to fire when `event` occurs
        :type listener: function
        :rtype: xxx

        Remove a specific listener for a particular event.

    .. function:: start(options, cb)

        :param options: xxx
        :type options: xxx
        :param cb: xxx
        :type cb: function
        :rtype: undefined

        start description

    .. function:: stop(cb)

        :param cb: xxx
        :type cb: function
        :rtype: undefined

        stop description
