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

    // 获取表格对象，先清空其tbody，然后创建一个空的tbody插入表格
    var table = this;

    // 获取所有表头th
    var columns = $(table).find('thead > tr th');

    // 记录表头所在行的data-tabullet-map属性值（用于标记每条数据的唯一性）
    var idMap = $(table).find('thead > tr').eq(0).attr('data-tabullet-map');

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

    // 获取配置的数据(将在此插件尾部遍历数据，绘制表格)
    var data = options.data;

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
      }
      ;
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
          // 获取当前已选项的数据id
          var money = $tr.find(':input[name=amount]').parent().next().html();
          // 添加验证第1个和第3个input是否为空，为空不能新增
          var requireVal0 = $tr.find(':input').eq(0).val().replace(/^\s+|\s+$/g, ''),
            requireVal2 = $tr.find(':input').eq(2).val().replace(/^\s+|\s+$/g, '');
          if (requireVal0 && requireVal2) {
            var saveData = {};
            var $rowChildrenIpts = $tr.find(':input').not('button');
            $rowChildrenIpts.each(function (ri, rv) {
              // $(rv).attr('name')是取的当前input的name值，而此name值在动态创建的时候取的是表头配置metadata中的map值，即字段名称
              saveData[$(rv).attr('name')] = $(rv).val();
            });
            // 设置单个数据对象中id为tr的data-id或者为空
            saveData[idMap] = markId || '';
            // 特殊定制：传入money值
            saveData['money'] = money || 0;
            options.action('save', saveData);
            return;
          } else if (!requireVal2) {
            layer.msg('该食材当月暂未定价，请核实', {icon: 2})
          } else {
            layer.msg('请输入食材名词', {icon: 2})
          }
        });
        return;
      }
      // 判断是否是金额栏目，如果是，则设置input只读
      if (v.readonly !== 'true') {
        $('<td/>')
          .html('<input type="text" name="' + v.map + '" class="' + options.textClass + '"/>')
          .appendTo(insertRow);
        return;
      } else {
        $('<td/>')
          .html('/')
          .appendTo(insertRow);
        /*if (v.map === '_index') {
          $('<td/>')
            .html('/')
            .appendTo(insertRow);
        } else {
          $('<td/>')
            .html('<input readonly placeholder="只读" type="text" name="' + v.map + '" class="' + options.textClass + '"/>')
            .appendTo(insertRow);
        }*/
      }
    });

    /*****输入数量中，实时更新总额*****/
    // 解决js中浮点数乘法不准的问题
    function accMul(arg1, arg2) {
      var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
      try {
        m += s1.split(".")[1].length
      } catch (e) {
      }
      try {
        m += s2.split(".")[1].length
      } catch (e) {
      }
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    }

    $(table).on('input propertychange', ':input[name=amount]', function (i) {
      var amount = $(this).val();
      var price = $(this).closest('tr').find(':input[name=price]').val() || 0;
      $(this).parent().next().html(accMul(amount, price));
    })
    /*******************************/

    // 重建表格数据
    var idx = 0;
    $(data).each(function (i, v) {
      idx++;
      var tr = $("<tr/>").attr('data-id', v.id).appendTo($(tbody)).attr('data-tabullet-id', idx);
      // 判断是否存在id为foodMenu结构，如果存在，则里面对应的食材添加上选中的状态
      if ($('#foodMenu').length) $('#foodMenu').find('[data-id=' + v.id + ']').addClass('bg-danger');

      $(metadata).each(function (mi, mv) {
        switch (mv.type) {

          case 'delete':
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
                // 此处传给action回调的第二个参数实则是当前数据的索引值（而编辑操作和保存操作传入的则是具体的某条数据）
                options.action('delete', $(tr).attr('data-tabullet-id'));
                // 判断是否存在id为foodMenu结构，如果存在，则里面对应的食材取消状态
                if ($('#foodMenu').length) $('#foodMenu').find('[data-id=' + markId + ']').removeClass('bg-danger');
                layer.close(layer.index);
              }, function () {
                layer.close(layer.index);
              });
            });
            break;

          case 'edit':
            var td = $("<td/>")
              .html('<button class="' + options.editClass + '">' + options.editContent + '</button>')
              .attr('data-tabullet-type', mv.type)
              .appendTo(tr);
            td.find('button').click(function (event) {
              // 如果当前行是编辑状态
              if ($(this).attr('data-mode') === 'edit') {
                var editData = [];
                var rowParent = td.closest('tr');
                var rowChildren = rowParent.find('input');
                $(rowChildren).each(function (ri, rv) {
                  editData[$(rv).attr('name')] = $(rv).val();
                });
                // 特殊定制：传递money及数据标识id给editData，因为未传递数据所在索引值，因此需要在页面中回调函数根据id获取出索引，然后修改对应索引的数据
                var money = rowParent.find(':input[name=amount]').parent().next().html() || 0,
                  id = rowParent.attr('data-id');
                editData['money'] = money;
                editData[idMap] = id;
                options.action('edit', editData);    //  单击保存  要执行的操作
                return;
              }
              // 不允许多行是编辑状态
              if (td.closest('tr').closest('tbody').find('tr').find("[data-tabullet-type='edit']").find("[data-mode='edit']").length >= 1) {
                if (td.closest('tr').find("[data-mode='edit']").length !== 1) {
                  layer.alert("当前已经有编辑状态的行，请先保存编辑行后再编辑其他行");
                }
                return;
              }
              // 单击编辑按钮  单元格变成编辑状态  按钮变成保存
              $(this).removeClass(options.editClass).addClass(options.saveClass)
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
            break;

          default:
            if (mv.map === '_index') {
              var td = $("<td/>")
                .html(idx)
                .attr('data-tabullet-map', mv.map)
                .attr('data-tabullet-readonly', mv.readonly)
                .attr('data-tabullet-type', mv.type)
                .appendTo(tr);
            } else {
              var td = $("<td/>").html(v[mv.map])
                .attr('data-tabullet-map', mv.map)
                .attr('data-tabullet-readonly', mv.readonly)
                .attr('data-tabullet-type', mv.type)
                .appendTo(tr);
              td.click(function (event) {
                // 如果已有待保存行存在
                if (td.closest('tr').closest('tbody').find('tr').find("[data-tabullet-type='edit']").find("[data-mode='edit']").length >= 1) {
                  if (td.closest('tr').find("[data-mode='edit']").length !== 1) {  // 点击当前编辑行的时候 不提示
                    layer.alert("已经有编辑状态行，请先保存后再编辑其它行");
                  }
                  return;
                }
                // 单击编辑按钮  单元格变成编辑状态  按钮变成保存
                td.closest('tr').find("[data-tabullet-type='edit']").find('button').removeClass(options.editClass).addClass(options.saveClass)
                  .html(options.saveContent)
                  .attr('data-mode', 'edit');
                var rowParent = td.closest('tr');
                var rowChildren = rowParent.find('td');
                // 改变当前行  为可改变的td加上输入框
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
        }
      });
    });
  };
}(jQuery));
