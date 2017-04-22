.. class:: carbond.security.EndpointAcl
    :heading:

.. |br| raw:: html
 
   <br />

==============================
carbond.security.EndpointAcl
==============================
*extends* :class:`~carbond.security.Acl`

Description for :class:`~carbond.security.EndpointAcl` goes here

Properties
==========

.. class:: carbond.security.EndpointAcl
    :noindex:
    :hidden:

    .. attribute:: carbond.security.EndpointAcl.permissionDefinitions

        .. csv-table::
            :class: details-table

            "permissionDefinitions", :class:`object`
            "Default", "{ ``find``: ``false`` |br|
               ``get``: ``false`` |br|
               ``put``: ``false`` |br|
               ``patch``: ``false`` |br|
               ``post``: ``false`` |br|
               ``delete``: ``false`` |br|
               ``head``: ``false`` |br|
               ``options``: ``true`` }"
            "Description", "A mapping of permissions to defaults"

    .. attribute:: carbond.security.EndpointAcl.selfAndBelow

        .. csv-table::
            :class: details-table

            "selfAndBelow", :class:`boolean`
            "Default", ``false``
            "Description", "If true, a permission name, or a function, EndpointAcl will apply to descendants"


Methods
=======

.. class:: carbond.security.EndpointAcl
    :noindex:
    :hidden:

    .. function:: carbond.security.EndpointAcl.hasPermission

        .. csv-table::
            :class: details-table

            "hasPermission (*user, permission, env*)", "overrides :attr:`~carbond.security.Acl.hasPermission`"
            "Arguments", "**user** (:class:`object`): Lorem ipsum dolor sit amet |br|
            **permission** (:class:`string`): Lorem ipsum dolor sit amet |br|
            **env** (:class:`object`): Lorem ipsum dolor sit amet |br|"
            "Returns", :class:`boolean`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."