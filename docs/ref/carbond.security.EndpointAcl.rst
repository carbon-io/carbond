.. class:: carbond.security.EndpointAcl
    :heading:

.. |br| raw:: html

   <br />

============================
carbond.security.EndpointAcl
============================
*extends* :class:`~carbond.security.Acl`

EndpointAcl description

Instance Properties
-------------------

.. class:: carbond.security.EndpointAcl
    :noindex:
    :hidden:

    .. attribute:: entries

       :inheritedFrom: :class:`~carbond.security.Acl`
       :type: :class:`~carbond.security.AclEntry[]`
       :default: ``[]``

       description An array of ACL descriptors. Each descriptor provides the mechanism to match against a user object by ID or group membership and determine the whether or not a request is allowed for the user and operation using some predicate.


    .. attribute:: groupDefinitions

       :inheritedFrom: :class:`~carbond.security.Acl`
       :type: Object.<string, (function()|string)>
       :default: ``{}``

       This is mapping of group names to "extractors". An extractor can be a function or a string. If it is a function, it should take a user object as its sole argument and return the group name as a string. Otherwise, it should be a string in property path notation (e.g., "foo.bar.baz").


    .. attribute:: permissionDefinitions

       :type: object
       :required:

       mapping of permissions to defaults


    .. attribute:: selfAndBelow

       :type: boolean
       :default: false

       xxx


Methods
-------

.. class:: carbond.security.EndpointAcl
    :noindex:
    :hidden:

    .. function:: and(acl)

        :inheritedFrom: :class:`~carbond.security.Acl`
        :param acl: The second ACL
        :type acl: :class:`~carbond.security.Acl`
        :rtype: :class:`~carbond.security.Acl`

        Generates an ACL that is the logical conjunction of this ACL and a second ACL

    .. function:: hasPermission(user, permission, env)

        :inheritedFrom: :class:`~carbond.security.Acl`
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

        :inheritedFrom: :class:`~carbond.security.Acl`
        :param acl: The second ACL
        :type acl: :class:`~carbond.security.Acl`
        :rtype: :class:`~carbond.security.Acl`

        or Generates an ACL that is the logical disjunction of this ACL and a second ACL
