.. class:: carbond.security.MongoDBHttpBasicAuthenticator
    :heading:

.. |br| raw:: html

   <br />

==============================================
carbond.security.MongoDBHttpBasicAuthenticator
==============================================
*extends* :class:`~carbond.security.HttpBasicAuthenticator`

An implemetation of :class:`~carbond.security.HttpBasicAuthenticator` using MongoDB. It queries a MongoDB collection to find a user with a username and password that matches the username and password sent with the request.

Properties
----------

.. class:: carbond.security.MongoDBHttpBasicAuthenticator
    :noindex:
    :hidden:

    .. attribute:: carbond.security.MongoDBHttpBasicAuthenticator.dbName

       :type: string
       :required:

       The name of the database to use if there are multiple databases on the parent Service (in :attr:`~carbond.service.dbs`)


    .. attribute:: carbond.security.MongoDBHttpBasicAuthenticator.userCollection

       :type: string
       :required:

       The name of the collection in which users are stored


Methods
-------

.. class:: carbond.security.MongoDBHttpBasicAuthenticator
    :noindex:
    :hidden:

    .. function:: carbond.security.MongoDBHttpBasicAuthenticator.findUser(username)

        :param username: The username sent by the client.
        :type username: string
        :throws: Error If the database or collection are undefined.
        :rtype: Object | undefined

        Queries the database for a user which has a username that matches the username sent in the request.
