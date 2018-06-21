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

  /**
   * 全局绑定form表单中带有类名layui-tip-label的label标签鼠标移入和移出事件，部分label因文字过多导致溢出隐藏，此事件可优化用户体验
   * 移入：提示当前label内文字，最长显示时间10秒
   * 移出：关闭所有tips
   */
  $('body').on('mouseenter mouseout','form .layui-tip-label', function (e) {
    var that = this,
      text = $(that).text().replace(/\*|\s*/,'') || $(that).val().replace(/\s*/,'');
    if(e.type === 'mouseenter'){
      layer.tips(text, $(that), {
        tips: 3,
        time: 10000
      });
    }else{
      layer.closeAll('tips');
    }
  });


  //对外暴露的接口
  exports('common', {});
});