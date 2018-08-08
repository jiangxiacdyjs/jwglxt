/** layuiAdmin.pro-v1.0.0-beta9 LPPL License By http://www.layui.com/admin/ */
 ;layui.define(["laytpl","layer"],function(e){var t=layui.jquery,a=layui.laytpl,n=layui.layer,r=layui.setter,o=(layui.device(),layui.hint()),i="LAY_app_body",s=function(e){this.id=e,this.container=t("#"+(e||i))},l=function(e){return new s(e)};l.loading=function(e){e.append(this.elemLoad=t('<i class="layui-anim layui-anim-rotate layui-anim-loop layui-icon layui-icon-loading layadmin-loading"></i>'))},l.removeLoad=function(){this.elemLoad&&this.elemLoad.remove()},l.exit=function(){layui.data(r.tableName,{key:r.request.tokenName,remove:!0}),location.hash="/user/login"},l.req=function(e){var a=e.success,n=(e.error,r.request),o=r.response,i=function(){return r.debug?"<br><cite>URL：</cite>"+e.url:""};return e.data=e.data||{},e.headers=e.headers||{},n.tokenName&&(e.data[n.tokenName]=n.tokenName in e.data?e.data[n.tokenName]:layui.data(r.tableName)[n.tokenName]||"",e.headers[n.tokenName]=n.tokenName in e.headers?e.headers[n.tokenName]:layui.data(r.tableName)[n.tokenName]||""),delete e.success,delete e.error,t.ajax(t.extend({type:"get",dataType:"json",success:function(t){var n=o.statusCode;if(t[o.statusName]==n.ok)"function"==typeof e.done&&e.done(t);else if(t[o.statusName]==n.logout)l.exit();else{var r=["<cite>Error：</cite> "+(t[o.msgName]||"返回状态码异常"),i()].join("");l.error(r)}"function"==typeof a&&a(t)},error:function(e,t){var a=["请求异常，请重试<br><cite>错误信息：</cite>"+t,i()].join("");l.error(a),"function"==typeof a&&a(res)}},e))},l.popup=function(e){var a=e.success,r=e.skin;return delete e.success,delete e.skin,n.open(t.extend({type:5,title:"提示",content:"",id:"LAY-system-view-popup",skin:"layui-layer-admin"+(r?" "+r:""),shadeClose:!0,maxmin:!1,closeBtn:!1,success:function(e,r){var o=t('<i class="layui-icon" close>&#x1006;</i>');e.append(o),o.on("click",function(){n.close(r)}),"function"==typeof a&&a.apply(this,arguments)}},e))},l.error=function(e,a){return l.popup(t.extend({content:e,maxWidth:300,offset:"t",anim:6,id:"LAY_adminError"},a))},s.prototype.render=function(e,a){var n=this;layui.router();e=r.views+e+r.engine,t("#"+i).children(".layadmin-loading").remove(),l.loading(n.container);var o={};return o[r.request.tokenName]=layui.data(r.tableName)[r.request.tokenName],o.v=layui.cache.version,t.ajax({url:e,type:"get",dataType:"html",data:o,success:function(e){e="<div>"+e+"</div>";var r=t(e).find("title"),o=r.text()||(e.match(/\<title\>([\s\S]*)\<\/title>/)||[])[1],i={title:o,body:e};r.remove(),n.params=a||{},n.then&&(n.then(i),delete n.then),n.parse(e),l.removeLoad(),n.done&&(n.done(i),delete n.done,n.params.callback&&n.params.callback())},error:function(e){return l.removeLoad(),n.render.isError?l.error("请求视图文件异常，状态："+e.status):(404===e.status?n.render("template/tips/404"):n.render("template/tips/error"),void(n.render.isError=!0))}}),n},s.prototype.parse=function(e,n,r){var i=this,s="object"==typeof e,d=s?e:t(e),u=s?e:d.find("*[template]"),c=function(e){var n=a(e.dataElem.html());e.dataElem.after(n.render(t.extend({params:m.params},e.res))),"function"==typeof r&&r();try{e.done&&new Function("d",e.done)(e.res)}catch(o){console.error(e.dataElem[0],"\n存在错误回调脚本\n\n",o)}},m=layui.router();d.find("title").remove(),i.container[n?"after":"html"](d.children()),m.params=i.params||{};for(var y=u.length;y>0;y--)!function(){var e=u.eq(y-1),t=e.attr("lay-done")||e.attr("lay-then"),n=a(e.attr("lay-url")||"").render(m),r=a(e.attr("lay-data")||"").render(m),i=a(e.attr("lay-headers")||"").render(m);try{r=new Function("return "+r+";")()}catch(s){o.error("lay-data: "+s.message),r={}}try{i=new Function("return "+i+";")()}catch(s){o.error("lay-headers: "+s.message),i=i||{}}n?l.req({type:e.attr("lay-type")||"get",url:n,data:r,dataType:"json",headers:i,success:function(a){c({dataElem:e,res:a,done:t})}}):c({dataElem:e,done:t})}();return i},s.prototype.send=function(e,t){var n=a(e||this.container.html()).render(t||{});return this.container.html(n),this},s.prototype.refresh=function(e){var t=this,a=t.container.next(),n=a.attr("lay-templateid");return t.id!=n?t:(t.parse(t.container,"refresh",function(){t.container.siblings('[lay-templateid="'+t.id+'"]:last').remove(),"function"==typeof e&&e()}),t)},s.prototype.then=function(e){return this.then=e,this},s.prototype.done=function(e){return this.done=e,this},e("view",l)});