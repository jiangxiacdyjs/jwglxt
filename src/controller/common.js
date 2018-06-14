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

  /**
   * 全局设置表格行点击事件，如果存在单选框项，则选中，否则返回空
   * (此处使用的是css3中包含属性选择器，意在兼容表格设置其他风格的skin，已在admin.css中重置了表格skin为line的样式设置)
   * layui的table组件中对单选框的绑定事件是在单选框icon的父元素上，因此采用阻止冒泡模拟点击事件模拟触发单选框状态
   */
  $('#LAY_app_body').off('.selectOnClick','table[lay-skin*="selectOnClick"] tbody tr').on('click.selectOnClick','table[lay-skin*="selectOnClick"] tbody tr',function (e) {
    // e.stopPropagation();
    var idx = $(this).attr('data-index');
    var $fixedIconOk = $('.layui-table-fixed').find('table[lay-skin*="selectOnClick"] tbody tr[data-index='+idx+']').find('.layui-icon-ok').eq(0);
    var $iconOk = $fixedIconOk.length ? $fixedIconOk : $(this).find('.layui-icon-ok').eq(0);
    var $eTarget = $(e.target);
    if(!$eTarget.hasClass('layui-icon-ok') && $iconOk.length){
      $iconOk.parent().triggerHandler('click');
      return;
    }else{
      return;
    }
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