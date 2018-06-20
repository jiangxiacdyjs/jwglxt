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
   * 全局设置表格行点击事件，如果存在单选框项，则选中，否则返回空
   * (此处使用的是css3中包含属性选择器，意在兼容表格设置其他风格的skin，已在admin.css中重置了表格skin为line的样式设置)
   * todo：事件内判断事件源之前的代码会被执行2次，因为存在icon模拟点击的冒泡触发，尝试使用triggerHandler替代trigger，显示效果是已选中，但是实际无法触发选中功能，此处待进一步研究
   */
  $('#LAY_app_body').off('.selectOnClick','table[lay-skin*="selectOnClick"] tbody tr').on('click.selectOnClick','table[lay-skin*="selectOnClick"] tbody tr',function (e) {
    // e.stopPropagation();
    var idx = $(this).attr('data-index');
    var $fixedIconOk = $('.layui-table-fixed').find('table[lay-skin*="selectOnClick"] tbody tr[data-index='+idx+']').find('.layui-icon-ok').eq(0);
    var $iconOk = $fixedIconOk.length ? $fixedIconOk : $(this).find('.layui-icon-ok').eq(0);
    var $eTarget = $(e.target);
    if(!$eTarget.hasClass('layui-icon-ok') && $iconOk.length){
      $iconOk.trigger('click');
      // $iconOk.triggerHandler('click');
      return;
    }else{
      return;
    }
  });

  /**
   * 全局绑定form表单中带有类名layui-tip-label的label标签鼠标移入和移出事件，部分label因文字过多导致溢出隐藏，此事件可优化用户体验
   * 移入：提示当前label内文字，最长显示时间10秒
   * 移出：关闭所有tips
   */
  $('body').off('mouseenter mouseout').on('mouseenter mouseout','form .layui-tip-label', function (e) {
    var that = this,
      text = $(that).text().replace(/\*/,'');
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