/**

 @Name：layuiAdmin 公共业务
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */

// 备注：此模块在index.js的renderPage()方法中的请求视图模块并成功渲染后被调用
 
layui.define(function(exports){
  var $ = layui.$
  ,layer = layui.layer
  ,laytpl = layui.laytpl
  ,setter = layui.setter
  ,view = layui.view
  ,admin = layui.admin

  //公共业务的逻辑处理可以写在此处，切换任何页面都会执行
  //……

  // 全局设置表格行点击事件，如果存在单选框项，则选中，否则返回空
  $('#LAY_app_body').off('click','table[lay-skin="selectOnClick"] tr');
  $('#LAY_app_body').on('click','table[lay-skin="selectOnClick"] tr',function (e) {
    e.stopPropagation();
    var $iconOk = $(this).find('.layui-icon-ok');
    var $eTarget = $(e.target);
    if(!$eTarget.hasClass('layui-icon-ok') && $iconOk.length){
      $iconOk.trigger('click');
    }else{}
  });

  //退出
  admin.events.logout = function(){
    //执行退出接口
    admin.req({
      url: './json/user/logout.js'
      ,type: 'get'
      ,data: {}
      ,done: function(res){ //这里要说明一下：done 是只有 response 的 code 正常才会执行。而 succese 则是只要 http 为 200 就会执行
        
        //清空本地记录的 token，并跳转到登入页
        admin.exit();
      }
    });
  };

  //对外暴露的接口
  exports('common', {});
});