/** layuiAdmin.pro-v1.0.0-beta9 LPPL License By http://www.layui.com/admin/ */
 ;layui.extend({setter:"config",admin:"lib/admin",view:"lib/view",viewer:"lib/extend/viewer/viewer",treeselect:"../lib/extend/layui-treeselect",formSelects:"../lib/extend/formSelects-v3",xtree:"../lib/extend/layui-xtree",verfiy:"../lib/extend/layui-gVerify"}).define(["setter","admin"],function(e){var a=layui.setter,t=layui.element,i=layui.admin,n=i.tabsPage,l=layui.view,r=function(){var e=layui.router(),s=e.path,o=i.correctRouter(e.path.join("/"));s.length||(s=[""]),""===s[s.length-1]&&(s[s.length-1]=a.entry);var u="#LAY_app_body",d="layadmin-layout-tabs",c=layui.$,y=c(window),h=function(e){r.haveInit&&c(".layui-layer").each(function(){var e=c(this),a=e.attr("times");e.hasClass("layui-layim")||layer.close(a)}),r.haveInit=!0,c(u).scrollTop(0),delete n.type};return"tab"===n.type&&("/"!==o||"/"===o&&i.tabsBody().html())?(i.tabsBodyChange(n.index),h(n.type)):(l().render(s.join("/")).then(function(l){var r,s=c("#LAY_app_tabsheader>li");s.each(function(e){var a=c(this),t=a.attr("lay-id");t===o&&(r=!0,n.index=e)}),a.pageTabs&&"/"!==o&&(r||(c(u).append('<div class="layadmin-tabsbody-item layui-show"></div>'),n.index=s.length,t.tabAdd(d,{title:"<span>"+(l.title||"新标签页")+"</span>",id:o,attr:e.href}))),this.container=i.tabsBody(n.index),a.pageTabs||this.container.scrollTop(0),t.tabChange(d,o),i.tabsBodyChange(n.index)}).done(function(){layui.use("common",layui.cache.callback.common),y.on("resize",layui.data.resize),i.tabsBody(n.index).on("scroll",function(){var e=c(this),a=c(".layui-laydate"),t=c(".layui-layer")[0];a[0]&&(a.each(function(){var e=c(this);e.hasClass("layui-laydate-static")||e.remove()}),e.find("input").blur()),t&&layer.closeAll("tips")});var e=c("#LAY-system-side-menu").find(".layui-this"),a=e.children("a").eq(0),l=a.text().replace(/\s/g,"");c("#show-router-path").children("a:not(:first),span").remove();if(a.parent("li").length){var r=c("<cite/>").text(l),s=c("<a/>"),o=s.append(r);c("#show-router-path").append(o)}else{for(var u=[l],d=a.parents("dl.layui-nav-child"),h=0;h<d.length;h++)u.push(d.eq(h).siblings("a").eq(0).text().replace(/\s/g,""));for(var p=u.length-1;p>-1;p--){if(0==p)var r=c("<cite/>").text(u[p]),s=c("<a/>"),v=s.append(r);else var v=c("<a/>").text(u[p]);c("#show-router-path").append(v)}}t.render("breadcrumb"),0===e.length&&c("#show-router-path").children("a:not(:first),span").remove()}),void h())},s=function(e){var t,n=layui.router(),s=l(a.container),o=i.correctRouter(n.path.join("/"));if(layui.each(a.indPage,function(e,a){if(o===a)return t=!0}),layui.config({base:a.base+"controller/"}),t||"/user/login"===o)s.render(n.path.join("/")).done(function(){i.pageType="alone"});else{if(a.interceptor){var u=layui.data(a.tableName);if(!u[a.request.tokenName])return location.hash="/user/login/redirect="+encodeURIComponent(o);if(u[a.request.tokenName]&&"admin"!==u[a.request.tokenName])return location.hash="/template/tips/test"}"console"===i.pageType?r():s.render("layout").done(function(){r(),layui.element.render(),i.screen()<2&&i.sideFlexible(),i.pageType="console"})}};layui.link(a.base+"style/admin.css?v="+(i.v+"-1"),function(){s()},"layuiAdmin"),layui.link(a.base+"lib/extend/viewer/viewer.css?v="+(i.v+"-1")),layui.link(a.base+"font-awesome-4.7.0/css/font-awesome.min.css?v="+(i.v+"-1")),layui.link(a.base+"style/base.css?v="+(i.v+"-1")),window.onhashchange=function(){s(),layui.event.call(this,a.MOD_NAME,"hash({*})",layui.router())},layui.each(a.extend,function(e,t){var i={};i[t]="{/}"+a.base+"lib/extend/"+t,layui.extend(i)}),e("index",{render:r})});