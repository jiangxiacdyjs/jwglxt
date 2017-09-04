/*dataTable*/
/*
	参数解释：
	a	表格对于的类名
	b	不参与排序的列
*/
function tableSort(a,b){
    $(a).dataTable({
        "sDom": '<"showCount"l><"showSearch"f>tipr',
        /*"lengthMenu": [[8, 20, 50, -1], [8, 20, 50, "All"]],*/
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
