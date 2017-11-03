.. class:: carbond.security.Sha256Hasher
    :heading:

.. |br| raw:: html

   <br />

=============================
carbond.security.Sha256Hasher
=============================
*extends* :class:`~carbond.security.Hasher`

A utility class for the SHA-256 hash function

Properties
----------

.. class:: carbond.security.Sha256Hasher
    :noindex:
    :hidden:

    .. attribute:: carbond.security.Sha256Hasher.digestType

       :type: string
       :default: ``hex``

       the type of digest to output. Can be *hex*, *latin1*, or *base64*.


Methods
-------

.. class:: carbond.security.Sha256Hasher
    :noindex:
    :hidden:

    .. function:: carbond.security.Sha256Hasher.hash(data)

        :param data: the data to hash
        :type data: string
        :rtype: string

        Calculates the SHA-256 digest of the input string
