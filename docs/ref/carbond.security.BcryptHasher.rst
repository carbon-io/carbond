.. class:: carbond.security.BcryptHasher
    :heading:

.. |br| raw:: html

   <br />

=============================
carbond.security.BcryptHasher
=============================
*extends* :class:`~carbond.security.Hasher`

BcryptHasher description

Properties
----------

.. class:: carbond.security.BcryptHasher
    :noindex:
    :hidden:

    .. attribute:: rounds

       :type: integer
       :required:

       the number of rounds to use


Methods
-------

.. class:: carbond.security.BcryptHasher
    :noindex:
    :hidden:

    .. function:: eq(data, digest)

        :param data: the data to compare against in its raw form
        :type data: string
        :param digest: the digest to compare against
        :type digest: string
        :rtype: boolean

        eq description

    .. function:: hash(data)

        :param data: the data to hash
        :type data: string
        :rtype: string

        hash description
