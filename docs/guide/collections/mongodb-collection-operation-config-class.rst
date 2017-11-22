=========================================
MongoDBCollection Operation Configuration
=========================================

The :js:class:`~carbond.mongodb.MongoDBCollection` implementation overrides
:js:class:`~carbond.collection.Collection`\ 's configuration class members with
the following classes:

- :js:class:`~carbond.mongodb.MongoDBInsertConfig`
- :js:class:`~carbond.mongodb.MongoDBFindConfig`
- :js:class:`~carbond.mongodb.MongoDBSaveConfig`
- :js:class:`~carbond.mongodb.MongoDBUpdateConfig`
- :js:class:`~carbond.mongodb.MongoDBRemoveConfig`
- :js:class:`~carbond.mongodb.MongoDBInsertObjectConfig`
- :js:class:`~carbond.mongodb.MongoDBFindObjectConfig`
- :js:class:`~carbond.mongodb.MongoDBSaveObjectConfig`
- :js:class:`~carbond.mongodb.MongoDBUpdateConfig`
- :js:class:`~carbond.mongodb.MongoDBRemoveConfig`

Note, these configuration classes are resolved via the appropriate class
member (e.g., :js:attr:`~carbond.mongodb.MongoDBCollection.InsertConfigClass`
resolves to :js:class:`~carbond.mongodb.MongoDBInsertConfig`).

All additions to and/or restrictions placed on individual operation
configurations will be documented in the following sections. Config classes that
do not add or remove functionality will be omitted.

MongoDBFindConfig
~~~~~~~~~~~~~~~~~~~

:js:class:`~carbond.mongodb.MongoDBFindConfig` makes a few additions to the base
configuration class. It adds three parameters, ``sort``, ``project``, and
``query``. ``sort`` and ``project`` allow you to specify a sort order for the
result set (see: `MongoDB sort
<https://docs.mongodb.com/manual/reference/method/cursor.sort/#cursor.sort>`_)
and a subset of fields to return for each object (see: `MongoDB projection
<https://docs.mongodb.com/manual/reference/glossary/#term-projection>`_)
respectively.  Query support is configurable via the
:js:attr:`~carbond.mongodb.MongoDBFindConfig.supportsQuery` property. If support
is enabled, the ``query`` parameter will be added to the list of parameters for
that query (see: `MongoDB query
<https://docs.mongodb.com/manual/reference/operator/query/>`_).

MongoDBUpdateConfig
~~~~~~~~~~~~~~~~~~~

:js:class:`~carbond.mongodb.MongoDBUpdateConfig` removes support for
:js:attr:`~carbond.collections.UpdateConfig.returnsUpsertedObjects`.
Additionally, it adds query support via the ``query`` parameter.

.. todo:: should this have "supportsQuery"?

MongoDBRemoveConfig
~~~~~~~~~~~~~~~~~~~

Similar to :js:class:`~carbond.mongodb.MongoDBFindConfig` and
:js:class:`~carbond.mongodb.MongoDBUpdateConfig`,
:js:class:`~carbond.mongodb.MongoDBRemoveConfig` adds support for queries via
the ``query`` parameter. This support is enabled by default, but can be
configured via the :js:attr:`~carbond.mongodb.MongoDBRemoveConfig`.

MongoDBUpdateObject
~~~~~~~~~~~~~~~~~~~

:js:class:`~carbond.mongodb.MongoDBUpdateObjectConfig` removes support for
:js:attr:`~carbond.collections.UpdateConfig.returnsUpsertedObject`.

MongoDBRemoveObject
~~~~~~~~~~~~~~~~~~~

:js:class:`~carbond.mongodb.MongoDBRemoveObjectConfig` removes support for
:js:attr:`~carbond.collections.UpdateConfig.returnsRemovedObject`.

Access Control
==============

In addition to enabling / disabling operations, you may also gate operations via
access control policies (see: :ref:`access control <access-control-ref>`).

.. _json schema: http://json-schema.org/
.. _json patch: http://jsonpatch.com/
.. _mongo driver: http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html
