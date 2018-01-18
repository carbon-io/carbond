.. class:: carbond.security.BcryptHasher
    :heading:

.. |br| raw:: html

   <br />

=============================
carbond.security.BcryptHasher
=============================
*extends* :class:`~carbond.security.Hasher`

A utility class for the bcrypt hashing function

Instance Properties
-------------------

.. class:: carbond.security.BcryptHasher
    :noindex:
    :hidden:

    .. attribute:: rounds

       :type: integer
       :default: ``10``

       the number of rounds to use XXX: The underlying bcryptjs library defaults to 10 rounds. Should probably explicitly define that.


Methods
-------

.. class:: carbond.security.BcryptHasher
    :noindex:
    :hidden:

    .. function:: eq(data, digest)

        :param data: the data in its raw form
        :type data: string
        :param digest: the digest to compare against
        :type digest: string
        :returns: true if the data evaluates to digest
        :rtype: boolean

        Compares data against a bcrypt digest

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
        :returns: the digest
        :rtype: string

        Calculates the bcrypt digest of the input string
