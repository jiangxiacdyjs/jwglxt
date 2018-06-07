/**
 * @title:编辑表格
 * @editor:freshzxf
 * @time:2018/06/07
 * @param:{rowClass,columnClass,tableClass,textClass,editClass,deleteClass,saveClass,deleteContent,editContent,saveContent,action}
 */
(function ($) {
  $.fn.tabullet = function (options) {

    // 系统默认配置
    var defaults = {
      rowClass: '',
      columnClass: '',
      tableClass: 'table',
      textClass: 'input-text',
      editClass: 'btn btn-default w100',
      deleteClass: 'btn btn-danger w100',
      saveClass: 'btn btn-primary w100',
      deleteContent: '删除',
      editContent: '编辑',
      saveContent: '保存',
      addContent: '新增',
      action: function () {
      }
    };

    // 扩展配置
    options = $.extend(defaults, options);

    // 获取所有表头th
    var columns = $(this).find('thead > tr th');

    // 记录表头所在行的data-tabullet-map属性值
    var idMap = $(this).find('thead > tr').eq(0).attr('data-tabullet-map');

    // 记录表头所有th特性(保存三种特性：data-tabullet-map字段名、data-tabullet-readonly只读、data-tabullet-type按钮类型)
    // metadata数据格式如: [{map:'',readonly:'',type:''},{},{},{}... ...]
    var metadata = [];
    columns.each(function (i, v) {
      metadata.push({
        map: $(v).attr('data-tabullet-map'),
        readonly: $(v).attr('data-tabullet-readonly'),
        type: $(v).attr('data-tabullet-type')
      });
    });

    // 获取配置的数据
    var data = options.data; //表格的数据

    // 获取表格对象，先清空其tbody，然后创建一个空的tbody插入表格
    var table = this;

    $(table).find('tbody').remove().end().find('thead tr').eq(1).remove();

    var thead = $(table).children('thead');
    var tbody = $("<tbody/>").appendTo($(this));

    // 创建一个空行插入thead，并设置其data-tabullet-id为-1，作为标识操作行(1.为特殊列增加事件; 2.可输入列内插入输入框)
    var insertRow = $("<tr/>").appendTo(thead).attr('data-tabullet-id', "-1");
    // 遍历表头配置，动态创建td及其内容
    $(metadata).each(function (i, v) {
      if (v.type === 'delete') {
        var td = $("<td/>").html('/').appendTo(insertRow);
        return;
      };
      if (v.type === 'edit') {
        var td = $("<td/>")
          .html('<button class="btn btn-success w100">' + options.addContent + '</button>')
          .attr('data-tabullet-type', 'save')
          .appendTo(insertRow);
        // 绑定新增按钮的事件
        td.find('button').click(function (event) {
          var $tr = td.closest('tr');
          // 获取当前已选项的数据id
          var markId = $tr.attr('data-id');
          // 添加验证第1个input是否为空，为空不能新增
          var requireVal0 = $tr.find(':input').eq(0).val().replace(/^\s+|\s+$/g, '');
          if (requireVal0) {
            var saveData = {};
            var $rowChildrenIpts = $tr.find(':input').not('button');
            $rowChildrenIpts.each(function (ri, rv) {
              // $(rv).attr('name')是取的当前input的name值，而此name值在动态创建的时候取的是表头配置metadata中的map值，即字段名称
              saveData[$(rv).attr('name')] = $(rv).val();
            });
            // 设置单个数据对象中id为tr的data-id或者为空
            saveData['id'] = markId || '';
            options.action('save', saveData);
            return;
          } else {
            layer.alert('请输入相应信息再新增！')
          }
        });
        return;
      }
      if (v.readonly !== 'true') {
        $('<td/>')
          .html('<input type="text" name="' + v.map + '" class="' + options.textClass + '"/>')
          .appendTo(insertRow);
      } else {
        $("<td/>").html('/').appendTo(insertRow);
      }
    });

    // 重建表格数据
    var idx = 0;
    $(data).each(function (i, v) {
      idx++;
      var tr = $("<tr/>").attr('data-id',v.id).appendTo($(tbody)).attr('data-tabullet-id', idx);
      // 判断是否存在id为foodMenu结构，如果存在，则里面对应的食材添加上选中的状态
      if($('#foodMenu').length) $('#foodMenu').find('[data-id='+v.id+']').addClass('bg-danger');

      $(metadata).each(function (mi, mv) {
        if (mv.type === 'delete') {
          var td = $("<td/>")
            .html('<button class="' + options.deleteClass + '">' + options.deleteContent + '</button>')
            .attr('data-tabullet-type', mv.type)
            .appendTo(tr);
          td.find('button').click(function (event) {
            // 获取当前已选项的数据id
            var markId = td.closest('tr').attr('data-id');
            // 添加询问弹出层
            layer.confirm('是否确认删除该条数据？', {
              btn: ['确认', '取消'],
              shadeClose: true
            }, function () {
              // tr.remove();
              options.action('delete', $(tr).attr('data-tabullet-id'));
              // 判断是否存在id为foodMenu结构，如果存在，则里面对应的食材取消状态
              if($('#foodMenu').length) $('#foodMenu').find('[data-id='+markId+']').removeClass('bg-danger');
              layer.close(layer.index);
            }, function () {
              layer.close(layer.index);
            });
          });
        } else if (mv.type === 'edit') {
          var td = $("<td/>")
            .html('<button class="' + options.editClass + '">' + options.editContent + '</button>')  // 新增的行 按钮是编辑
            .attr('data-tabullet-type', mv.type)
            .appendTo(tr);
          td.find('button').click(function (event) {
            if ($(this).attr('data-mode') === 'edit') {  // 如果当前行是编辑状态start  按钮其实  保存两个字
              var editData = [];
              var rowParent = td.closest('tr');
              var rowChildren = rowParent.find('input');
              $(rowChildren).each(function (ri, rv) {
                editData[$(rv).attr('name')] = $(rv).val();    // 获取当前行所有input的值
              });
              editData[idMap] = $(rowParent).attr('data-tabullet-id');
              options.action('edit', editData);    //  单击保存  要执行的操作
              return;
            } // 如果当前行是编辑状态end
            // 不允许多行是编辑状态
            if (td.closest('tr').closest('tbody').find('tr').find("[data-tabullet-type='edit']").find("[data-mode='edit']").length >= 1) {
              if (td.closest('tr').find("[data-mode='edit']").length !== 1) {
                layer.alert("当前已经有编辑状态的行，请先保存编辑行后再编辑其他行");
              }
              return;
            }
            $(this).removeClass(options.editClass).addClass(options.saveClass)  // 单击编辑按钮  单元格变成编辑状态  按钮变成保存
              .html(options.saveContent)
              .attr('data-mode', 'edit');
            var rowParent = td.closest('tr');
            var rowChildren = rowParent.find('td'); // 改变当前行  为可改变的td加上输入框
            $(rowChildren).each(function (ri, rv) {
              if ($(rv).attr('data-tabullet-type') === 'edit' ||
                $(rv).attr('data-tabullet-type') === 'delete') {
                return;
              }
              var mapName = $(rv).attr('data-tabullet-map');
              if ($(rv).attr('data-tabullet-readonly') !== 'true') {
                $(rv).html('<input type="text" name="' + mapName + '" value="' + v[mapName] + '" class="' + options.textClass + '"/>');
              }
            });
          });
        } else if (mv.map === '_index'){
          var td = $("<td/>").html(v[mv.map])
            .attr('data-tabullet-map', mv.map)
            .attr('data-tabullet-readonly', mv.readonly)
            .attr('data-tabullet-type', mv.type)
            .html(idx)
            .appendTo(tr);
        }else {
          var td = $("<td/>").html(v[mv.map])
            .attr('data-tabullet-map', mv.map)
            .attr('data-tabullet-readonly', mv.readonly)
            .attr('data-tabullet-type', mv.type)
            .appendTo(tr);
          td.click(function (event) {
            if (td.closest('tr').closest('tbody').find('tr').find("[data-tabullet-type='edit']").find("[data-mode='edit']").length >= 1) {
              if (td.closest('tr').find("[data-mode='edit']").length !== 1) {  // 点击当前编辑行的时候 不提示
                layer.alert("已经有编辑状态行，请先保存后再编辑其它行");
              }
              return;
            }
            if (td.closest('tr').find("[data-tabullet-type='edit']").find('button').attr('data-mode') === 'edit') {
              td.find('input').focus();
              return;
            }
            td.closest('tr').find("[data-tabullet-type='edit']").find('button').removeClass(options.editClass).addClass(options.saveClass)  // 单击编辑按钮  单元格变成编辑状态  按钮变成保存
              .html(options.saveContent)
              .attr('data-mode', 'edit');
            var rowParent = td.closest('tr');
            var rowChildren = rowParent.find('td'); // 改变当前行  为可改变的td加上输入框
            $(rowChildren).each(function (ri, rv) {
              if ($(rv).attr('data-tabullet-type') === 'edit' ||
                $(rv).attr('data-tabullet-type') === 'delete') {
                return;
              }
              var mapName = $(rv).attr('data-tabullet-map');
              if ($(rv).attr('data-tabullet-readonly') !== 'true') {
                $(rv).html('<input type="text" name="' + mapName + '" value="' + v[mapName] + '" class="' + options.textClass + '"/>');
              }
            });
            td.find('input').focus();
          });
        }
      });
    });
  };
}(jQuery));
