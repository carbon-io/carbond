=======
Testing
=======

.. toctree::

.. todo:: highlight Carbon.io, Test Tube, Carbon Core, etc. in some way

For testing, Carbon.io comes with a testing framework called
:ref:`test-tube-guide`.  :ref:`test-tube-guide` is a generic unit testing
framework that comes as part of the :ref:`carbon-core-docs`.

Carbond extends :ref:`test-tube-guide`\'s HTTP testing facility to provide an easy
way to test your Carbond :js:class:`~carbond.Service`\s.

Service Tests
-------------

The :js:class:`~carbond.test.ServiceTest` class is an extension of Test Tube's
:js:class:`~testtube.HttpTest`` class that you can use to write declarative
HTTP-based unit tests of APIs you make with Carbond.

Consider the following :js:class:`~carbond.Service`:

.. literalinclude:: ../code-frags/standalone-examples/ServiceSimpleEndpointExample.js
    :language: javascript
    :named-sections: testingHeader,testingFooter
    :linenos:

You can test your :js:class:`~carbond.Service` like so:

.. literalinclude:: ../code-frags/standalone-examples/ServiceTestTestingExample.js
    :language: javascript
    :linenos:
    :emphasize-lines: 13-24
