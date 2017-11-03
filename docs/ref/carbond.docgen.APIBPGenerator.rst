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

    .. function:: carbond.docgen.APIBPGenerator.generateBlueprint()

        :rtype: string

        Generates api-blueprint text

    .. function:: carbond.docgen.APIBPGenerator.generateDocs(docsPath, options)

        :param docsPath: The path to write docs to
        :type docsPath: string
        :param options: An array of options as specified by the user
        :type options: list
        :rtype: int

        Generates api-blueprint docs and writes them to standard out or a file
