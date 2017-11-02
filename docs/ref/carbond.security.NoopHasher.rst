.. class:: carbond.security.NoopHasher
    :heading:

.. |br| raw:: html

   <br />

===========================
carbond.security.NoopHasher
===========================
*extends* :class:`~Hasher`

A NOOP "hasher" which just returns the data as the digest. Useful as a placeholder or for testing purposes. This offers no security. A real hash function such as :class:`~carbond.security.BcryptHasher` should be used in production.

Methods
-------

.. class:: carbond.security.NoopHasher
    :noindex:
    :hidden:

    .. function:: hash(data)

        :param data: the data to "hash"
        :type data: string
        :rtype: string

        Returns the input data unchanged
