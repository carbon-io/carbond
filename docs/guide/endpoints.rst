=========
Endpoints
=========

.. toctree::

Each :js:class:`~carbond.Endpoint` represents a single URI and can support any
number of the following HTTP operations: ``GET``, ``POST``, ``PUT``, ``PATCH``,
``DELETE``, ``HEAD``, and ``OPTIONS``.

Simple Endpoints
----------------

Below is a simple :js:class:`~carbond.Endpoint` at the path ``/hello`` that
defines two operations, ``get`` and ``post``:

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleEndpointExample.js
    :language: javascript 
    :linenos:
    :lines: 5-
    :emphasize-lines: 7-15

Endpoints with named path parameters
------------------------------------

:js:class:`~carbond.Endpoint`\ s can be defined using paths with named
parameters. Bound template variables values can then be accessed via
``req.params``:

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleEndpointsExample.js 
    :language: javascript 
    :linenos:
    :lines: 17-44
    :emphasize-lines: 14, 18

.. todo:: add role to display external doc links with same styling as js xrefs

In this example, a request for the path ``/users/jonny16`` will route to the
``/users/:id`` :js:class:`~carbond.Endpoint` and :express4:`req.params` will
have the value ``"jonny16"``. 

Sub-endpoints 
-------------

:js:class:`~carbond.Endpoints`\s may contain sub-endpoints. Here is an example that is
similar to the API as above, but that uses a sub-endpoint to define an
:js:class:`~carbond.Endpoint` at the path ``/users/:id``.

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleSubEndpointExample.js 
    :language: javascript 
    :linenos:
    :lines: 17-
    :emphasize-lines: 15, 19

Accessing Service properties from within Endpoints 
--------------------------------------------------

Properties of the top-level :js:class:`~carbond.Service` can be accessed via the
:js:func:`~carbond.Endpoint.getService` property of your :js:class:`~carbond.Endpoint`:

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleEndpointServiceReferenceExample.js 
    :language: javascript 
    :linenos:
    :lines: 5-
    :emphasize-lines: 11

