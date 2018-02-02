=====================================
Collection Operation (REST) Interface
=====================================

The :js:class:`~carbond.collections.Collection` class endeavors to handle much
of the HTTP boilerplate code that you would typically have to implement to build
an API. The following sections aim to clarify the behavior of
:js:class:`~carbond.collections.Collection` operations at the HTTP layer.

POST /<collection>
------------------

``POST`` is one of the more interesting HTTP verbs in the context of a Carbon
Collection. Unlike the rest of the HTTP verbs, ``POST`` is only allowed on the
Collection URL (e.g., ``/<collection>``) and not a Collection object URL (e.g.
``/<collection>/:<id>``). Instead ``POST``\ ing to the Collection supports both
the ``insert`` and the ``insertObject`` operations (if enabled), routing the
request to the appropriate handler based on the type of the body.

In the following tables, ``bulk`` will refer to requests whose body is an
``array`` and ``object`` will refer to requests whose body is a single
``object``.

.. list-table:: Request Parameters
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Request Type
      - Location
      - Description
    * - ``body``
      - ``bulk``
      - body
      - An ``array`` of objects
    * - ``body``
      - ``object``
      - body
      - An ``object``

.. list-table:: Response Headers
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Request Type
      - Description
    * - ``Location``
      - ``bulk``
      - Contains the URL to retrieve all inserted objects in ID query format
        (see: :ref:`FindConfig <collection-operation-configuration-FindConfig>`)
    * - ``Location``
      - ``object``
      - Contains the object URL
    * - :js:attr:`~carbond.collections.Collection.idHeaderName`
      - ``bulk``
      - Contains the EJSON serialized IDs of the inserted objects
    * - :js:attr:`~carbond.collections.Collection.idHeaderName`
      - ``object``
      - Contains the EJSON serialized ID of the inserted object

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Request Type
      - Description
    * - ``201``
      - ``bulk``
      - The objects were successfully inserted. The response body will contain
        the objects if configured.
    * - ``201``
      - ``object``
      - The object was successfully inserted. The response body will contain the
        object if configured.
    * - ``400``
      - ``bulk`` and ``object``
      - The request was malformed
    * - ``403``
      - ``bulk`` and ``object``
      - The request is not authorized
    * - ``500``
      - ``bulk`` and ``object``
      - There was an internal error processing the request

GET /<collection>
-----------------

.. list-table:: Request Parameters (note, ``<idParameterName>`` is configurable on ``Collection``)
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Location
      - Description
    * - <:js:attr:`~carbond.collections.Collection.idParameterName`>
      - query
      - Contains the IDs of objects to be retrieved. This parameter is only
        present if :js:attr:`~carbond.collections.FindConfig.supportsIdQuery` is
        ``true``.
    * - ``page``
      - query
      - Contains the page number from which objects are to be retrieved. This
        parameter is only present if
        :js:attr:`~carbond.collections.FindConfig.supportsPagination` is true
    * - ``pageSize``
      - query
      - Specifies the number of objects per page. This is only present if
        :js:attr:`~carbond.collections.FindConfig.supportsPagination` is true.
        The default value for page size is configured using
        :js:attr:`~carbond.collections.FindConfig.pageSize`
        (note, if :js:attr:`~carbond.collections.FindConfig.maxPageSize` is
        specified, then the minimum of the two will be used)
    * - ``skip``
      - query
      - The number of objects in the Collection to skip before returning results
    * - ``limit``
      - query
      - The maximum number of objects to return in a result

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Description
    * - ``200``
      - The response body will contain a list of objects in the Collection
        subject to the parameters passed in the request
    * - ``400``
      - The request was malformed
    * - ``403``
      - The request is not authorized
    * - ``500``
      - There was an internal error processing the request

PUT /<collection>
-----------------

.. list-table:: Request Parameters
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Location
      - Description
    * - ``body``
      - body
      - A list of objects to replace to Collection

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Description
    * - ``200``
      - The Collection was successfully replaced. The new Collection will be
        returned in the response if
        :js:attr:`~carbond.collections.SaveConfig.returnsSavedObjects` is
        ``true``.
    * - ``204``
      - The Collection was successfully replaced. The response body will be
        empty if
        :js:attr:`~carbond.collections.SaveConfig.returnsSavedObjects` is
        ``false``.
    * - ``400``
      - The request was malformed
    * - ``403``
      - The request is not authorized
    * - ``500``
      - There was an internal error processing the request


PATCH /<collection>
-------------------

.. list-table:: Request Parameters
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Location
      - Description
    * - ``update``
      - body
      - An update spec
    * - ``upsert``
      - query
      - A boolean value indicating whether an upsert is desired. This parameter
        is only present if
        :js:attr:`~carbond.collections.UpdateConfig.supportsUpsert` is true.

.. list-table:: Response Headers
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Description
    * - ``Location``
      - Contains the URL to retrieve all upserted objects in ID query format
        (see: :ref:`FindConfig <collection-operation-configuration-FindConfig>`)
    * - :js:attr:`~carbond.collections.Collection.idHeaderName`
      - Contains the EJSON serialized IDs of the upserted objects

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Description
    * - ``200``
      - Objects were successfully updated. The number of updated objects will be
        returned in the body.
    * - ``201``
      - Objects were successfully upserted. This is only possible if
        :js:attr:`~carbond.collections.UpdateConfig.supportsUpsert` is true. The
        number of updated objects will be returned if
        :js:attr:`~carbond.collections.UpdateConfig.returnsUpsertedObjects` is
        false, otherwise the objects will be returned in the response body.
    * - ``400``
      - The request was malformed
    * - ``403``
      - The request is not authorized
    * - ``500``
      - There was an internal error processing the request

