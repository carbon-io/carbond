.. class:: carbond.security.HttpBasicAuthenticator
    :heading:

.. |br| raw:: html
 
   <br />

=======================================
carbond.security.HttpBasicAuthenticator
=======================================
*extends* :class:`~carbond.security.Authenticator`

Description for :class:`~carbond.security.HttpBasicAuthenticator` goes here

Properties
==========

.. class:: carbond.security.HttpBasicAuthenticator
    :noindex:
    :hidden:

    .. attribute:: carbond.security.HttpBasicAuthenticator.passwordField

        .. csv-table::
            :class: details-table

            "passwordField", :class:`string`
            "Default", ``undefined``
            "Description", "Password field."

    .. attribute:: carbond.security.HttpBasicAuthenticator.passwordHashFn

        .. csv-table::
            :class: details-table

            "passwordHashFn", :class:`function`
            "Default", ``noop``
            "Description", "Password hash function."

    .. attribute:: carbond.security.HttpBasicAuthenticator.usernameField

        .. csv-table::
            :class: details-table

            "usernameField", :class:`string`
            "Default", ``undefined``
            "Description", "Username field."


Methods
=======

.. class:: carbond.security.HttpBasicAuthenticator
    :noindex:
    :hidden:

    .. function:: carbond.security.Authenticator.HttpBasicAuthenticator.authenticate

        .. csv-table::
            :class: details-table

            "authenticate (*req*)", ""
            "Arguments", "**req** (:class:`express.request`): The current request object |br|"
            "Returns", :class:`string`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.security.Authenticator.HttpBasicAuthenticator.findUser

        .. csv-table::
            :class: details-table

            "findUser (*username*)", ""
            "Arguments", "**username** (:class:`string`): the username to be found |br|"
            "Returns", :class:`string`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.security.Authenticator.HttpBasicAuthenticator.validateCreds

        .. csv-table::
            :class: details-table

            "validateCreds (*username, password*)", ""
            "Arguments", "**username** (:class:`string`): the username to be validated |br|
            **password** (:class:`string`): the password to be checked |br|"
            "Returns", :class:`string`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."
