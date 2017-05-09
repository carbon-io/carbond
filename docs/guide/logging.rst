=======
Logging
=======

.. toctree::

The :js:class:`~carbond.Service` class provides a logging facility that can be
used to log application messages at various logging levels. 

Logging messages 
----------------

To support logging the :js:class:`~carbond.Service` class exposes the following
methods:

* :js:func:`~carbond.Service.logTrace` 
* :js:func:`~carbond.Service.logDebug` 
* :js:func:`~carbond.Service.logInfo` 
* :js:func:`~carbond.Service.logWarning` 
* :js:func:`~carbond.Service.logError` 
* :js:func:`~carbond.Service.logFatal` 

To log a message you simply use these methods on your
:js:class:`~carbond.Service` object:

.. literalinclude:: ../code-frags/standalone-examples/ServiceLoggingExample.js
    :language: javascript
    :linenos:
    :lines: 1-8, 13-19, 23-
    :emphasize-lines: 13, 17

.. code-block: javascript 
  :linenos:
  :emphasize-lines: 13, 17
  var carbon = require('carbon-io') 
  var o  = carbon.atom.o(module).main 
  var __ = carbon.fibers.__(module).main
  __(function() {
    module.exports = o({
      _type: carbon.carbond.Service,
      port: 8888,
      endpoints: {
        hello: o({
          _type: carbon.carbond.Endpoint,
          get: function(req) {
            this.getService().logInfo("GET on /hello called")
            try {
              // Do stuff
            } catch (e) {
              this.getService().logError("Error while doing stuff")
            }
            return { msg: "Hello World!" }
          }
        }) 
      }
    }) 
  })

Controling verbosity 
--------------------

The verbosity level of your :js:class:`~carbond.Service` at runtime (i.e. which
log levels are logged) can controlled by the
:js:attr:`~carbond.Service.verbosity` property of you
:js:class:`~carbond.Service` object. 

The verbosity property is a string and can have the following values:

* ``'trace'``
* ``'debug'``
* ``'info'``
* ``'warn'``
* ``'error'``
* ``'fatal'``

These values have an ordering, and by setting the
:js:attr:`~carbond.Service.verbosity` property to one of these values you are
directing the :js:class:`~carbond.Service` to log all messages with that log
level and any "higher" log level. 

For example, setting the :js:attr:`~carbond.Service.verbosity` to ``'info'``
will result in all messages of log level ``'info'``, ``'warn'``, ``'error'``,
and ``'fatal'`` to be logged. 

There are two ways to control the verbosity level of a
:js:class:`~carbond.Service`:

1. Setting the :js:attr:`~carbond.Service.verbosity` property of the
   :js:class:`~carbond.Service` as part of its configuration:

.. literalinclude:: ../code-frags/standalone-examples/ServiceLoggingExample.js
    :language: javascript
    :linenos:
    :lines: 1-12, 30-
    :emphasize-lines: 9

2. Using the ``-v, --verbosity`` flag at the commandline to specifity the
   verbosity level, which will set the value of the
   :js:attr:`~carbond.Service.verbosity` property on your
   :js:class:`~carbond.Service` object. 

.. code-block:: sh 

  % node <path-to-your-app>/MyService -v info


Logging output
--------------

All output of the logging facility is directed to ``stderr``. This can
then be piped manually or via a process manager into log files or to
implement more elaborate logging strategies.
