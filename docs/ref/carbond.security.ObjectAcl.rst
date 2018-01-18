.. class:: carbond.security.ObjectAcl
    :heading:

.. |br| raw:: html

   <br />

==========================
carbond.security.ObjectAcl
==========================
*extends* :class:`~carbond.security.Acl`

ObjectAcl description

Instance Properties
-------------------

.. class:: carbond.security.ObjectAcl
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


    .. attribute:: object

       :type: xxx
       :required:

       xxx


    .. attribute:: ownerField

       :type: xxx
       :required:

       xxx


    .. attribute:: permissionDefinitions

       :type: xxx
       :required:

       xxx


Methods
-------

.. class:: carbond.security.ObjectAcl
    :noindex:
    :hidden:

    .. function:: and(acl)

        :inheritedFrom: :class:`~carbond.security.Acl`
        :param acl: The second ACL
        :type acl: :class:`~carbond.security.Acl`
        :rtype: :class:`~carbond.security.Acl`

        Generates an ACL that is the logical conjunction of this ACL and a second ACL

    .. function:: doSanitize(value, user, filterArrays, acl)

        :param value: xxx
        :type value: xxx
        :param user: xxx
        :type user: xxx
        :param filterArrays: xxx
        :type filterArrays: xxx
        :param acl: xxx
        :type acl: xxx
        :returns: xxx
        :rtype: xxx

        doSanitize description

    .. function:: doSanitizeArray(arr, user, filterArrays, acl)

        :param arr: xxx
        :type arr: xxx
        :param user: xxx
        :type user: xxx
        :param filterArrays: xxx
        :type filterArrays: xxx
        :param acl: xxx
        :type acl: xxx
        :throws: Error xxx
        :returns: xxx
        :rtype: xxx

        doSanitizeArray

    .. function:: doSanitizeObject(obj, user, filterArrays, acl)

        :param obj: xxx
        :type obj: xxx
        :param user: xxx
        :type user: xxx
        :param filterArrays: xxx
        :type filterArrays: xxx
        :param acl: xxx
        :type acl: xxx
        :returns: xxx
        :rtype: xxx

        doSanitizeObject description

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

    .. function:: isOwner(user, object)

        :param user: xxx
        :type user: xxx
        :param object: xxx
        :type object: xxx
        :returns: xxx
        :rtype: xxx

        isOwner description

    .. function:: or(acl)

        :inheritedFrom: :class:`~carbond.security.Acl`
        :param acl: The second ACL
        :type acl: :class:`~carbond.security.Acl`
        :rtype: :class:`~carbond.security.Acl`

        or Generates an ACL that is the logical disjunction of this ACL and a second ACL

    .. function:: sanitize(value, user, filterSingleValue, filterArrays, acl)

        :param value: xxx
        :type value: xxx
        :param user: xxx
        :type user: xxx
        :param filterSingleValue: xxx
        :type filterSingleValue: xxx
        :param filterArrays: xxx
        :type filterArrays: xxx
        :param acl: xxx
        :type acl: xxx
        :throws: Error xxx
        :returns: xxx
        :rtype: xxx

        Processes values such that if there exist objects with acls that deny read access, they will be forbidden or sanitized appropriately. If the value is an array of Objects, and there exists an Object in the array that has an __acl__ that denies read access, a 403 will be returned, unless filterArrayValues is true, in which case such objects will be removed from the result array If the value is an Object, and has an __acl__ that denies read access a 403 will be returned unless filterSingleValie is true (used by insert for example). XXX? If the value is an Object or array of Objects, all Objects returned will have properties denited byu an __acl__ removed such that the Objects returned are sanitized of any properties the user does not have permission to read

    .. function:: sanitize(user, filterSingleValue, filterArrays, acl)

        :param user: xxx
        :type user: xxx
        :param filterSingleValue: xxx
        :type filterSingleValue: xxx
        :param filterArrays: xxx
        :type filterArrays: xxx
        :param acl: xxx
        :type acl: xxx
        :returns: xxx
        :rtype: xxx

        sanitize
