.. class:: carbond.test.ServiceTest
    :heading:

.. |br| raw:: html

   <br />

========================
carbond.test.ServiceTest
========================
*extends* :class:`~testtube.HttpTest`

A test harness for testing :class:`~carbond.Service`\ s. This will automatically startup and shutdown a service as part of the test's setup and teardown phase.

Instance Properties
-------------------

.. class:: carbond.test.ServiceTest
    :noindex:
    :hidden:

    .. attribute:: service

       :type: :class:`~carbond.Service`
       :required:

       The service instance to test


    .. attribute:: serviceEnv

       :type: string
       :default: ``'development'``

       Sets the service's :class:`~carbond.Service.env` for testing


    .. attribute:: suppressServiceLogging

       :type: boolean
       :default: ``true``

       Flag to suppress service logging to the console


Methods
-------

.. class:: carbond.test.ServiceTest
    :noindex:
    :hidden:

    .. function:: setup()

        :rtype: undefined

        Performs setup operations for this test, namely starting the service to be tested and configuring service logging

    .. function:: teardown()

        :rtype: undefined

        Performs teardown operations for this test, namely stopping the service
