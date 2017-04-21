.. class:: carbond.security.Acl
    :heading:

.. |br| raw:: html
 
   <br />

====================
carbond.security.Acl
====================

Description for :class:`~carbond.security.Acl` goes here

Properties
==========

.. class:: carbond.security.Acl.
    :noindex:
    :hidden:

    .. attribute:: carbond.security.Acl.entries

        .. csv-table::
            :class: details-table

            "entries", :class:`object`
            "Default", ``[]``
            "Description", "This defines the actual access control list for the ACL as an array of *entry* objects each having a *user specifier* and a set of *permissions*. Each user specifier is either of the form ``user: <userId>`` or of the form ``user: {<group-name>: <value>}`` where ``group-name`` is one of the groups defined in ``groupDefinitions``. Each permission object is a mapping of a permisson (defined in ``permissionDefinitions``) to a *permission predicate*. Permission predicates are either simple boolean values or a function that takes a user object and returns a boolean value."

    .. attribute:: carbond.security.Acl.groupDefinitions

        .. csv-table::
            :class: details-table

            "groupDefinitions", :class:`object`
            "Default", ``{}``
            "Description", "This defines the set of group names that will be used in the ACL. Each entry defines a group by mapping it to a property path, as a ``string``, or a function that takes a user and returns a value. If provided with a property path the path is evaluated against the authenticated user when checking ACL permissions. By default there always exists a group with the name ``user`` to allow for individual users to be specified in ACL entries."

    .. attribute:: carbond.security.Acl.permissionDefinitions

        .. csv-table::
            :class: details-table

            "permissionDefinitions", :class:`object`
            "Default", ``{}``
            "Description", "This defines the set of permissions that can be used in this ACL by mapping default permission names, as ``strings``, to default values in the form of *permission predicates*. Permission predicates are either simple boolean values or a function that takes a user object and returns a boolean value."


Methods
=======

.. class:: carbond.collections.Collection
    :noindex:
    :hidden:

    .. function:: carbond.security.Acl.and

        .. csv-table::
            :class: details-table

            "and (*acl*)", ""
            "Arguments", "**acl** (:class:`object`): Lorem ipsum dolor sit amet |br|"
            "Returns", :class:`boolean`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.security.Acl.hasPermission

        .. csv-table::
            :class: details-table

            "hasPermission (*user, permission, env*)", ""
            "Arguments", "**user** (:class:`string`): Lorem ipsum dolor sit amet |br|
            **permission** (:class:`string`): Lorem ipsum dolor sit amet |br|
            **env** (:class:`object`): Lorem ipsum dolor sit amet |br|"
            "Returns", :class:`boolean`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.security.Acl.or

        .. csv-table::
            :class: details-table

            "or (*acl*)", ""
            "Arguments", "**acl** (:class:`object`): Lorem ipsum dolor sit amet |br|"
            "Returns", :class:`boolean`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

..  code-block:: javascript 

    {
      permissionDefinitions: { // map of permissions to defaults boolean values 
        <string>: <permission-predicate>(boolean | function) 
      },
      
      groupDefinitions: {
        <string>: <string> // map of group names to property paths (or function(user) --> value ) 
      },
      
      entries: [ // actual ACL entries 
        {
          user: <user-spec> { 
          permissions: { 
            <permission>: <function> | <boolean>
          }
        }
      ]
    }

**Example**

..  code-block:: javascript 

    {
      permissionDefinitions: { // This ACL has two permissions, read and write 
        read: false,
        write: false 
      },
      
      groupDefinitions: { // This ACL defines three groups, role, title, and region 
        role: 'role',
        title: function(user) { return user.title; },
        region: 'address.zip'
      },
      
      entries: [
        {
          user: { role: "Admin" },
          permissions: {
            "*": true 
          }
        },
        {
          user: { title: "CFO" },
          permissions: {
            read: true,
            write: true 
          }
        },
       {
          user: 1234,
          permissions: {
            read: true,
            write: false 
          }
        }
      ]
    }
