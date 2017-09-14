.. class:: carbond.security.Hasher
    :heading:

.. |br| raw:: html

   <br />

=======================
carbond.security.Hasher
=======================

Hasher descripton

Methods
-------

.. class:: carbond.security.Hasher
    :noindex:
    :hidden:

    .. function:: eq(data, digest)

        :param data: the data to compare against in its raw form
        :type data: string
        :param digest: the digest to compare against
        :type digest: string
        :rtype: boolean

        eq description

    .. function:: getHasher(name)

        :param name: the name of a hasher
        :type name: string
        :rtype: function

        Get a hasher class by name

    .. function:: getHasherNames()

        :rtype: Array

        Get the names of all registered hashers.

    .. function:: hash(data)

        :param data: the data to hash
        :type data: string
        :rtype: string

        hash description
