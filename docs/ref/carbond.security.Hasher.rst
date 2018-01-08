.. class:: carbond.security.Hasher
    :heading:

.. |br| raw:: html

   <br />

=======================
carbond.security.Hasher
=======================

A utility class for cryptographic hash functions

Abstract Methods
----------------

.. class:: carbond.security.Hasher
    :noindex:
    :hidden:

    .. function:: eq(data, digest)

        :param data: the data in its raw form
        :type data: string
        :param digest: the digest to compare against
        :type digest: string
        :returns: true if the data evaluates to digest
        :rtype: boolean

        Compares data against a digest

    .. function:: hash(data)

        :param data: the data to hash
        :type data: string
        :returns: the digest
        :rtype: string

        Calculates the hash digest of the input string

Methods
-------

.. class:: carbond.security.Hasher
    :noindex:
    :hidden:

    .. function:: getHasher(name)

        :param name: the name of a hasher. Supported hashers are *noop*, *sha256*, and *bcrypt*.
        :type name: string
        :returns: the constructor for a hasher or undefined if not found
        :rtype: function | undefined

        Get a hasher class by name.

    .. function:: getHasherNames()

        :returns: registered hasher names
        :rtype: string[]

        Get the names of all registered hashers.
