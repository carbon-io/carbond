.. class:: carbond.security.Acl
    :heading:

.. |br| raw:: html

   <br />

====================
carbond.security.Acl
====================

User and group based access control for endpoints

Instance Properties
-------------------

.. class:: carbond.security.Acl
    :noindex:
    :hidden:

    .. attribute:: entries

       :type: :class:`~carbond.security.AclEntry[]`
       :default: ``[]``

       description An array of ACL descriptors. Each descriptor provides the mechanism to match against a user object by ID or group membership and determine the whether or not a request is allowed for the user and operation using some predicate.


    .. attribute:: groupDefinitions

       :type: Object.<string, (function()|string)>
       :default: ``{}``

       This is mapping of group names to "extractors". An extractor can be a function or a string. If it is a function, it should take a user object as its sole argument and return the group name as a string. Otherwise, it should be a string in property path notation (e.g., "foo.bar.baz").


    .. attribute:: permissionDefinitions

       :type: Object.<string, (boolean|function())>
       :default: ``{}``

       A map of operation name (e.g., 'get' or, for collections, 'find') to predicate. The predicate can be a `boolean` or `Function`. If it is a function, it should take a user and env as arguments.


Methods
-------

.. class:: carbond.security.Acl
    :noindex:
    :hidden:

    .. function:: and(acl)

        :param acl: The second ACL
        :type acl: :class:`~carbond.security.Acl`
        :rtype: :class:`~carbond.security.Acl`

        Generates an ACL that is the logical conjunction of this ACL and a second ACL

    .. function:: hasPermission(user, permission, env)

        :param user: A user object
        :type user: Object
        :param permission: The name of the operation being authorized
        :type permission: string
        :param env: Request context (e.g., ``{req: req}``)
        :type env: Object.<string, Object>
        :throws: Error 
        :returns: Whether or not the request is authorized
        :rtype: boolean

        Determines whether the current request is allowed based on the current user (as returned by :class:`~carbond.security.Authenticator.authenticate`) and operation

    .. function:: or(acl)

        :param acl: The second ACL
        :type acl: :class:`~carbond.security.Acl`
        :rtype: :class:`~carbond.security.Acl`

        or Generates an ACL that is the logical disjunction of this ACL and a second ACL

.. _carbond.security.Acl.AclEntry:

.. rubric:: Typedef: AclEntry

Properties
----------

    .. attribute:: user

       :type: string | Object.<string, (string|function())>
       :required:

       This is either a "user spec" or a "group spec". A "user spec" is simply a string. This string either maps to a user ID or it is the wildcard character ("*"), thereby matching any user. A "group spec" is an object with a single key. The value for this key is the group identifier we expect to find in a user object. To extract this group identifier, the same key is used to look up an "extractor" in :class:`~carbond.security.Acl.groupDefinitions`.


    .. attribute:: permissions

       :type: Object.<string, (boolean|function())>
       :required:

       A map of operation name (e.g., 'get' or, for collections, 'find') to predicate. The predicate can be a `boolean` or `Function`. If it is a function, it should take a user and env as arguments.

