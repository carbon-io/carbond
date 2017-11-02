.. class:: carbond.ParameterParser
    :heading:

.. |br| raw:: html

   <br />

=======================
carbond.ParameterParser
=======================

An HTTP parameter parser class that parses any parameters defined on an operation and its parent endpoint on the current request. The parsed parameter values are stored on :class:`~carbond.Request.parameters`.

Methods
-------

.. class:: carbond.ParameterParser
    :noindex:
    :hidden:

    .. function:: parseParameterValue(datum, definition)

        :param datum: The parameter representation as plucked from the current request
        :type datum: Object | string
        :param definition: The parameter descriptor
        :type definition: :class:`~carbond.OperationParameter`
        :rtype: Object | string | number

        Parse a single parameter

    .. function:: processParameter(req, definition)

        :param req: The current request
        :type req: :class:`~carbond.Request`
        :param definition: The parameter to parse
        :type definition: :class:`~carbond.OperationParameter`
        :rtype: undefined

        Parse a single parameter on the current request as defined by the "definition" parameter

    .. function:: processParameters(req, definitions)

        :param req: The current request
        :type req: :class:`~carbond.Request`
        :param definitions: An array of parameters to parse from the current request
        :type definitions: :class:`~carbond.OperationParameter[]`
        :rtype: undefined

        Parse all parameters on the current request that are included in the :class:`~carbond.OperationParameter` definitions list

    .. function:: processParameterValue(datum, definition)

        :param datum: The parameter representation as plucked from the current request
        :type datum: Object | string
        :param definition: The parameter descriptor
        :type definition: :class:`~carbond.OperationParameter`
        :rtype: Object | string | number

        Process (i.e., parse and validate) a single parameter
