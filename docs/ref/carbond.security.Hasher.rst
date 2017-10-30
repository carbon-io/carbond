.. class:: carbond.security.Hasher
    :heading:

.. |br| raw:: html

   <br />

=======================
carbond.security.Hasher
=======================

A utility class for cryptographic hash functions

Methods
-------

.. class:: carbond.security.Hasher
    :noindex:
    :hidden:

    .. function:: eq(data, digest)

        :param data: the data in its raw form
        :type data: string
        :param digest: the digest to compare against
        :type digest: string
        :rtype: boolean

        Compares data against a digest

    .. function:: getHasher(name)

        :param name: the name of a hasher. Supported hashers are *noop*, *sha256*, and *bcrypt*.
        :type name: string
        :rtype: function | undefined

        Get a hasher class by name.

    .. function:: getHasherNames()

        :rtype: string[]

        Get the names of all registered hashers.

    .. function:: hash(data)

        :param data: the data to hash
        :type data: string
        :rtype: string

        Calculates the hash digest of the input string
