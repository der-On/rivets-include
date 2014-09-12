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

      this.clear = function() {
        if (this.nested) {
          this.nested.unbind();
        }

        el.innerHTML = '';
      };

      this.load = function(path) {
        this.clear();

        if (typeof path === 'function') path = path();

        if (!path) {
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
          el.innerHTML = html;

          // copy models into new view
          var models = {};
          for(var key in self.view.models) {
            models[key] = self.view.models[key];
          }

          var options = {};
          if (typeof self.view['options'] === 'function') {
            options = self.view.options();
          }
          var els = Array.prototype.slice.call(el.childNodes);
          self.nested = rivets.bind(els, models, options);

          // dispatch include event
          var event = new CustomEvent('include', {
            detail: {
              path: path
            },
            bubbles: true,
            cancelable: true
          });

          el.dispatchEvent(event);
        }
      };
    },
    unbind: function(el) {
      if (this.clear) this.clear();
    },
    routine: function(el, value) {
      this.load(value);
    }
  };
});