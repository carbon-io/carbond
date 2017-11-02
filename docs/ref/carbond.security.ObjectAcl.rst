.. class:: carbond.security.ObjectAcl
    :heading:

.. |br| raw:: html

   <br />

==========================
carbond.security.ObjectAcl
==========================
*extends* :class:`~carbond.security.Acl`

ObjectAcl description

Properties
----------

.. class:: carbond.security.ObjectAcl
    :noindex:
    :hidden:

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

    .. function:: doSanitize(value, user, filterArrays, acl)

        :param value: xxx
        :type value: xxx
        :param user: xxx
        :type user: xxx
        :param filterArrays: xxx
        :type filterArrays: xxx
        :param acl: xxx
        :type acl: xxx
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
        :rtype: xxx

        doSanitizeObject description

    .. function:: isOwner(user, object)

        :param user: xxx
        :type user: xxx
        :param object: xxx
        :type object: xxx
        :rtype: xxx

        isOwner description

    .. function:: sanitize(user, filterSingleValue, filterArrays, acl)

        :param user: xxx
        :type user: xxx
        :param filterSingleValue: xxx
        :type filterSingleValue: xxx
        :param filterArrays: xxx
        :type filterArrays: xxx
        :param acl: xxx
        :type acl: xxx
        :rtype: xxx

        sanitize

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
        :rtype: xxx

        Processes values such that if there exist objects with acls that deny read access, they will be forbidden or sanitized appropriately. If the value is an array of Objects, and there exists an Object in the array that has an __acl__ that denies read access, a 403 will be returned, unless filterArrayValues is true, in which case such objects will be removed from the result array If the value is an Object, and has an __acl__ that denies read access a 403 will be returned unless filterSingleValie is true (used by insert for example). XXX? If the value is an Object or array of Objects, all Objects returned will have properties denited byu an __acl__ removed such that the Objects returned are sanitized of any properties the user does not have permission to read
