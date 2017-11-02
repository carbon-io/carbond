========
Services
========

.. toctree::

APIs are defined via :js:class:`~carbond.Service`\ s. Put simply, a
:js:class:`~carbond.Service` is an HTTP server that exposes a JSON REST API and
which is defined as a tree of :js:class:`~carbond.Endpoint`\s. 

Services and Endpoints
----------------------

All :js:class:`~carbond.Service` definitions follow the same general structure:

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleExample.js
    :language: javascript
    :lines: 1-8,15-16,23-
    :linenos:  

Here is an example of a simple :js:class:`~carbond.Service` that runs on port
``8888`` and that defines a single :js:class:`~carbond.Endpoint` at the path
``/hello`` which a defines a single ``get`` operation:

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleExample.js
    :language: javascript
    :lines: 1-8,15,17-
    :linenos:  

Service middleware 
------------------

You can register Express-style middleware for your service via the
:js:attr:`~carbond.Service.middleware` property on your
:js:class:`~carbond.Service` object:

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleExample.js
    :language: javascript
    :lines: 1-16,23-
    :linenos:  


.. todo:: document error handling middleware here?

.. _carbond-running-services-from-the-command-line:

Running Services from the command line
--------------------------------------

In most cases you will want to start and stop your :js:class:`~carbond.Service` from
the command line.

This can be done by ensuring the value of :js:func:`~atom.o` you are using to
define your :js:class:`~carbond.Service` is the :js:func:`~atom.o.main` version
of the library, as shown below on line 6:

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleExample.js
    :language: javascript
    :lines: 1-8,15-16,23-
    :linenos:  
    :emphasize-lines: 6

You can then start your :js:class:`~carbond.Service` like this:

..  literalinclude:: ../shell-frags/shell-output-starting-service.rst 
    :language: sh 

You can use ``-h`` or ``--help`` to get command help from your
:js:class:`~carbond.Service`:

.. todo:: remove doc generation command?

..  literalinclude:: ../shell-frags/shell-output-service-help.rst 
    :language: sh 

You can see that there are two sub-commands. One for starting the server and
another for generating documentation for your :js:class:`~carbond.Service`.

The default sub-command is ``start-server``, and will be run if you omit a
sub-command (e.g. ``$> node <path-to-your-app>/MyService``): 

.. todo:: remove some options (limiter?) here?

..  literalinclude:: ../shell-frags/shell-output-service-ss-help.rst 
    :language: sh 

Embedding Services into larger applications *(advanced use)*
------------------------------------------------------------

While you will usually run your :js:class:`~carbond.Service`\s via the command
line as a top-level application, :js:class:`~carbond.Service` objects can also
be used as a library (although it is not common). 

By using the :js:func:`~carbond.Service.start` and
:js:func:`~carbond.Service.stop` methods, you can manage the
:js:class:`~carbond.Service` lifecyle manually. 

These methods have both an asynchronous and a synchronous interface:

**Asynchronous example**

.. literalinclude:: ../code-frags/standalone-examples/ServiceAsyncProgrammaticServiceStartExample.js
    :language: javascript
    :lines: 1-7,9-40
    :linenos:

**Synchronous example**

.. literalinclude:: ../code-frags/standalone-examples/ServiceSyncProgrammaticServiceStartExample.js
    :language: javascript
    :lines: 1-8,10-39
    :linenos:

Important note: you should not find yourself starting and stopping services like
this (by manually calling :js:func:`~carbond.Service.start` and
:js:func:`~carbond.Service.stop`) frequently. In most use-cases you will simply
use the command line invocation described in the previous section.
