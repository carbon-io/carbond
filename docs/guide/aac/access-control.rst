.. _access-control-ref:

==============
Access Control
==============

.. toctree::

:js:class:`~carbond.Service`\'s accomplish access control by way of ACLs or
*Access Control Lists*.

ACLs
----

Carbond provides a very generic and extensible ACL framework. In their most
generic form, :js:class:`~carbond.security.Acl` objects map *Users* and *Groups*
to a set of *Permissions* which govern access to some entity.

In practice you will use one of the pre-packaged ACL types to gate access to
your :js:class:`~carbond.Endpoint`\'s and their
:js:class:`~carbond.Operation`\'s.

Endpoint ACLs
-------------

All :js:class:`~carbond.Endpoint`\'s can be configured with an
:js:class:`~carbond.security.EndpointAcl` to govern which endpoint
:js:class:`~carbond.Operation`\'s can be accessed by users.

:js:class:`~carbond.EndpointAcl`\s defined the following permissions, one for
each HTTP method:

* ``get``
* ``post``
* ``put``
* ``patch``
* ``delete``
* ``head``
* ``options``

All permissions default to ``false`` except the ``options`` permission
which defaults to ``true``.

Here is an example of a :js:class:`~carbond.Service` using an
:js:class:`~carbond.security.EndpointAcl`:

.. literalinclude:: ../../code-frags/standalone-examples/ServiceSimpleAuthorizationExample.js
    :language: javascript
    :linenos:
    :named-sections: access-control-endpointACLExample
    :dedent: 2
    :emphasize-lines: 16-53

Collection ACLs
---------------

``CollectionAcl``\s are similar to ``EndpointAcl``\s except that they
define a set of permissions that matches the ``Collection`` interface.

``CollectionAcl``\s define the following permissions:

.. todo:: revisit as collection interface settles

* ``insert``
* ``find``
* ``update``
* ``remove``
* ``saveObject``
* ``findObject``
* ``updateObject``
* ``removebject``

All permissions default to ``false``.

Here is an example of a ``Service`` using a ``CollectionAcl`` on a ``MongoDBCollection``:

.. literalinclude:: ../../code-frags/standalone-examples/ServiceSimpleAuthorizationExample.js
    :language: javascript
    :linenos:
    :named-sections: access-control-collectionACLExample
    :dedent: 2
    :emphasize-lines: 18-55

Re-using ACLs across multiple Endpoints
---------------------------------------

In some cases you may wish to re-use the same ACL across many
``Endpoints``\s. To do this you can simply define your ACL as its own
component and then reference it in your ``Endpoint``.

**Example**

MyAcl.js:

.. literalinclude:: ../../code-frags/standalone-examples/MyAcl.js
    :language: javascript
    :linenos:
    :named-sections: access-control-aclReuseExampleHeader,access-control-aclReuseExampleFooter

Now you can reference this ACL from any ``Endpoint`` that wished to
use that ACL:

.. literalinclude:: ../../code-frags/standalone-examples/ServiceExternalACLExample.js
    :language: javascript
    :linenos:
    :emphasize-lines: 23
