==============
Authentication
==============

.. toctree::

A :js:class:`~carbond.Service` accomplishes user authentication via
:js:class:`~carbond.security.Authenticator` components which are responsible for
associating incoming requests with users.

Every :js:class:`~carbond.Service` can be configured with an
:js:class:`~carbond.security.Authenticator`. When so configured, the
:js:class:`~carbond.Service` will dispatch each HTTP request to that
:js:class:`~carbond.security.Authenticator`\'s
:js:func:`~carbond.security.Authenticator.authenticate` method. This method will
use credentials in the request (e.g., HTTP Basic Auth credentials, API-key,
etc...) to authenticate and return the user associated with those credentials,
if one exists. The :js:class:`~carbond.Service` will then store the resolved
user object in the :express4:`req` (e.g., ``req.user``).

Built-in authenticators
-----------------------

Carbond comes with several out-of-the-box :js:class:`~carbond.Authenticator`\s:

* :js:class:`~carbond.security.HttpBasicAuthenticator`` - Base class for
  implementing HTTP basic authentication.
* :js:class:`~carbond.security.MongoDBHttpBasicAuthenticator` - An
  :js:class:`~carbond.security.HttpBasicAuthenticator` backed by MongoDB. 
* :js:class:`~carbond.security.ApiKeyAuthenticator` - Base class for
  implementing API-key based authentication.
* :js:class:`~carbond.security.MongoDBApiKeyAuthenticator`` - An
  :js:class:`~carbond.security.ApiKeyAuthenticator` backed by MongoDB.
* :js:class:`~carbond.security.OauthAuthenticator` *(not yet implemented)*


Custom Authenticators 
---------------------

You can define your own custom :js:class:`~carbond.security.Authenticator`\s by
creating an instance of :js:class:`~carbond.security.Authenicator` (or a
subclass) with a custom :js:class:`~carbond.security.Authenticator.authenticate`
method.

.. literalinclude:: ../../code-frags/standalone-examples/ServiceSimpleAuthenticationExample.js
    :language: javascript
    :linenos:
    :lines: 24-30
    :dedent: 6
    :emphasize-lines: 3

.. code-block: javascript
  :linenos:
  :emphasize-lines: 5
  o({
    _type: carbon.carbond.security.Authenticator,
    authenticate: function(req) {
      var user = figureOutWhoUserIs();
      return user;
    }
  })

Examples
--------

**HTTP Basic authentication**

.. literalinclude:: ../../code-frags/standalone-examples/ServiceSimpleAuthenticationExample.js
    :language: javascript
    :linenos:
    :lines: 45-65
    :dedent: 2
    :emphasize-lines: 6-11, 16

.. code-block: javascript
  :linenos:
  :emphasize-lines: 4 - 9, 14
  module.exports = o({
    _type: carbon.carbond.Service,
    port: 8888,
    authenticator: o({
      _type: carbon.carbond.security.MongoDBHttpBasicAuthenticator,
      userCollection: "users",
      usernameField: "username",
      passwordField: "password"
    }),      
    endpoints: {
      hello: o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          return { msg: "Hello " + req.user.email}
        }
      })
    }
  })

**API Key authentication**

.. literalinclude:: ../../code-frags/standalone-examples/ServiceSimpleAuthenticationExample.js
    :language: javascript
    :linenos:
    :lines: 69-90
    :dedent: 2
    :emphasize-lines: 6-12, 17

.. code-block: javascript
  :linenos:
  :emphasize-lines: 4 - 10, 15
  module.exports = o({
    _type: carbon.carbond.Service,
    port: 8888,
    authenticator: o({
      _type: carbon.carbond.security.MongoDBApiKeyAuthenticator,
      apiKeyParameterName: "API_KEY",
      apiKeyLocation: "header", // can be "header" or "query"
      userCollection: "users",
      apiKeyUserField: "apiKey"
    }),
    endpoints: {
      hello: o({
        _type: carbon.carbond.Endpoint,
        get: function(req) {
          return { msg: "Hello " + req.user.email}
        }
      })
    }
  })

**Custom authentication**

.. literalinclude:: ../../code-frags/standalone-examples/ServiceSimpleAuthenticationExample.js
    :language: javascript
    :linenos:
    :lines: 9,21-40
    :dedent: 2
    :emphasize-lines: 5-11, 16

.. code-block: javascript
  :linenos:
  :emphasize-lines: 4 - 10, 15
  module.exports = o({
    _type: carbon.carbond.Service,    
    port: 8888,
    authenticator: o({
      _type: carbon.carbond.security.Authenticator,
      authenticate: function(req) {
        var user = figureOutWhoUserIs();
        return user;
      }
    }),
    endpoints: {
      hello: o({
        _type: carbon.carbond.Enpoint,
        get: function(req) {
          return { msg: "Hello " + req.user.email}
        }
      })
    }
  })
