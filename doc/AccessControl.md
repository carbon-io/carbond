Access Control
----------

The Object Server accomplishes access control by way of ACLs or _Access Control Lists_. 

There are two types of ACLs
* Endpoint ACLs
* Object ACLs

ACLs
----------

```node
{
  permissionDefinitions: { // map of permissions to defaults boolean values
    <string>: <boolean>
  },
  
  groupDefinitions: {
    <string>: <string> // map of role names to property paths (or function(user) --> value )
  },
  
  entries: { // actual ACL entries 
    <user-specifier(string)>: { // map of user specifier to list of permissions
      <permission(string)>: <permission-predicate>(boolean | function)>
    }
  }
}
```
