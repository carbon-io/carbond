.. class:: carbond.security.Sha256Hasher
    :heading:

.. |br| raw:: html

   <br />

=============================
carbond.security.Sha256Hasher
=============================
*extends* :class:`~carbond.security.Hasher`

A utility class for the SHA-256 hash function

Instance Properties
-------------------

.. class:: carbond.security.Sha256Hasher
    :noindex:
    :hidden:

    .. attribute:: digestType

       :type: string
       :default: ``hex``

       the type of digest to output. Can be *hex*, *latin1*, or *base64*.


Abstract Methods
----------------

.. class:: carbond.security.Sha256Hasher
    :noindex:
    :hidden:

    .. function:: eq(data, digest)

        :inheritedFrom: :class:`~carbond.security.Hasher`
        :param data: the data in its raw form
        :type data: string
        :param digest: the digest to compare against
        :type digest: string
        :returns: true if the data evaluates to digest
        :rtype: boolean

        Compares data against a digest

Methods
-------

.. class:: carbond.security.Sha256Hasher
    :noindex:
    :hidden:

    .. function:: getHasher(name)

        :inheritedFrom: :class:`~carbond.security.Hasher`
        :param name: the name of a hasher. Supported hashers are *noop*, *sha256*, and *bcrypt*.
        :type name: string
        :returns: the constructor for a hasher or undefined if not found
        :rtype: function | undefined

        Get a hasher class by name.

    .. function:: getHasherNames()

        :inheritedFrom: :class:`~carbond.security.Hasher`
        :returns: registered hasher names
        :rtype: string[]

        Get the names of all registered hashers.

    .. function:: hash(data)

        :param data: the data to hash
        :type data: string
        :returns: the SHA-256 digest
        :rtype: string

        Calculates the SHA-256 digest of the input string
