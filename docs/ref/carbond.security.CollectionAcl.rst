.. class:: carbond.security.CollectionAcl
    :heading:

.. |br| raw:: html
 
   <br />

==============================
carbond.security.CollectionAcl
==============================
*extends* :class:`~carbond.security.EndpointAcl`

Description for :class:`~carbond.security.CollectionAcl` goes here

Properties
==========

.. class:: carbond.security.CollectionAcl
    :noindex:
    :hidden:

    .. attribute:: carbond.security.CollectionAcl.permissionDefinitions

        .. csv-table::
            :class: details-table

            "permissionDefinitions", :class:`object`
            "Default", "{ ``find``: ``false`` |br|
               ``insert``: ``false`` |br|
               ``update``: ``false`` |br|
               ``remove``: ``false`` |br|
               ``findObject``: ``false`` |br|
               ``saveObject``: ``false`` |br|
               ``updateObject``: ``false`` |br|
               ``removeObject``: ``false`` }"
            "Description", "A mapping of permissions to defaults."


Methods
=======

.. class:: carbond.security.CollectionAcl
    :noindex:
    :hidden:

    .. function:: carbond.security.CollectionAcl.hasPermission

        .. csv-table::
            :class: details-table

            "hasPermission (*user, permission, env*)", "overrides :attr:`~carbond.security.Acl.hasPermission`"
            "Arguments", "**user** (:class:`object`): Lorem ipsum dolor sit amet |br|
            **permission** (:class:`string`): Lorem ipsum dolor sit amet |br|
            **env** (:class:`object`): Lorem ipsum dolor sit amet |br|"
            "Returns", :class:`boolean`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."