(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[3],{a9c3:function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("q-layout",{attrs:{view:"hHh LpR fFf"}},[a("q-header",{attrs:{elevated:""}},[a("q-toolbar",[a("q-toolbar-title",{staticClass:"absolute-center"},[e._v("Aplicatie pentru administrarea facturilor")])],1)],1),a("q-drawer",{attrs:{breakpoint:767,width:250,bordered:"","show-if-above":!0,"content-class":"bg-primary"},model:{value:e.leftDrawerOpen,callback:function(t){e.leftDrawerOpen=t},expression:"leftDrawerOpen"}},[a("q-list",{attrs:{dark:""}},[a("q-item-label",{attrs:{header:""}},[e._v("Meniu")]),e._l(e.navs,(function(t){return a("q-item",{key:t.label,staticClass:"text-grey-3",attrs:{to:t.to,clickable:"",exact:""}},[a("q-item-section",{attrs:{avatar:""}},[a("q-icon",{attrs:{name:t.icon}})],1),"Logout"!==t.label?a("q-item-section",[a("q-item-label",[e._v(e._s(t.label))])],1):a("q-item-section",{on:{click:e.logout}},[a("q-item-label",[e._v(e._s(t.label))])],1)],1)}))],2)],1),a("q-page-container",[a("router-view")],1)],1)},i=[],n=a("18d6"),r={name:"Layout",beforeMount:function(){n["a"].getItem("loggedIn")?(this.$store.dispatch("data/loadSuppliers"),this.$store.dispatch("data/loadCategories"),this.$store.dispatch("data/loadInvoices"),n["a"].getItem("user").isAdmin&&this.$store.dispatch("data/loadUsers")):this.$router.push({name:"Login"})},data:function(){return{leftDrawerOpen:!1,navs:[{label:"Acasa",icon:"list",to:"/"},{label:"Profil",icon:"perm_identity",to:"/profile"},{label:"Furnizori",icon:"group",to:"/suppliers"},{label:"Plati",icon:"payment",to:"/payments"},{label:"Facturi",icon:"note",to:"/invoices"},{label:"Logout",icon:"exit_to_app",to:"/login"}]}},methods:{logout:function(){var e=this;this.$axios.get("/api/auth/logout").then((function(t){e.$q.notify({color:"green",message:t.data.message,icon:"arrow_forward"}),n["a"].set("loggedIn",!1),e.$router.push({name:"Login"})})).catch((function(t){e.$q.notify({color:"negative",message:t.response.data.message,icon:"report_problem"})}))}}},s=r,l=(a("c430"),a("2877")),c=a("eebe"),u=a.n(c),d=a("4d5a"),p=a("e359"),b=a("65c6"),f=a("6ac5"),m=a("9404"),g=a("1c1c"),h=a("0170"),v=a("66e5"),w=a("4074"),q=a("0016"),_=a("09e3"),Q=a("7ff0"),y=Object(l["a"])(s,o,i,!1,null,null,null);t["default"]=y.exports;u()(y,"components",{QLayout:d["a"],QHeader:p["a"],QToolbar:b["a"],QToolbarTitle:f["a"],QDrawer:m["a"],QList:g["a"],QItemLabel:h["a"],QItem:v["a"],QItemSection:w["a"],QIcon:q["a"],QPageContainer:_["a"],QFooter:Q["a"]})},c430:function(e,t,a){"use strict";var o=a("f76d"),i=a.n(o);i.a},f76d:function(e,t,a){}}]);