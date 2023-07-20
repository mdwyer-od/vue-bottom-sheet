'use strict';var Hammer=require('hammerjs');function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var Hammer__default=/*#__PURE__*/_interopDefaultLegacy(Hammer);function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}//
var script = {
  name: "VueBottomSheet",
  data: function data() {
    var vm = this;
    return {
      inited: false,
      opened: false,
      contentH: "auto",
      hammer: {
        pan: null,
        content: null
      },
      contentScroll: 0,
      cardP: null,
      cardH: null,
      moving: false,
      stripe: 0,
      handlers: {
        mousedown: vm.clickOnBottomSheet,
        touchstart: vm.clickOnBottomSheet
      }
    };
  },
  props: {
    overlay: {
      type: Boolean,
      default: true
    },
    maxWidth: {
      type: String,
      default: "640px"
    },
    maxHeight: {
      type: String,
      default: "95%"
    },
    clickToClose: {
      type: Boolean,
      default: true
    },
    effect: {
      type: String,
      default: "fx-default"
    },
    rounded: {
      type: Boolean,
      default: true
    },
    swipeAble: {
      type: Boolean,
      default: true
    },
    contentSwipeAble: {
      type: Boolean,
      default: true
    },
    isFullScreen: {
      type: Boolean,
      default: false
    },
    overlayColor: {
      type: String,
      default: "#0000004D"
    },
    backgroundScrollable: {
      type: Boolean,
      default: false
    },
    backgroundClickable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    isIphone: function isIphone() {
      var iPhone = /iPhone/.test(navigator.userAgent) && !window.MSStream;
      var aspect = window.screen.width / window.screen.height;
      return iPhone && aspect.toFixed(3) === "0.462";
    },
    move: function move(event, type) {
      if (this.swipeAble) {
        var delta = -event.deltaY;

        if (type === 'content' && event.type === 'panup' || type === 'content' && event.type === 'pandown' && this.contentScroll > 0) {
          this.$refs.bottomSheetCardContent.scrollTop = this.contentScroll + delta;
        } else if (event.type === 'panup' || event.type === 'pandown') {
          this.moving = true;

          if (event.deltaY > 0) {
            this.cardP = delta;
          }
        }

        if (event.isFinal) {
          this.contentScroll = this.$refs.bottomSheetCardContent.scrollTop;
          this.moving = false;

          if (this.cardP < -30) {
            this.opened = false;
            this.cardP = -this.cardH - this.stripe;
            document.body.style.overflow = "";
            this.$emit("closed");
          } else {
            this.cardP = 0;
          }
        }
      }
    },
    init: function init() {
      var _this = this;

      return new Promise(function (resolve) {
        _this.contentH = "auto";
        _this.stripe = _this.isIphone() ? 20 : 0;
        _this.cardH = _this.$refs.bottomSheetCard.clientHeight;
        _this.contentH = "".concat(_this.cardH - _this.$refs.pan.clientHeight, "px");
        _this.$refs.bottomSheetCard.style.maxHeight = _this.maxHeight;
        _this.cardP = _this.effect === "fx-slide-from-right" || _this.effect === "fx-slide-from-left" ? 0 : -_this.cardH - _this.stripe;

        if (!_this.inited) {
          _this.inited = true;
          var options = {
            recognizers: [[Hammer__default['default'].Pan, {
              direction: Hammer__default['default'].DIRECTION_VERTICAL
            }]]
          };
          _this.hammer.pan = new Hammer__default['default'](_this.$refs.pan, options);

          _this.hammer.pan.on("panstart panup pandown panend", function (e) {
            _this.move(e, 'pan');
          });

          if (_this.contentSwipeAble) {
            _this.hammer.content = new Hammer__default['default'](_this.$refs.bottomSheetCardContent, options);

            _this.hammer.content.on("panstart panup pandown panend", function (e) {
              _this.move(e, 'content');
            });
          }
        }

        setTimeout(function () {
          resolve();
        }, 10);
      });
    },
    open: function open() {
      var _this2 = this;

      this.init().then(function () {
        _this2.opened = true;
        _this2.cardP = 0;

        if (!_this2.$props.backgroundScrollable) {
          document.body.style.overflow = "hidden";
        }

        _this2.$emit("opened");
      });
    },
    close: function close() {
      this.opened = false;
      this.cardP = this.effect === "fx-slide-from-right" || this.effect === "fx-slide-from-left" ? 0 : -this.cardH - this.stripe;
      document.body.style.overflow = "";
      this.$emit("closed");
    },
    clickOnBottomSheet: function clickOnBottomSheet(event) {
      if (this.clickToClose) {
        if (event.target.classList.contains("bottom-sheet__backdrop") || event.target.classList.contains("bottom-sheet")) {
          this.close();
        }
      }
    }
  },
  beforeDestroy: function beforeDestroy() {
    var _this$hammer, _this$hammer$pan, _this$hammer2, _this$hammer2$content;

    (_this$hammer = this.hammer) === null || _this$hammer === void 0 ? void 0 : (_this$hammer$pan = _this$hammer.pan) === null || _this$hammer$pan === void 0 ? void 0 : _this$hammer$pan.destroy();
    (_this$hammer2 = this.hammer) === null || _this$hammer2 === void 0 ? void 0 : (_this$hammer2$content = _this$hammer2.content) === null || _this$hammer2$content === void 0 ? void 0 : _this$hammer2$content.destroy();
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group = css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', _vm._g({
    ref: "bottomSheet",
    class: ['bottom-sheet', {
      opened: _vm.opened,
      closed: _vm.opened === false,
      moving: _vm.moving
    }],
    style: {
      'pointer-events': _vm.backgroundClickable && _vm.clickToClose == false ? 'none' : 'all'
    }
  }, _vm.handlers), [_vm._ssrNode((_vm.overlay ? "<div class=\"bottom-sheet__backdrop\"" + _vm._ssrStyle(null, {
    'background': _vm.overlayColor
  }, null) + " data-v-002bfb03></div>" : "<!---->") + " "), _vm._ssrNode("<div" + _vm._ssrClass(null, ['bottom-sheet__card', {
    stripe: _vm.stripe,
    square: !_vm.rounded
  }, _vm.effect]) + _vm._ssrStyle(null, [{
    bottom: _vm.cardP + 'px',
    maxWidth: _vm.maxWidth,
    maxHeight: _vm.maxHeight
  }, {
    'height': _vm.isFullScreen ? '100%' : 'auto'
  }, {
    'pointer-events': 'all'
  }], null) + " data-v-002bfb03>", "</div>", [_vm._ssrNode("<div class=\"bottom-sheet__pan\" data-v-002bfb03><div class=\"bottom-sheet__bar\" data-v-002bfb03></div></div> "), _vm._ssrNode("<div class=\"bottom-sheet__content\"" + _vm._ssrStyle(null, {
    height: _vm.contentH
  }, null) + " data-v-002bfb03>", "</div>", [_vm._t("default")], 2)], 2)], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-002bfb03_0", {
    source: ".bottom-sheet[data-v-002bfb03]{z-index:99999;-webkit-transition:all .4s ease;transition:all .4s ease;position:relative}.bottom-sheet *[data-v-002bfb03]{-webkit-box-sizing:border-box;box-sizing:border-box}.bottom-sheet__content[data-v-002bfb03]{overflow-y:scroll}.bottom-sheet__backdrop[data-v-002bfb03]{position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;opacity:0;visibility:hidden}.bottom-sheet__card[data-v-002bfb03]{width:100%;position:fixed;background:#fff;border-radius:14px 14px 0 0;left:50%;z-index:9999;margin:0 auto}.bottom-sheet__card.square[data-v-002bfb03]{border-radius:0}.bottom-sheet__card.stripe[data-v-002bfb03]{padding-bottom:20px}.bottom-sheet__card.fx-default[data-v-002bfb03]{-webkit-transform:translate(-50%,0);transform:translate(-50%,0);-webkit-transition:bottom .3s ease;transition:bottom .3s ease}.bottom-sheet__card.fx-fadein-scale[data-v-002bfb03]{-webkit-transform:translate(-50%,0) scale(.7);transform:translate(-50%,0) scale(.7);opacity:0;-webkit-transition:all .3s;transition:all .3s}.bottom-sheet__card.fx-slide-from-right[data-v-002bfb03]{-webkit-transform:translate(100%,0);transform:translate(100%,0);opacity:0;-webkit-transition:all .3s cubic-bezier(.25,.5,.5,.9);transition:all .3s cubic-bezier(.25,.5,.5,.9)}.bottom-sheet__card.fx-slide-from-left[data-v-002bfb03]{-webkit-transform:translate(-100%,0);transform:translate(-100%,0);opacity:0;-webkit-transition:all .3s cubic-bezier(.25,.5,.5,.9);transition:all .3s cubic-bezier(.25,.5,.5,.9)}.bottom-sheet__pan[data-v-002bfb03]{padding-bottom:20px;padding-top:15px;height:38px}.bottom-sheet__bar[data-v-002bfb03]{display:block;width:50px;height:3px;border-radius:14px;margin:0 auto;cursor:pointer;background:rgba(0,0,0,.3)}.bottom-sheet.closed[data-v-002bfb03]{opacity:0;visibility:hidden}.bottom-sheet.closed .bottom-sheet__backdrop[data-v-002bfb03]{-webkit-animation:hide-data-v-002bfb03 .3s ease;animation:hide-data-v-002bfb03 .3s ease}.bottom-sheet.moving .bottom-sheet__card[data-v-002bfb03]{-webkit-transition:none;transition:none}.bottom-sheet.opened[data-v-002bfb03]{position:fixed;top:0;left:0;width:100%;height:100%}.bottom-sheet.opened .bottom-sheet__backdrop[data-v-002bfb03]{-webkit-animation:show-data-v-002bfb03 .3s ease;animation:show-data-v-002bfb03 .3s ease;opacity:1;visibility:visible}.bottom-sheet.opened .bottom-sheet__card.fx-fadein-scale[data-v-002bfb03]{-webkit-transform:translate(-50%,0) scale(1);transform:translate(-50%,0) scale(1);opacity:1}.bottom-sheet.opened .bottom-sheet__card.fx-slide-from-right[data-v-002bfb03]{-webkit-transform:translate(-50%,0);transform:translate(-50%,0);opacity:1}.bottom-sheet.opened .bottom-sheet__card.fx-slide-from-left[data-v-002bfb03]{-webkit-transform:translate(-50%,0);transform:translate(-50%,0);opacity:1}@-webkit-keyframes show-data-v-002bfb03{0%{opacity:0;visibility:hidden}100%{opacity:1;visibility:visible}}@keyframes show-data-v-002bfb03{0%{opacity:0;visibility:hidden}100%{opacity:1;visibility:visible}}@-webkit-keyframes hide-data-v-002bfb03{0%{opacity:1;visibility:visible}100%{opacity:0;visibility:hidden}}@keyframes hide-data-v-002bfb03{0%{opacity:1;visibility:visible}100%{opacity:0;visibility:hidden}}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-002bfb03";
/* module identifier */

var __vue_module_identifier__ = "data-v-002bfb03";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var component = /*#__PURE__*/(function () {
  // Get component instance
  var installable = __vue_component__; // Attach install function executed by Vue.use()

  installable.install = function (Vue) {
    Vue.component('VueBottomSheet', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;
var namedExports=/*#__PURE__*/Object.freeze({__proto__:null,'default': component});// only expose one global var, with named exports exposed as properties of
// that global var (eg. plugin.namedExport)

Object.entries(namedExports).forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      exportName = _ref2[0],
      exported = _ref2[1];

  if (exportName !== 'default') component[exportName] = exported;
});module.exports=component;