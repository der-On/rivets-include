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

## Using template engines:

You can use any template engine together with rivets include.

First you must define an engine. 
An engine is simply a function that gets the plain HTML, an object containing the model data and the path to the included file.
It must return the transformed HTML.

```javascript
rivets.binders.include.engines.ejs = function(html, data, filename) {
    return ejs.render(html, data, { filename: filename });
}
```

Then set the engine to use with the "engine" attribute on your element.

```html
    <div rv-include="pathToTemplate" engine="ejs"></div>
```

## Pre-filling cache:

rivets-include caches every loaded template in ```rivets.binders.include.cache```.

If you want to pre-fill the cache simply add a key corresponding to the file name and value corresponding to the template contents to the ```rivets.binders.include.cache``` object.

```javascript
rivets.binders.include.cache['views/image.html.ejs'] = '<img src="<%- image.src %>" alt="<%- image.title %>" />';
```