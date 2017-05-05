===================
Database management
===================

.. toctree::

Carbond makes it easy to manage connections to multiple databases in
your application. The ``Service`` class has two properties for
specifying database URIs:

- :js:attr:`~carbond.Service.dbUri`: A connection string specified as a `MongoDB
  URI`_ (e.g.  ``"mongodb://username:password@localhost:27017/mydb"``). The
  :js:class:`~carbond.Service` will connect to this database on startup. The
  application can then reference a connection to this database via the
  :js:class:`~carbond.Service.db` property on the :js:class:`~carbond.Service`.

- :js:attr:`~carbond.Service.dbUris`: A mapping of names to `MongoDB URI`_\s .
  The :js:class:`~carbond.Service` will connect to these databases on startup.
  The application can reference a connection to these databases via the
  :js:class:`~carbond.Service` as ``dbs[<name>]`` or ``dbs.<name>``.

**Examples**

A :js:class:`~carbond.Service` with a single db connection:

.. literalinclude:: ../code-frags/standalone-examples/ServiceSingleDBConnectionExample.js
    :language: javascript
    :lines: 5-
    :linenos:
    :emphasize-lines: 5, 10

A :js:class:`~carbond.Service` that connects to multiple databases:

.. literalinclude:: ../code-frags/standalone-examples/ServiceMultipleDBConnectionExample.js
    :language: javascript
    :lines: 7-
    :linenos: 
    :emphasize-lines: 5-8, 13-16, 22-25

.. _MongoDB URI: http://docs.mongodb.org/manual/reference/connection-string/
