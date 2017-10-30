.. class:: carbond.security.Sha256Hasher
    :heading:

.. |br| raw:: html

   <br />

=============================
carbond.security.Sha256Hasher
=============================
*extends* :class:`~carbond.security.Hasher`

A utility class for the SHA256 hash function

Properties
----------

.. class:: carbond.security.Sha256Hasher
    :noindex:
    :hidden:

    .. attribute:: digestType

       :type: string
       :default: ``hex``

       the type of digest to output. Can be *hex*, *latin1*, or *base64*.


Methods
-------

.. class:: carbond.security.Sha256Hasher
    :noindex:
    :hidden:

    .. function:: hash(data)

        :param data: the data to hash
        :type data: string
        :rtype: string

        Calculates the SHA256 digest of the input string
