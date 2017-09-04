/*营养餐表格*/

(function ($) {
    $.fn.tabullet = function (options) {
        var defaults = {
            rowClass: '',
            columnClass: '',
            tableClass: 'table',
            textClass: 'input-text',
            editClass: 'btn btn-default',
            deleteClass: 'btn btn-danger',
            saveClass: 'btn btn-primary',
            deleteContent: '删除',
            editContent: '编辑',
            saveContent: '保存',
            action: function () {
            }
        };
        options = $.extend(defaults, options);
        var columns = $(this).find('thead > tr th');
        var idMap = $(this).find('thead > tr').eq(1).attr('data-tabullet-map');
        var metadata = [];   // 记录每一列的特性
        columns.each(function (i, v) {
            metadata.push({
                map: $(v).attr('data-tabullet-map'),
                readonly: $(v).attr('data-tabullet-readonly'),
                type: $(v).attr('data-tabullet-type')
            });
        });

        var data = options.data;
        //  这几行代码没什么卵用  如果_index改为id  下面重建表的时候就可以不用idNum
        var index = 1;
        $(data).each(function (i, v) {
            v._index = index++;
        });

        var table = this;
        $(table).find("tbody").remove();        //  清空表格数据  tbody
        var tbody = $("<tbody/>").appendTo($(this));  // tbody节点append的到表节点上去

        var insertRow = $("<tr/>").appendTo($(tbody)).attr('data-tabullet-id', "-1");   // 插入第一行  空行
        $(metadata).each(function (i, v) {     //  在第一行空行上  1.为特殊列增加事件  2.可输入列内插入输入框
            if (v.type === 'delete') {
                var td = $("<td/>").appendTo(insertRow);
                return;
            };
            if (v.type === 'edit') {
                var td = $("<td/>")
                    .html('<button class="btn btn-success w100">' + '新增' + '</button>')
                    .attr('data-tabullet-type', 'save')
                    .appendTo(insertRow);
                td.find('button').click(function (event) {
                    // 添加验证第1个input是否为空，为空不能新增
                    var val0 = $("[data-tabullet-id='-1']").find('input').eq(0).val();
                    if(val0){
                        var saveData = [];
                        var rowParent = td.closest('tr');
                        var rowChildren = rowParent.find('input');
                        $(rowChildren).each(function (ri, rv) {
                            saveData[$(rv).attr('name')] = $(rv).val();   //  获取所有输入框的值
                        });
                        options.action('save', saveData);
                        return;
                    }else{
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
                $("<td/>").appendTo(insertRow);
            }
        });

        var idNum = 0;   // 重建表格数据
        $(data).each(function (i, v) {
            idNum++;
            var tr = $("<tr/>").appendTo($(tbody)).attr('data-tabullet-id', idNum);
            $(metadata).each(function (mi, mv) {
                if (mv.type === 'delete') {
                    var td = $("<td/>")
                        .html('<button class="' + options.deleteClass + '">' + options.deleteContent + '</button>')
                        .attr('data-tabullet-type', mv.type)
                        .appendTo(tr);
                    td.find('button').click(function (event) {
                        // 添加询问弹出层
                        layer.confirm('是否确认删除该条数据？', {
                          btn: ['确认','取消'],
                          shadeClose: true
                        }, function(){
                            // tr.remove();
                            options.action('delete', $(tr).attr('data-tabullet-id'));
                            layer.close(layer.index);
                        }, function(){
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
                        if(td.closest('tr').closest('tbody').find('tr').find("[data-tabullet-type='edit']").find("[data-mode='edit']").length >=1){
                            if(td.closest('tr').find("[data-mode='edit']").length !== 1){
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
                } else {
                    var td = $("<td/>").html(v[mv.map])
                        .attr('data-tabullet-map', mv.map)
                        .attr('data-tabullet-readonly', mv.readonly)
                        .attr('data-tabullet-type', mv.type)
                        .appendTo(tr);

                    td.click(function (event) {

                        if(td.closest('tr').closest('tbody').find('tr').find("[data-tabullet-type='edit']").find("[data-mode='edit']").length >=1){
                            if(td.closest('tr').find("[data-mode='edit']").length !== 1){  // 点击当前编辑行的时候 不提示
                                layer.alert("已经有编辑状态行，请先保存后再编辑其它行");
                            }
                            return;
                        }
                        if(td.closest('tr').find("[data-tabullet-type='edit']").find('button').attr('data-mode') === 'edit' ){
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
