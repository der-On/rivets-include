/* global define: true */
(function(root, factory) {
    'use strict';
    if (typeof exports === 'object') {
        // CommonJS
        factory(require('rivets'), require('superagent'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['rivets', 'superagent'], factory);
    } else {
        // Browser globals
        factory(root.rivets, root.request);
    }
})(this, function(rivets, request) {
    var cache = {};

    rivets.binders.include = {
        bind: function(el) {
            var self = this;
            var childView;
            var keypath = this.keypath;
            var view = this.view;

            this.clear = function() {
                if (childView) {
                    childView.unbind();
                }

                el.innerHTML = '';
            };

            this.load = function(path) {
                switch(typeof(path)) {
                    case 'function': path = path(); break;
                    case 'undefined':
                        if ((keypath.startsWith("'") && keypath.endsWith("'")) ||
                            (keypath.startsWith('"') && keypath.endsWith('"'))) {
                            path = keypath.substring(1, keypath.length - 1);
                        }
                        break;
                }

                if (!path) {
                    this.clear();
                    return;
                }

                if (cache[path]) {
                    include(cache[path]);
                    return;
                }

                request.get(path, onLoaded);

                function onLoaded(err, response) {
                    var body = response.text;

                    if (err) {
                        self.clear();
                        if (console) console.error(err);
                        return;
                    }

                    include(body);
                    cache[path] = body;
                }

                function include(html) {
                    var child = document.createElement('div');
                    child.className = 'rv-include';
                    child.innerHTML = html;
                    el.appendChild(child);

                    // copy models into new view
                    var models = {};
                    for(var key in view.models) {
                        models[key] = view.models[key];
                    }
                    childView = rivets.bind(child, models);
                }
            };
        },
        unbind: function(el) {
            this.clear();
        },
        routine: function(el, value) {
            this.load(value);
        }
    };
});