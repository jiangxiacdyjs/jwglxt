/**

 @Name：layuiAdmin 主入口
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL
 @EDITOR：freshzxf
 @DESC：此js为入口js，在此使用layui.extend扩展的模块全局可用。当然，也可以把需要扩展的模块放入controllers目录，因为每次加载完模块后移动台设置base路径为controllers目录，
 最好不要单独在模块模块内使用layui.extend方法扩展某模块，那种写法可能会导致多次加载某模块后，layui.hint()提示模块名已被占用，但是不会影响程序的运行！

 */

layui.extend({
  setter: 'config' //配置文件
  , admin: 'lib/admin' //核心模块
  , view: 'lib/view' //核心模块
  , treeselect: '../lib/extend/layui-treeselect' // 属性选择控件（可加上{/}的意思即代表采用自有路径，即不跟随 base 路径）
  , formSelects: '../lib/extend/formSelects-v3' //表单选择拓展控件
  , viewer: '../lib/extend/viewer/viewer' //表单选择拓展控件
  , verfiy: '{/} ../src/lib/extend/layui-gVerify' // 扩展验证码功能
}).define(['setter', 'admin'], function (exports) {
  var setter = layui.setter
    , element = layui.element
    , admin = layui.admin
    , tabsPage = admin.tabsPage
    , view = layui.view

    //根据路由渲染页面
    , renderPage = function () {

      var router = layui.router() //  获得location.hash路由
        , path = router.path // 路径数组，形如：["system","role",""]
        , pathURL = admin.correctRouter(router.path.join('/'))

      //默认读取主页(页面加载时path是一个空数组:[],要将其转换成['']便于后面的判断最后一项是不是''空字符串，如果是，则设置最后一项为index，从而加载index.html)
      if (!path.length) path = [''];
      // if (!path.length) path = ['system','resource','']; // 这样就可以设置默认打开为资源页

      //如果最后一项为空字符，则读取默认文件（这里指的是在config.js里配置的index）
      if (path[path.length - 1] === '') {
        path[path.length - 1] = setter.entry;
      }

      /*
      layui.config({
        base: setter.base + 'controller/'
      });
      */

      var APP_BODY = '#LAY_app_body'
        , FILTER_TAB_TBAS = 'layadmin-layout-tabs'
        , $ = layui.$, $win = $(window)
        //重置状态
        , reset = function (type) {
          //renderPage.haveInit && layer.closeAll();
          if (renderPage.haveInit) {
            $('.layui-layer').each(function () {
              var othis = $(this),
                index = othis.attr('times');
              if (!othis.hasClass('layui-layim')) {
                layer.close(index);
              }
            });
          }
          renderPage.haveInit = true;
          // 装载模块的大容器滚动至顶部
          $(APP_BODY).scrollTop(0);
          //重置页面标签的来源类型
          delete tabsPage.type;
        };

      //如果路由来自于 tab 切换，则不重新请求视图
      if (tabsPage.type === 'tab') {
        //切换到非主页、或者切换到主页且主页必须有内容。方可阻止请求
        if (pathURL !== '/' || (pathURL === '/' && admin.tabsBody().html())) {
          admin.tabsBodyChange(tabsPage.index);
          return reset(tabsPage.type);
        }
      }

      //请求视图渲染,then为请求成功后回调，done为请求成功并渲染后回调
      view().render(path.join('/')).then(function (res) {

        //遍历页签选项卡
        var matchTo
          , tabs = $('#LAY_app_tabsheader>li');

        tabs.each(function (index) {
          var li = $(this)
            , layid = li.attr('lay-id');

          if (layid === pathURL) {
            matchTo = true;
            tabsPage.index = index;
          }
        });

        //如果未在选项卡中匹配到，则追加选项卡
        if (setter.pageTabs && pathURL !== '/') {
          if (!matchTo) {
            $(APP_BODY).append('<div class="layadmin-tabsbody-item layui-show"></div>');
            tabsPage.index = tabs.length;
            element.tabAdd(FILTER_TAB_TBAS, {
              title: '<span>' + (res.title || '新标签页') + '</span>'
              , id: pathURL
              , attr: router.href
            });
          }
        }

        this.container = admin.tabsBody(tabsPage.index);
        setter.pageTabs || this.container.scrollTop(0); //如果不开启标签页，则跳转时重置滚动条

        //定位当前tabs
        element.tabChange(FILTER_TAB_TBAS, pathURL);
        admin.tabsBodyChange(tabsPage.index);

      }).done(function () {
        // 其中layui.cache为缓存信息，layui.cache.callback是缓存了所有已定义的layui模块接口，layui.cache.callback.common即代表执行common模块的接口
        layui.use('common', layui.cache.callback.common);
        // 监听重置页面宽高事件
        $win.on('resize', layui.data.resize);
        //容器 scroll 事件，剔除吸附层
        admin.tabsBody(tabsPage.index).on('scroll', function () {
          var othis = $(this)
            , elemDate = $('.layui-laydate')
            , layerOpen = $('.layui-layer')[0];

          //关闭 layDate
          if (elemDate[0]) {
            elemDate.each(function () {
              var thisElemDate = $(this);
              thisElemDate.hasClass('layui-laydate-static') || thisElemDate.remove();
            });
            othis.find('input').blur();
          }

          //关闭 Tips 层
          layerOpen && layer.closeAll('tips');
        });

        /**
         * 修改：根据'layui-this'类名获取特定格式的当前路由
         */
        var currentInnerMostRoute = $('#LAY-system-side-menu').find('.layui-this');
        var currentInnerMostRouteA = currentInnerMostRoute.children('a').eq(0);
        var currentInnerMostRouteName = currentInnerMostRouteA.text().replace(/\s/g, '');
        // 先清空包屑路由导航
        var clear = $('#show-router-path').children('a:not(:first),span').remove();
        //console.log(clear)
        // 如果是一级目录的跳转
        if (currentInnerMostRouteA.parent('li').length) {
          var $cite = $('<cite/>').text(currentInnerMostRouteName);
          var $a = $('<a/>');
          var $citeA = $a.append($cite);
          $('#show-router-path').append($citeA);
        } else {
          // 定义存放全部层级路由名称的数组
          var routeNames = [currentInnerMostRouteName];
          var parentsDls = currentInnerMostRouteA.parents('dl.layui-nav-child');
          for (var i = 0; i < parentsDls.length; i++) {
            routeNames.push(parentsDls.eq(i).siblings('a').eq(0).text().replace(/\s/g, ''));
          }
          ;
          for (var j = routeNames.length - 1; j > -1; j--) {
            if (j == 0) {
              var $cite = $('<cite/>').text(routeNames[j]);
              var $a = $('<a/>');
              var $item = $a.append($cite);
            } else {
              var $item = $('<a/>').text(routeNames[j]);
            }
            $('#show-router-path').append($item);
          }
        }
        ;
        // 重新初始化面包屑路由导航
        element.render('breadcrumb');
        // 特地为如果仅仅是主页(layui-this类名的dom结构为0)，去掉主页后面的'/'符号
        if (currentInnerMostRoute.length === 0) {
          $('#show-router-path').children('a:not(:first),span').remove();
        }
        ;
        /**
         * 修改：根据'layui-this'类名获取特定格式的当前路由(结束)
         */
      });

      reset();
    }

    //入口页面
    , entryPage = function (fn) {
      var router = layui.router()
        , container = view(setter.container)
        , pathURL = admin.correctRouter(router.path.join('/'))
        , isIndPage;

      // 检查是否属于独立页面
      layui.each(setter.indPage, function (index, item) {
        if (pathURL === item) {
          return isIndPage = true;
        }
      });

      // 将模块根路径设置为 controller 目录（引用console和common用到）
      layui.config({
        base: setter.base + 'controller/'
      });

      //独立页面（此处单独判断登入页，是为了兼容旧版（即未在 config.js 配置 indPage 的情况））
      if (isIndPage || pathURL === '/user/login') {
        container.render(router.path.join('/')).done(function () {
          admin.pageType = 'alone';
        });
      } else { //后台框架页面

        //强制拦截未登入(另外加入了测试权限控制效果，后台返回的tokenName值为'admin'才允许进入系统，否则提示账户无权限)
        if (setter.interceptor) {
          // 读取本地数据表的所有数据
          var local = layui.data(setter.tableName);
          // 如果本地数据表中没有access_token字段，则表示未登录，需要重定向至登录页
          // todo：else if是我手写的一个测试实例，如果当前的access_token值不是admin，那就重定向至"无权限提示页面"
          if (!local[setter.request.tokenName]) {
            return location.hash = '/user/login/redirect=' + encodeURIComponent(pathURL); //跳转到登入页
          } else if (local[setter.request.tokenName] && local[setter.request.tokenName] !== "admin") {
            return location.hash = '/template/tips/test';
          }
        }

        //渲染后台结构(独立页面的admin.pageType为'alone'，其他的为'console'),区别在于如果是当前值为alone，则需要渲染完layout模块后再执行renderPage()方法
        if (admin.pageType === 'console') { //后台主体页
          renderPage();
        } else {
          //初始控制台结构
          container.render('layout').done(function () {
            renderPage();
            layui.element.render();

            if (admin.screen() < 2) {
              admin.sideFlexible();
            }
            admin.pageType = 'console';
          });
        }
      }
    };

  //初始主体结构
  layui.link(
    setter.base + 'style/admin.css?v=' + (admin.v + '-1')
    , function () {
      entryPage()
    }
    , 'layuiAdmin'
  );

  // 新增字体图标样式
  layui.link(setter.base + 'font-awesome-4.7.0/css/font-awesome.min.css?v=' + (admin.v + '-1'));

  // 新增全局样式
  layui.link(setter.base + 'style/base.css?v=' + (admin.v + '-1'));

  //监听Hash改变
  window.onhashchange = function () {
    // todo:需要如何判断是否有权限访问某个模块
    /*if(layui.router().path[1] == 'access'){
      layui.data(setter.tableName, {
        key: 'access_token'
        ,value: 'normal'
      });
    }else{
      layui.data(setter.tableName, {
        key: 'access_token'
        ,value: 'admin'
      });
    }*/
    entryPage();
    //执行 {setter.MOD_NAME}.hash 下的事件
    layui.event.call(this, setter.MOD_NAME, 'hash({*})', layui.router());
  };

  //扩展 lib 目录下的其它模块
  layui.each(setter.extend, function (index, item) {
    var mods = {};
    mods[item] = '{/}' + setter.base + 'lib/extend/' + item;
    layui.extend(mods);
  });

  //对外输出
  exports('index', {
    render: renderPage
  });
});
