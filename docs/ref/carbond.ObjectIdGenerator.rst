.. class:: carbond.ObjectIdGenerator
    :heading:

.. |br| raw:: html

   <br />

=========================
carbond.ObjectIdGenerator
=========================
*extends* :class:`~carbond.IdGenerator`

Generates :class:`~ejson.types.ObjectId` IDs

Instance Properties
-------------------

.. class:: carbond.ObjectIdGenerator
    :noindex:
    :hidden:

    .. attribute:: generateStrings

       :type: boolean
       :default: false

       Whether or not to return a ``string`` representation of the :class:`~ejson.types.ObjectId`


Methods
-------

.. class:: carbond.ObjectIdGenerator
    :noindex:
    :hidden:

    .. function:: generateId()

        :overrides: :attr:`~carbond.IdGenerator.generateId`
        :returns: Returns the :class:`~ejson.types.ObjectId` instance of a ``string`` if configured to do so
        :rtype: :class:`~ejson.types.ObjectId` | string

        Generates an :class:`~ejson.types.ObjectId`
