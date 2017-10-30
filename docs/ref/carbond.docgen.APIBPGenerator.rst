.. class:: carbond.docgen.APIBPGenerator
    :heading:

.. |br| raw:: html

   <br />

=============================
carbond.docgen.APIBPGenerator
=============================
*extends* :class:`~carbond.docgen.StaticDocumentationGenerator`

Generates apiblueprint style static documentation

Methods
-------

.. class:: carbond.docgen.APIBPGenerator
    :noindex:
    :hidden:

    .. function:: generateBlueprint()

        :rtype: string

        Generates apiblueprint text

    .. function:: generateDocs(docsPath, options)

        :param docsPath: The path to write docs to
        :type docsPath: string
        :param options: An array of options as specified by the user
        :type options: list
        :rtype: int

        Generates apiblueprint docs and writes them to standard out or a file
