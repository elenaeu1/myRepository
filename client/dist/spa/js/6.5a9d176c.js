(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[6],{"20c0":function(e,t,s){"use strict";var i=s("eac2"),a=s.n(i);a.a},"62cc":function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-page",{staticClass:"bg-primary window-height window-width row justify-center items-center"},[s("div",{staticClass:"column"},[s("div",{staticClass:"row"},[s("h5",{staticClass:"text-h5 text-white q-my-md"},[e._v("Invoice Manager")])]),s("div",{staticClass:"row"},[e.isRegisterSection?s("q-card",{staticClass:"q-pa-lg shadow-1",attrs:{square:"",bordered:""}},[s("p",[e._v("Register an account")]),s("q-card-section",[s("q-form",{staticClass:"q-gutter-md"},[s("q-input",{attrs:{square:"",filled:"",clearable:"",type:"text",label:"First name"},model:{value:e.register.firstName,callback:function(t){e.$set(e.register,"firstName",t)},expression:"register.firstName"}}),s("q-input",{attrs:{square:"",filled:"",clearable:"",type:"text",label:"Last name"},model:{value:e.register.lastName,callback:function(t){e.$set(e.register,"lastName",t)},expression:"register.lastName"}}),s("q-input",{attrs:{square:"",filled:"",clearable:"",type:"email",label:"Email"},model:{value:e.register.email,callback:function(t){e.$set(e.register,"email",t)},expression:"register.email"}}),s("q-input",{attrs:{filled:"",label:"Password",type:e.register.isPwd?"password":"text"},scopedSlots:e._u([{key:"append",fn:function(){return[s("q-icon",{staticClass:"cursor-pointer",attrs:{name:e.register.isPwd?"visibility_off":"visibility"},on:{click:function(t){e.register.isPwd=!e.register.isPwd}}})]},proxy:!0}]),model:{value:e.register.password,callback:function(t){e.$set(e.register,"password",t)},expression:"register.password"}})],1)],1),s("q-card-actions",{staticClass:" row justify-center items-center"},[s("q-btn",{attrs:{unelevated:"",color:"grey",size:"md",label:"Back"},on:{click:function(t){e.isRegisterSection=!1}}}),s("q-btn",{attrs:{unelevated:"",color:"primary",size:"md",label:"Submit"},on:{click:e.onRegister}})],1)],1):s("q-card",{staticClass:"q-pa-lg shadow-1",attrs:{square:"",bordered:""}},[s("q-card-section",[s("q-form",{staticClass:"q-gutter-md"},[s("q-input",{attrs:{square:"",filled:"",clearable:"",type:"email",label:"Email"},model:{value:e.login.email,callback:function(t){e.$set(e.login,"email",t)},expression:"login.email"}}),s("q-input",{attrs:{filled:"",label:"Password",type:e.login.isPwd?"password":"text"},scopedSlots:e._u([{key:"append",fn:function(){return[s("q-icon",{staticClass:"cursor-pointer",attrs:{name:e.login.isPwd?"visibility_off":"visibility"},on:{click:function(t){e.login.isPwd=!e.login.isPwd}}})]},proxy:!0}],null,!1,2466182483),model:{value:e.login.password,callback:function(t){e.$set(e.login,"password",t)},expression:"login.password"}})],1)],1),s("q-card-actions",{staticClass:"q-px-md"},[s("q-btn",{staticClass:"full-width",attrs:{unelevated:"",color:"primary",size:"lg",label:"Login"},on:{click:e.onLogin}})],1),s("q-card-section",{staticClass:"text-center q-pa-none"},[s("p",{staticClass:"text-grey-6"},[e._v("\n            Not registred?\n            "),s("a",{on:{click:function(t){e.isRegisterSection=!0}}},[e._v(" Create an Account!")])])])],1)],1)])])},a=[],r=s("18d6"),o={name:"LoginPage",data:function(){return{isRegisterSection:!1,register:{isPwd:!0,password:"",email:"",firstName:"",lastName:""},login:{isPwd:!0,password:"",email:""}}},beforeMount:function(){r["a"].getItem("loggedIn")&&this.$router.push("/")},methods:{onRegister:function(){var e=this;this.$axios.post("/api/auth/register",this.register).then((function(t){e.$q.notify({color:"green",message:t.data.message,icon:"arrow_forward"}),e.isRegisterSection=!1})).catch((function(t){e.$q.notify({color:"negative",message:t.response.data.message,icon:"report_problem"})}))},onLogin:function(){var e=this;this.$axios.post("/api/auth/login",{email:this.login.email,password:this.login.password}).then((function(t){e.$q.notify({color:"green",message:"Login successfully",icon:"arrow_forward"}),r["a"].set("loggedIn",!0),r["a"].set("user",t.data),e.$router.push({name:"Home"})})).catch((function(t){e.$q.notify({color:"negative",message:"Email or password incorrect",icon:"report_problem"})}))}}},n=o,l=(s("20c0"),s("2877")),c=s("eebe"),d=s.n(c),u=s("9989"),g=s("f09f"),p=s("a370"),m=s("0378"),f=s("27f9"),w=s("0016"),b=s("4b7e"),q=s("9c40"),h=Object(l["a"])(n,i,a,!1,null,"4b8d111e",null);t["default"]=h.exports;d()(h,"components",{QPage:u["a"],QCard:g["a"],QCardSection:p["a"],QForm:m["a"],QInput:f["a"],QIcon:w["a"],QCardActions:b["a"],QBtn:q["a"]})},eac2:function(e,t,s){}}]);