.. class:: carbond.docgen.APIBPGenerator
    :heading:

.. |br| raw:: html

   <br />

=============================
carbond.docgen.APIBPGenerator
=============================
*extends* :class:`~carbond.docgen.StaticDocumentationGenerator`

Generates api-blueprint style static documentation

Methods
-------

.. class:: carbond.docgen.APIBPGenerator
    :noindex:
    :hidden:

    .. function:: generateBlueprint()

        :returns: The api-blueprint text for the service
        :rtype: string

        Generates api-blueprint text

    .. function:: generateDocs(docsPath, options)

        :param docsPath: The path to write docs to
        :type docsPath: string
        :param options: An array of options as specified by the user
        :type options: list
        :returns: 0 on success, >0 on failure
        :rtype: int

        Generates api-blueprint docs and writes them to standard out or a file
