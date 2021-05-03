# BrowserCache

BrowserCache is a library that aims to provide a better abstraction on top of localStorage and sessionStorage but can be used for other types of "storage" implementations.

As long as the storage implementation adheres to the below interface.

- getItem(key) - returns a string value stored at key
- setItem(key, value) - stores a string value with key
- removeItem(key) - removes the value stored at key

## Why BrowserCache?

It came out of a necessity of using a single storage mechanism such as `localStorage` or `sessionStorage` directly in a browser environment for different modules but are not completely isolated from one another ie. they're global storage mechanisms.

A common example is that in scenarios where the value is compressed or serialized data, the schema may be important. If the data is in an incorrect schema because of a bug or so, there is no good way to "invalidate" the cache without potentially wiping the cache from another module. A side effect may be clearing the cache repeatedly in a browser environment when the refreshes happen; think code will have odd logic to prevent the cache invalidation from happening again on refresh and another release of the client code needed to clean the code up from the odd logic.

## Quickstart

```javascript
const cache = new BrowserCache('mymodule', '1.0.1');

// connect to a storage implementation, by default it uses localStorage
cache.connectStorage(sessionStorage);

// assigning the value 'bar' for the key 'foo' 
cache.setItem('foo', 'bar');

// retrieving 'bar' that was previously stored with key 'foo'
cache.getItem('foo');

// remove the key 'foo' and 'bar' that is stored with 'foo' 
cache.removeItem('foo');

// clear the entire module's cache
cache.clear();
```
## Future improvements

- Singleton helper for managing what modules are already registered to be able to re-use it across multiple locations? 
- Should we support a way to do migrations?
