.. class:: carbond.Service
    :heading:

.. |br| raw:: html
 
   <br />

===============
carbond.Service
===============

Description goes here for :class:`~carbond.Service`

Properties
==========

.. class:: carbond.Service
    :noindex:
    :hidden:

    .. attribute:: carbond.Service.cmdargs

        .. csv-table::
            :class: details-table

            "cmdargs", ""
            "Description", ""

    .. attribute:: carbond.Service.hostname

        .. csv-table::
            :class: details-table

            "hostname", ""
            "Description", ""

    .. attribute:: carbond.Service.port

        .. csv-table::
            :class: details-table

            "port", ""
            "Description", ""

    .. attribute:: carbond.Service.description

        .. csv-table::
            :class: details-table

            "description", ""
            "Description", ""

    .. attribute:: carbond.Service.verbosity

        .. csv-table::
            :class: details-table

            "verbosity", ""
            "Description", ""

    .. attribute:: carbond.Service.path

        .. csv-table::
            :class: details-table

            "path", ""
            "Description", ""

    .. attribute:: carbond.Service.processUser

        .. csv-table::
            :class: details-table

            "processUser", ""
            "Description", ""

    .. attribute:: carbond.Service.apiRoot

        .. csv-table::
            :class: details-table

            "apiRoot", ""
            "Description", ""

    .. attribute:: carbond.Service.adminRoot

        .. csv-table::
            :class: details-table

            "adminRoot", ""
            "Description", ""

    .. attribute:: carbond.Service.dbUri

        .. csv-table::
            :class: details-table

            "dbUri", ""
            "Description", ""

    .. attribute:: carbond.Service.dbUris

        .. csv-table::
            :class: details-table

            "dbUris", ""
            "Description", ""

    .. attribute:: carbond.Service.db

        .. csv-table::
            :class: details-table

            "db", ""
            "Description", ""

    .. attribute:: carbond.Service.dbs

        .. csv-table::
            :class: details-table

            "dbs", ""
            "Description", ""

    .. attribute:: carbond.Service.endpoints

        .. csv-table::
            :class: details-table

            "endpoints", ""
            "Description", ""

    .. attribute:: carbond.Service.authenticator

        .. csv-table::
            :class: details-table

            "authenticator", ""
            "Description", ""

    .. attribute:: carbond.Service.middleware

        .. csv-table::
            :class: details-table

            "middleware", ""
            "Description", ""

    .. attribute:: carbond.Service.errorHandlingMiddleware

        .. csv-table::
            :class: details-table

            "errorHandlingMiddleware", ""
            "Description", ""

    .. attribute:: carbond.Service.publicDirectories

        .. csv-table::
            :class: details-table

            "publicDirectories", ""
            "Description", ""

    .. attribute:: carbond.Service.corsEnabled

        .. csv-table::
            :class: details-table

            "corsEnabled", ""
            "Description", ""

    .. attribute:: carbond.Service.sslOptions

        .. csv-table::
            :class: details-table

            "sslOptions", ""
            "Description", ""

    .. attribute:: carbond.Service.parameterParser

        .. csv-table::
            :class: details-table

            "parameterParser", ""
            "Description", ""

    .. attribute:: carbond.Service.generateOptionsMethodsInDocs

        .. csv-table::
            :class: details-table

            "generateOptionsMethodsInDocs", ""
            "Description", ""

    .. attribute:: carbond.Service.cluster

        .. csv-table::
            :class: details-table

            "cluster", ""
            "Description", ""

    .. attribute:: carbond.Service.numClusterWorkers

        .. csv-table::
            :class: details-table

            "numClusterWorkers", ""
            "Description", ""

    .. attribute:: carbond.Service.busyLimiter

        .. csv-table::
            :class: details-table

            "busyLimiter", ""
            "Description", ""

    .. attribute:: carbond.Service.defaultBusyLimiterClass

        .. csv-table::
            :class: details-table

            "defaultBusyLimiterClass", ""
            "Description", ""

    .. attribute:: carbond.Service.limiter

        .. csv-table::
            :class: details-table

            "limiter", ""
            "Description", ""

    .. attribute:: carbond.Service.fiberPoolSize

        .. csv-table::
            :class: details-table

            "fiberPoolSize", ""
            "Description", ""

    .. attribute:: carbond.Service.serviceName

        .. csv-table::
            :class: details-table

            "serviceName", ""
            "Description", ""


Methods
=======

.. class:: carbond.Service
    :noindex:
    :hidden:

    .. function:: carbond.Service.logtrace

        .. csv-table::
            :class: details-table

            "logtrace (*obj*)", ""
            "Arguments", "**obj**: "
            "Descriptions", ""

    .. function:: carbond.Service.logDebug

        .. csv-table::
            :class: details-table

            "logDebug (*obj*)", ""
            "Arguments", "**obj**: "
            "Descriptions", ""

    .. function:: carbond.Service.logInfo

        .. csv-table::
            :class: details-table

            "logInfo (*obj*)", ""
            "Arguments", "**obj**: "
            "Descriptions", ""

    .. function:: carbond.Service.logWarning

        .. csv-table::
            :class: details-table

            "logWarning (*obj*)", ""
            "Arguments", "**obj**: "
            "Descriptions", ""

    .. function:: carbond.Service.logError

        .. csv-table::
            :class: details-table

            "logError (*obj*)", ""
            "Arguments", "**obj**: "
            "Descriptions", ""

    .. function:: carbond.Service.logFatal

        .. csv-table::
            :class: details-table

            "logFatal (*obj*)", ""
            "Arguments", "**obj**: "
            "Descriptions", ""

    .. function:: carbond.Service.on

        .. csv-table::
            :class: details-table

            "on (*event, listener*)", ""
            "Arguments", "**event** (:class:`String`): the event type |br|
            **listener** (:class:`Function`): callback to fire when `event` occurs |br|"
            "Descriptions", "Register an event callback."

    .. function:: carbond.Service.once

        .. csv-table::
            :class: details-table

            "once (*event, listener*)", ""
            "Arguments", "**event** (:class:`String`): the event type |br|
            **listener** (:class:`Function`): callback to fire when `event` occurs |br|"
            "Descriptions", "Register an event callback that executes once."


    .. function:: carbond.Service.removeAllListeners

        .. csv-table::
            :class: details-table

            "removeAllListeners (*event*)", ""
            "Arguments", "**event** (:class:`String`): the event type |br|"
            "Descriptions", "Remove all listeners. If `event` is passed, remove all events for that specific event (or events)."

    .. function:: carbond.Service.removeListener

        .. csv-table::
            :class: details-table

            "removeListener (*event, listener*)", ""
            "Arguments", "**event** (:class:`String`): the event type |br|
            **listener** (:class:`Function`): callback to fire when `event` occurs |br|"
            "Descriptions", "Remove a specific listener for a particular event."

    .. function:: carbond.Service.start

        .. csv-table::
            :class: details-table

            "start (*options, cb*)", ""
            "Arguments", "**options**: |br|
            **cb**: |br|"
            "Descriptions", ""

    .. function:: carbond.Service.doStart

        .. csv-table::
            :class: details-table

            "doStart (*options*)", ""
            "Arguments", "**options**: |br|"
            "Descriptions", ""

    .. function:: carbond.Service.stop

        .. csv-table::
            :class: details-table

            "stop (*cb*)", ""
            "Arguments", "**cb**: |br|"
            "Descriptions", ""

    .. function:: carbond.Service.doStop

        .. csv-table::
            :class: details-table

            "doStop", ""
            "Arguments", ""
            "Descriptions", ""