DELETE /<collection>
--------------------

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Description
    * - ``200``
      - Returns the list of objects removed in the response body if
        :js:attr:`~carbond.collections.RemoveConfig.returnsRemovedObjects` is
        ``true`` or the number of objects removed if not.
    * - ``400``
      - The request was malformed
    * - ``403``
      - The request is not authorized
    * - ``500``
      - There was an internal error processing the request

GET /<collection>/:<id>
-----------------------

.. list-table:: Request Parameters (note, ``idPathParameterName`` is configurable on ``Collection``)
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Location
      - Description
    * - <:js:attr:`~carbond.collections.Collection.idPathParameterName`>
      - path
      - The ID component of the Collection object URL. Identifies a specific
        object in the Collection.

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Description
    * - ``200``
      - The response body will contain the object whose ID matches the value
        passed in <:js:attr:`~carbond.collections.Collection.idPathParameterName`>
    * - ``400``
      - The request was malformed
    * - ``403``
      - The request is not authorized
    * - ``404``
      - The object was not found
    * - ``500``
      - There was an internal error processing the request

PUT /<collection>/:<id>
-----------------------

.. list-table:: Request Parameters (note, ``idPathParameterName`` is configurable on ``Collection``)
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Location
      - Description
    * - <:js:attr:`~carbond.collections.Collection.idPathParameterName`>
      - path
      - The ID component of the Collection object URL. Identifies a specific
        object in the Collection.
    * - ``body``
      - body
      - An object to save

.. list-table:: Response Headers
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Description
    * - ``Location``
      - Contains the URL of the new object. Note, this is only possible if
        :js:attr:`~carbond.collections.SaveObjectConfig.supportsUpsert` is ``true``.
    * - :js:attr:`~carbond.collections.Collection.idHeaderName`
      - Contains the EJSON serialized ID of the new object. Note, this is only
        possible if
        :js:attr:`~carbond.collections.SaveObjectConfig.supportsUpsert` is ``true``.

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Description
    * - ``200``
      - The response body will contain the saved object. This response code is
        only possible if
        :js:attr:`~carbond.collections.SaveObjectConfig.returnsSavedObject` is
        ``true``.
    * - ``201``
      - This response code is only possible if
        :js:attr:`~carbond.collections.SaveObjectConfig.supportsUpsert` is
        ``true``. If
        :js:attr:`~carbond.collections.SaveObjectConfig.returnsSavedObject` is
        ``true``, the new object will be returned, otherwise the response body
        will be empty.
    * - ``204``
      - The response body will be empty. This response code is
        only possible if
        :js:attr:`~carbond.collections.SaveObjectConfig.returnsSavedObject` is
        ``false``.
    * - ``400``
      - The request was malformed
    * - ``403``
      - The request is not authorized
    * - ``404``
      - The object was not found. This response code is only possible if
        :js:attr:`~carbond.collections.SaveObjectConfig.supportsUpsert` is
        ``false``.
    * - ``500``
      - There was an internal error processing the request

PATCH /<collection>/:<id>
-------------------------

.. list-table:: Request Parameters (note, ``idPathParameterName`` is configurable on ``Collection``)
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Location
      - Description
    * - <:js:attr:`~carbond.collections.Collection.idPathParameterName`>
      - path
      - The ID component of the Collection object URL. Identifies a specific
        object in the Collection.
    * - ``update``
      - body
      - An update spec
    * - ``upsert``
      - query
      - A boolean value indicating whether an upsert is desired. This parameter
        is only present if
        :js:attr:`~carbond.collections.UpdateObjectConfig.supportsUpsert` is true.

.. list-table:: Response Headers
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Description
    * - ``Location``
      - Contains the URL of the upserted object
    * - :js:attr:`~carbond.collections.Collection.idHeaderName`
      - Contains the EJSON serialized ID of the upserted object

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Description
    * - ``200``
      - The object was successfully updated. The number of updated objects (1) will be
        returned in the body.
    * - ``201``
      - The object was successfully upserted. This is only possible if
        :js:attr:`~carbond.collections.UpdateObjectConfig.supportsUpsert` is true. The
        number of updated objects (1) will be returned if
        :js:attr:`~carbond.collections.UpdateObjectConfig.returnsUpsertedObject` is
        false, otherwise the object will be returned in the response body.
    * - ``400``
      - The request was malformed
    * - ``403``
      - The request is not authorized
    * - ``404``
      - The object was not found. This response code is only possible if
        :js:attr:`~carbond.collections.UpdateObjectConfig.supportsUpsert` is
        ``false``.
    * - ``500``
      - There was an internal error processing the request

DELETE /<collection>/:<id>
--------------------------

.. list-table:: Request Parameters (note, ``idPathParameterName`` is configurable on ``Collection``)
    :header-rows: 1
    :class: collection-rest-table

    * - Name
      - Location
      - Description
    * - <:js:attr:`~carbond.collections.Collection.idPathParameterName`>
      - path
      - The ID component of the Collection object URL. Identifies a specific
        object in the Collection.

.. list-table:: Status Codes
    :header-rows: 1
    :class: collection-rest-table

    * - Status
      - Description
    * - ``200``
      - The object was successfully removed. If
        :js:attr:`~carbond.collections.RemoveObjectConfig.returnsRemovedObject`
        is true, the body will contain the object, otherwise the number of
        removed objects (1) will be returned.
    * - ``400``
      - The request was malformed
    * - ``403``
      - The request is not authorized
    * - ``404``
      - The object was not found
    * - ``500``
      - There was an internal error processing the request
