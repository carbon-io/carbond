Authentication
----------

Datanode comes with a pluggable authentication system along with several out-of-the-box ```Authenticator```s:

* An ```HttpBasicAuthenticator```
* An ```ApiKeyAuthenticator``` 
* An ```OauthAuthenticator``` _(not yet implemented)_

Custom Authenticators
----------

You can define your own custom ```Authenticator```s by creating an instance of ```Authenicator``` (or a subclass) with a custom ```authenticate``` method.  

```node
o({
  _type: 'datanode/Authenticator',
  
  authenticate: function(req) {
    var user = figureOutWhoUserIs();
    return user;
  }
})
```
