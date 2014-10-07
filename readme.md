# Rivets.js Include Binder

This binder allows inclusion of templates.

## Installation:

    $ bower install rivets-include

or

    $ npm install rivets-include


## Usage:

```html
    <div rv-include="pathToTemplate"></div>
```

Templates are loaded asynchronous and will be cached.

The element will dispatch an 'include' event once the template was loaded.