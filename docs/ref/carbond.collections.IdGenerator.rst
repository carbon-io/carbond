.. class:: carbond.collections.IdGenerator
    :heading:

.. |br| raw:: html

   <br />

===============================
carbond.collections.IdGenerator
===============================
*extends* :class:`~carbond.IdGenerator`

Generates :class:`~ejson.types.ObjectId` IDs

Methods
-------

.. class:: carbond.collections.IdGenerator
    :noindex:
    :hidden:

    .. function:: carbond.collections.IdGenerator.generateId(collection, req)

        :param collection: The collection that IDs are being generated for
        :type collection: :class:`~carbond.collections.Collection`
        :param req: The incoming request
        :type req: :class:`~carbond.Request`
        :rtype: \*

        Generates an ID, where the definition of ID is left up to the implementor
