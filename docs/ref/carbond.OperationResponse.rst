.. class:: carbond.OperationResponse
    :heading:

.. |br| raw:: html

   <br />

=========================
carbond.OperationResponse
=========================

Describes what an HTTP response should look like along with some metadata to be used when generating static documentation

Instance Properties
-------------------

.. class:: carbond.OperationResponse
    :noindex:
    :hidden:

    .. attribute:: description

       :type: string
       :required:

       A brief description of the response that will be included generated static documentation


    .. attribute:: schema

       :type: Object
       :required:

       A valid JSON schema that describes HTTP response body. This will be used to validate responses returned by operations.


    .. attribute:: statusCode

       :type: number
       :default: ``200``

       The status code for a response

