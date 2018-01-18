.. class:: carbond.OperationParameter
    :heading:

.. |br| raw:: html

   <br />

==========================
carbond.OperationParameter
==========================

Describes an HTTP parameter. Parameter types include: path parameters (e.g., "_id" in "/foo/bar/:_id"), query parameters (e.g., "baz" in "/foo/bar?baz=true"), HTTP header parameters, and HTTP body parameters.

Instance Properties
-------------------

.. class:: carbond.OperationParameter
    :noindex:
    :hidden:

    .. attribute:: default

       :type: \*
       :default: undefined

       A default value for the parameter if it is not present in the incoming request


    .. attribute:: description

       :type: string
       :default: undefined

       A brief description of this parameter This will be displayed in any generated documentation.


    .. attribute:: location

       :type: string
       :required:

       The location of the parameter in an incoming request [choices: "query", "header", "path", "body]


    .. attribute:: name

       :type: string
       :ro:

       The operation parameter name


    .. attribute:: required

       :type: boolean
       :default: false

       Flag determining whether the parameter is required


    .. attribute:: schema

       :type: Object
       :default: undefined

       A JSON schema used to validate the incoming parameter


Methods
-------

.. class:: carbond.OperationParameter
    :noindex:
    :hidden:

    .. function:: extractParameterValueFromRequest(req)

        :param req: The incoming request object
        :type req: :class:`~carbond.Request`
        :rtype: \*

        Retrieves the parameter value from a request, returning the default value if it does not exist and a default value is defined. Note, values returned from this method are not parsed.
