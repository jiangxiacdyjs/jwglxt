/** layuiAdmin.pro-v1.0.0-beta9 LPPL License By http://www.layui.com/admin/ */
 ;layui.define(function(i){var t=layui.$,l=(layui.layer,layui.laytpl,layui.setter,layui.view,layui.admin);t("#LAY_app_body").off(".selectOnClick",'table[lay-skin*="selectOnClick"] tbody tr').on("click.selectOnClick",'table[lay-skin*="selectOnClick"] tbody tr',function(i){var l=t(this).attr("data-index"),e=t(".layui-table-fixed").find('table[lay-skin*="selectOnClick"] tbody tr[data-index='+l+"]").find(".layui-icon-ok").eq(0),a=e.length?e:t(this).find(".layui-icon-ok").eq(0),n=t(i.target);return!n.hasClass("layui-icon-ok")&&a.length?void a.trigger("click"):void 0}),l.events.logout=function(){l.req({url:"./json/user/logout.js",type:"get",data:{},done:function(i){l.exit()}})},i("common",{})});