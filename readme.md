# Rivets.js Include Binder

This binder allows inclusion of templates.

## Usage:

```html
    <div rv-include="pathToTemplate"></div>
```

Templates are loaded asynchronous and will be cached.

The element will dispatch an 'include' event once the template was loaded.