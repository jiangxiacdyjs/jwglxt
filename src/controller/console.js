/**

 @Name：layuiAdmin 主页控制台
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */


layui.define(function(exports){

  /*
    下面通过 layui.use 分段加载不同的模块，实现不同区域的同时渲染，从而保证视图的快速呈现
  */

  //区块轮播切换
  layui.use(['admin', 'carousel'], function(){
    var $ = layui.$
    ,admin = layui.admin
    ,carousel = layui.carousel
    ,element = layui.element
    ,device = layui.device();

    //轮播切换
    $('.layadmin-carousel').each(function(){
      var othis = $(this);
      carousel.render({
        elem: this
        ,width: '100%'
        ,arrow: 'none'
        ,interval: othis.data('interval')
        ,autoplay: othis.data('autoplay') === true
        ,trigger: (device.ios || device.android) ? 'click' : 'hover'
        ,anim: othis.data('anim')
      });
    });
    element.render('progress');
  });

  //数据概览
  layui.use(['carousel', 'echarts', 'admin'], function(){
    var $ = layui.$
    ,admin = layui.admin
    ,carousel = layui.carousel
    ,echarts = layui.echarts;
    $('.fullh1').height(admin.getRightAvailableHeight()/2-10)
    $('.fullh2').height(admin.getRightAvailableHeight()/2-20)

    // echarts二次封装
    var echartsApp = []
      ,options=[]
      ,elemDataView = $('#LAY-index-dataview').children('div')
      ,renderDataView = function(index){
      echartsApp[index] = echarts.init(elemDataView[index], layui.echartsTheme);
      echartsApp[index].setOption(options[index]);
      window.onresize = echartsApp[index].resize;
    };
    // 请求数据，成功后执行渲染
    $.ajax({
      type:'get',
      url:'https://www.easy-mock.com/mock/5aefbefe474c537b3e077081/nutritious/crkfx',
      dataType:'json',
      data:'',
      beforeSend:function(){
      },
      complete:function () {
      },
      success:function(result){
        if(result.success){
          options = [{
              /*title: {
                text: '今日流量趋势',
                x: 'center',
                textStyle: {
                  fontSize: 14
                }
              },*/
              grid: {
                left: '0',
                right: '0',
                bottom: '1%',
                containLabel: true
              },
              tooltip : {
                trigger: 'axis'
              },
              legend: {
                data: result.data.map(function (item) {
                  return item.name;
                })
              },
              xAxis : [{
                type : 'category',
                boundaryGap : false,
                data: result.xData
              }],
              yAxis: [
                {
                  type: 'value',
                  name: '元',
                  axisLabel: {
                    formatter: '{value}'
                  }
                },
                {
                  type: 'value',
                  name: '元',
                  axisLabel: {
                    formatter: '{value}'
                  }
                }
              ],
              dataZoom: [
                {
                  type: 'slider',
                  show: true,
                  xAxisIndex: [0],
                  start: 30,
                  end: 100
                }
              ],
              series: [
                {
                  name: result.data[0].name,
                  type: 'line',
                  smooth:true,
                  itemStyle: {normal: {areaStyle: {type: 'default'}}},
                  data: result.data[0].value
                },
                {
                  name: result.data[1].name,
                  type: 'line',
                  smooth:true,
                  itemStyle: {normal: {areaStyle: {type: 'default'}}},
                  data: result.data[1].value
                },
                {
                  yAxisIndex: 1,
                  name: result.data[2].name,
                  type: 'line',
                  label: {
                    normal: {
                      show: false,
                      position: 'top'
                    }
                  },
                  smooth:true,
                  itemStyle: {normal: {areaStyle: {type: 'default'}}},
                  data: result.data[2].value
                }
              ],
          }, {
            title: {
              text: '今日流量趋势',
              x: 'center',
              textStyle: {
                fontSize: 14
              }
            },
            tooltip : {
              trigger: 'axis'
            },
            legend: {
              data:['','']
            },
            xAxis : [{
              type : 'category',
              boundaryGap : false,
              data: ['06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30']
            }],
            yAxis : [{
              type : 'value'
            }],
            series : [{
              name:'PV',
              type:'line',
              smooth:true,
              itemStyle: {normal: {areaStyle: {type: 'default'}}},
              data: [111,222,333,444,555,666,3333,33333,55555,66666,33333,3333,6666,11888,26666,38888,56666,42222,39999,28888,17777,9666,6555,5555,3333,2222,3111,6999,5888,2777,1666,999,888,777]
            },{
              name:'UV',
              type:'line',
              smooth:true,
              itemStyle: {normal: {areaStyle: {type: 'default'}}},
              data: [11,22,33,44,55,66,333,3333,5555,12666,3333,333,666,1188,2666,3888,6666,4222,3999,2888,1777,966,655,555,333,222,311,699,588,277,166,99,88,77]
            }]
          },{}];

          //没找到DOM，终止执行
          if(!elemDataView[0]) return;
          renderDataView(0);
        }
      }
    });
    
    //监听数据概览轮播
    var carouselIndex = 0;
    carousel.on('change(LAY-index-dataview)', function(obj){
      renderDataView(carouselIndex = obj.index);
    });
    
    //监听侧边伸缩
    layui.admin.on('side', function(){
      setTimeout(function(){
        renderDataView(carouselIndex);
      }, 300);
    });
    
    //监听路由
    layui.admin.on('hash(tab)', function(){
      layui.router().path.join('') || renderDataView(carouselIndex);
    });
  });

  //最新订单
  layui.use(['admin','table'], function(){
    var $ = layui.$
    ,admin = layui.admin
    ,table = layui.table;

    //学校库存表格
    table.render({
      elem: '#LAY-index-schoolInventory'
      ,url:  admin.baseUrl + "/schoolInventory" //模拟接口
      , method: 'post'
      , height: 'full-415'
      ,page: false
      ,cols: [[
        {type: 'numbers', fixed: 'left'}
        ,{field: 'name', title: '学校名称'}
        ,{field: 'amount', title: '总库存量/元',sort: true,width:110,align:'right'}
      ]]
    });
    
  });
  
  exports('console', {})
});