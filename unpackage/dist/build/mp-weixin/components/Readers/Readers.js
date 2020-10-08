(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/Readers/Readers"],{"08c0":function(t,e,n){"use strict";n.r(e);var u=n("0da8"),a=n("e2ef");for(var c in a)"default"!==c&&function(t){n.d(e,t,(function(){return a[t]}))}(c);n("3eeb"),n("ee8c");var i,o=n("f0c5"),r=Object(o["a"])(a["default"],u["b"],u["c"],!1,null,"b1527e2e",null,!1,u["a"],i);e["default"]=r.exports},"0da8":function(t,e,n){"use strict";var u,a=function(){var t=this,e=t.$createElement;t._self._c},c=[];n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return c})),n.d(e,"a",(function(){return u}))},"3eeb":function(t,e,n){"use strict";var u=n("7309"),a=n.n(u);a.a},7309:function(t,e,n){},8163:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var u={props:["matter","hideBookInfo","finished"],data:function(){return{contentList:[]}},computed:{themeFont:function(){return this.$store.state.themeFont}},watch:{matter:function(t){var e=JSON.parse(t.content);this.contentList=e.content.split("\n")}},methods:{previousHandle:function(){this.$emit("previous")},nextHandle:function(){this.$emit("next")},tapHandle:function(){this.$emit("tapHandle")}}};e.default=u},ca45:function(t,e,n){},e2ef:function(t,e,n){"use strict";n.r(e);var u=n("8163"),a=n.n(u);for(var c in u)"default"!==c&&function(t){n.d(e,t,(function(){return u[t]}))}(c);e["default"]=a.a},ee8c:function(t,e,n){"use strict";var u=n("ca45"),a=n.n(u);a.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/Readers/Readers-create-component',
    {
        'components/Readers/Readers-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("08c0"))
        })
    },
    [['components/Readers/Readers-create-component']]
]);
