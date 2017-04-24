.. class:: carbond.security.ApiKeyAuthenticator
    :heading:

.. |br| raw:: html
 
   <br />

====================================
carbond.security.ApiKeyAuthenticator
====================================

Description for :class:`~carbond.security.ApiKeyAuthenticator` goes here

Properties
==========

.. class:: carbond.security.ApiKeyAuthenticator
    :noindex:
    :hidden:

    .. attribute:: carbond.security.ApiKeyAuthenticator.idGenerator

        .. csv-table::
            :class: details-table

            "idGenerator", :class:`~carbond.ObjectIdGenerator`
            "Default", :class:`~carbond.ObjectIdGenerator`
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.security.ApiKeyAuthenticator.apiKeyLocation

        .. csv-table::
            :class: details-table

            "apiKeyLocation", :class:`string`
            "Default", ``header``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. attribute:: carbond.security.ApiKeyAuthenticator.apiKeyParameterName

        .. csv-table::
            :class: details-table

            "apiKeyParameterName", :class:`string`
            "Default", ``Api-Key``
            "Description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo    re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."


Methods
=======

.. class:: carbond.security.ApiKeyAuthenticator
    :noindex:
    :hidden:

    .. function:: carbond.security.ApiKeyAuthenticator.authenticate

        .. csv-table::
            :class: details-table

            "authenticate (*req*)", ""
            "Arguments", "**req** (:class:`express.request`): The current request object |br|"
            "Returns", :class:`undefined`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.security.ApiKeyAuthenticator.findUser

        .. csv-table::
            :class: details-table

            "findUser (*apiKey*)", ""
            "Arguments", "**apiKey** (:class:`string`): Lorem ipsum dolor sit amet |br|"
            "Returns", ``undefined``
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.security.ApiKeyAuthenticator.generateApiKey

        .. csv-table::
            :class: details-table

            "generateApiKey ()", ""
            "Arguments", ``undefined``
            "Returns", :class:`string`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.security.ApiKeyAuthenticator.getAuthenticationHeaders

        .. csv-table::
            :class: details-table

            "getAuthenticationHeaders ()", ""
            "Arguments", ``undefined``
            "Returns", :class:`object`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."
            