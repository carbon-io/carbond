.. class:: carbond.ObjectIdGenerator
    :heading:

.. |br| raw:: html

   <br />

=========================
carbond.ObjectIdGenerator
=========================
*extends* :class:`~carbond.IdGenerator`

Generates :class:`~ejson.types.ObjectId` IDs

Properties
----------

.. class:: carbond.ObjectIdGenerator
    :noindex:
    :hidden:

    .. attribute:: carbond.ObjectIdGenerator.generateStrings

       :type: boolean
       :default: false

       Whether or not to return a ``string`` representation of the :class:`~ejson.types.ObjectId`


Methods
-------

.. class:: carbond.ObjectIdGenerator
    :noindex:
    :hidden:

    .. function:: carbond.ObjectIdGenerator.generateId()

        :overrides: :attr:`~carbond.IdGenerator.generateId`
        :rtype: :class:`~ejson.types.ObjectId` | string

        Generates an :class:`~ejson.types.ObjectId`
