.. class:: carbond.security.BcryptHasher
    :heading:

.. |br| raw:: html
 
   <br />

=============================
carbond.security.BcryptHasher
=============================
*extends* :class:`~carbond.security.Hasher`

Description for :class:`~carbond.security.BcryptHasher` goes here

Properties
==========

.. class:: carbond.security.BcryptHasher
    :noindex:
    :hidden:

    .. attribute:: carbond.security.BcryptHasher.rounds

        .. csv-table::
            :class: details-table

            "rounds", :class:`number`
            "Default", ``undefined``
            "Description", "The number of rounds to use"

Methods
=======

.. class:: carbond.security.BcryptHasher
    :noindex:
    :hidden:

    .. function:: carbond.security.BcryptHasher.eq

        .. csv-table::
            :class: details-table

            "eq (*data, digest*)", *overrides*:attr:`~carbond.Hasher.eq`
            "Arguments", "**data** (:class:`string`): the data to compare against in its raw form |br|
            **digest** (:class:`string`): the digest to compare against |br|"
            "Returns", :class:`boolean`
            "Descriptions", "Returns true if the data evaluates to digest"

    .. function:: carbond.security.BcryptHasher.hash

        .. csv-table::
            :class: details-table

            "hash (*data*)", *overrides* :attr:`~carbond.Hasher.hash`
            "Arguments", "**data** (:class:`string`): the data to hash |br|"
            "Returns", :class:`string`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."
