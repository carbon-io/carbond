.. class:: carbond.security.Authenticator
    :heading:

.. |br| raw:: html
 
   <br />

====================================
carbond.security.Authenticator
====================================

An :class:`Authenticator` is an abstract class representing a method of authentication. Authenticators implement an ``authenticate`` method which takes a request and returns a user object.

Properties
==========

*none*

Methods
=======

.. class:: carbond.security.Authenticator
    :noindex:
    :hidden:

    .. function:: carbond.security.Authenticator.authenticate

        .. csv-table::
            :class: details-table

            "authenticate (*req*)", ""
            "Arguments", "**req** (:class:`express.request`): The current request object |br|"
            "Returns", :class:`undefined`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.security.Authenticator.getAuthenticationHeaders

        .. csv-table::
            :class: details-table

            "getAuthenticationHeaders ()", ""
            "Arguments", ``undefined``
            "Returns", :class:`object`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.security.Authenticator.initialize

        .. csv-table::
            :class: details-table

            "initialize (*service*)", ""
            "Arguments", "**service** (:class:`string`): Lorem ipsum dolor sit amet |br|"
            "Returns", :class:`~carbond.Service`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.security.Authenticator.isRootUser

        .. csv-table::
            :class: details-table

            "isRootUser (*user*)", ""
            "Arguments", "**user** (:class:`string`): Lorem ipsum dolor sit amet |br|"
            "Returns", :class:`boolean`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.security.Authenticator.throwUnauthenticated

        .. csv-table::
            :class: details-table

            "throwUnauthenticated (*msg*)", ""
            "Arguments", "**msg** (:class:`string`): Lorem ipsum dolor sit amet |br|"
            "Returns", ``undefined``
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."
            