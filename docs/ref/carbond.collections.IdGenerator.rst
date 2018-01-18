.. class:: carbond.collections.IdGenerator
    :heading:

.. |br| raw:: html

   <br />

===============================
carbond.collections.IdGenerator
===============================
*extends* :class:`~carbond.IdGenerator`

Generates :class:`~ejson.types.ObjectId` IDs

Abstract Methods
----------------

.. class:: carbond.collections.IdGenerator
    :noindex:
    :hidden:

    .. function:: generateId(collection, req)

        :param collection: The collection that IDs are being generated for
        :type collection: :class:`~carbond.collections.Collection`
        :param req: The incoming request
        :type req: :class:`~carbond.Request`
        :returns: The ID
        :rtype: \*

        Generates an ID, where the definition of ID is left up to the implementor
