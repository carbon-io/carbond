.. class:: carbond.security.BcryptHasher
    :heading:

.. |br| raw:: html

   <br />

=============================
carbond.security.BcryptHasher
=============================
*extends* :class:`~carbond.security.Hasher`

A utility class for the bcrypt hashing function

Properties
----------

.. class:: carbond.security.BcryptHasher
    :noindex:
    :hidden:

    .. attribute:: carbond.security.BcryptHasher.rounds

       :type: integer
       :default: ``10``

       the number of rounds to use XXX: The underlying bcryptjs library defaults to 10 rounds. Should probably explicitly define that.


Methods
-------

.. class:: carbond.security.BcryptHasher
    :noindex:
    :hidden:

    .. function:: carbond.security.BcryptHasher.eq(data, digest)

        :param data: the data in its raw form
        :type data: string
        :param digest: the digest to compare against
        :type digest: string
        :rtype: boolean

        Compares data against a bcrypt digest

    .. function:: carbond.security.BcryptHasher.hash(data)

        :param data: the data to hash
        :type data: string
        :rtype: string

        Calculates the bcrypt digest of the input string
