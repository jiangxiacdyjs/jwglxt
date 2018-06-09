/*dataTable*/
/*
	参数解释：
	a	表格对于的类名
	b	不参与排序的列
*/
function tableSort(a,b){
    $(a).dataTable({
        "sDom": '<"showSearch"f>ti<"show"l>pr',
        "lengthMenu": [[8, 20, 50, -1], [8, 20, 50, "All"]],
        "aaSorting": [
            [1, "desc"]
        ], //默认第几个排序
        "bStateSave": true, //状态保存
        "aoColumnDefs": [
            //{"bVisible": false, "aTargets": [ 3 ]} //控制列的隐藏显示
            {
                "orderable": false,
                "aTargets": b
            } // 不参与排序的列
        ]
    });
}

/*删除行数据*/
$('.del').on('click',function () {
    var ele = $(this);
    layer.confirm('确认要删除吗？',function(index){
        ele.closest("tr").remove();
        layer.msg('已删除!',{icon:1,time:1000});
        layer.close(index);
        $.ajax({
            type: 'POST',
            url: '',
            dataType: 'json',
            success: function(data){
                ele.closest("tr").remove();
                layer.msg('已删除!',{icon:1,time:1000});
            },
            error:function(data) {
                console.log(data.msg);
            }
        });
    });
});

/*验证textarea是否为空*/
function isTextAreaNull(id) {
    var str = $("#"+id).val().replace(/\s/g,"");
    if (str == "") {
        layer.alert('反馈内容为空，无法提交')
    } else {
        console.log(str)
    }
};

/*全屏弹出层*/
function article_view(title, url, w, h) {
    var index = layer.open({
        type: 2,
        title: title,
        area: [w, h],
        content: url
    });
    layer.full(index);
};
/*审核弹层*/
function article_shenhe(tit,obj) {
    layer.confirm('审核'+tit+'？', {
            btn: ['通过', '不通过', '取消'],
            shade: false,
            closeBtn: 0
        },
        function () {
            $(obj).closest("tr").find(".td-status").html('<span class="label label-success radius">已通过</span>');
            // $(obj).remove();
            layer.msg(tit+'已审核通过！', {
                icon: 6,
                time: 1000
            });
        },
        function () {
            $(obj).parents("tr").find(".td-status").html('<span class="label label-danger radius">未通过</span>');
            // $(obj).remove();
            layer.msg(tit+'未通过审核', {
                icon: 5,
                time: 1000
            });
        });
}

/*跨页面传值*/
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null){
    return decodeURI(r[2]);
  }
  return null;
}

/*加载效果*/
function loading(WaitText) {
  WaitText = WaitText ? (''+WaitText):'加载中，请耐心等待...';
  var index = layer.msg(
    '<div>' + WaitText + '</div>'//样式需要你自己定义，或者直接写内容
    , {
      zIndex: 20171016//更改窗口层次
      , icon: 16
      , time: 0//不自动关闭
      // , anim: 1
      , shade: [0.3, '#000']
      , shadeClose: false
      , skin: 'layer_my_msg_load'
    }
  );
  return index;  //返回弹层索引号，如需关闭此弹层，执行
}