/**

 @Name：layuiAdmin 视图模块
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */
 
layui.define(['laytpl', 'layer'], function(exports){
  var $ = layui.jquery
  ,laytpl = layui.laytpl
  ,layer = layui.layer
  ,setter = layui.setter
  ,device = layui.device()
  ,hint = layui.hint()

  ,SHOW = 'layui-show', LAY_BODY = 'LAY_app_body'

  //构造器
  ,Class = function(id){
    this.id = id;
    this.container = $('#'+(id || LAY_BODY));
  }

  //对外接口
  ,view = function(id){
    return new Class(id);
  };
  
  //加载中
  view.loading = function(elem){
    elem.append(
      this.elemLoad = $('<i class="layui-anim layui-anim-rotate layui-anim-loop layui-icon layui-icon-loading layadmin-loading"></i>')
    );
  };
  //移除加载
  view.removeLoad = function(){
    this.elemLoad && this.elemLoad.remove();
  };
  // 调用：view.loading($('.layui-fluid'))
  // 关闭：view.removeLoad()
  
  //清除 token，并跳转到登入页
  view.exit = function(){
    //清空本地记录的 token
    layui.data(setter.tableName, {
      key: setter.request.tokenName
      ,remove: true
    });
    //跳转到登入页
    location.hash = '/user/login'; 
  };

  //Ajax请求(获取菜单等是调用此方法，默认携带本地数据域中tokenName值)
  view.req = function(options){
    var that = this
    ,success = options.success
    ,error = options.error
    ,request = setter.request
    ,response = setter.response
    ,debug = function(){
      return setter.debug 
        ? '<br><cite>URL：</cite>' + options.url
      : '';
    };
    
    options.data = options.data || {};
    options.headers = options.headers || {};
    
    if(request.tokenName){
      //自动给参数传入默认 token
      options.data[request.tokenName] = request.tokenName in options.data 
        ?  options.data[request.tokenName]
      : (layui.data(setter.tableName)[request.tokenName] || '');
      
      //自动给 Request Headers 传入 token
      options.headers[request.tokenName] = request.tokenName in options.headers 
        ?  options.headers[request.tokenName]
      : (layui.data(setter.tableName)[request.tokenName] || '');
    }
    
    delete options.success;
    delete options.error;

    // 传入options对象扩展jQuery原有的ajax方法
    return $.ajax($.extend({
      type: 'get'
      ,dataType: 'json'
      ,success: function(res){
        var statusCode = response.statusCode;
        
        //只有 response 的 code 一切正常才执行 done
        if(res[response.statusName] == statusCode.ok) {
          typeof options.done === 'function' && options.done(res); 
        } 
        
        //登录状态失效，清除本地 access_token，并强制跳转到登入页
        else if(res[response.statusName] == statusCode.logout){
          view.exit();
        }
        
        //其它异常
        else {
          var error = [
            '<cite>Error：</cite> ' + (res[response.msgName] || '返回状态码异常')
            ,debug()
          ].join('');
          view.error(error);
        }
        
        //只要 http 状态码正常，无论 response 的 code 是否正常都执行 success
        typeof success === 'function' && success(res);
      }
      ,error: function(e, code){
        var error = [
          '请求异常，请重试<br><cite>错误信息：</cite>'+ code 
          ,debug()
        ].join('');
        view.error(error);
        typeof error === 'function' && error(res);
      }
    }, options));
  };
  
  //弹窗
  view.popup = function(options){
    var success = options.success
    ,skin = options.skin;
    
    delete options.success;
    delete options.skin;
    
    return layer.open($.extend({
      type: 1
      ,title: '提示'
      ,content: ''
      ,id: 'LAY-system-view-popup'
      ,skin: 'layui-layer-admin' + (skin ? ' ' + skin : '')
      ,shadeClose: true
      ,maxmin: false
      ,closeBtn: false
      // success为弹出窗口后的回调方法，会携带两个参数，分别是当前层DOM当前层索引
      ,success: function(layero, index){
        var elemClose = $('<i class="layui-icon" close>&#x1006;</i>');
        layero.append(elemClose);
        elemClose.on('click', function(){
          layer.close(index);
        });
        typeof success === 'function' && success.apply(this, arguments);
      }
    }, options))
  };
  
  //异常提示
  view.error = function(content, options){
    return view.popup($.extend({
      content: content
      ,maxWidth: 300
      //,shade: 0.01
      ,offset: 't'
      ,anim: 6
      ,id: 'LAY_adminError'
    }, options))
  };
  
  //请求各模板文件渲染
  Class.prototype.render = function(views, params){
    var that = this, router = layui.router();
    views = setter.views + views + setter.engine;

    $('#'+ LAY_BODY).children('.layadmin-loading').remove();
    view.loading(that.container); //loading
    
    //请求模板（新增传入本地数据域中access_token值,以下是es5设置动态属性的写法，如果项目使用了es6，则可以直接在定义时候动态设置属性）
    var datas = {};
    datas[setter.request.tokenName] = layui.data(setter.tableName)[setter.request.tokenName];
    datas.v = layui.cache.version;
    $.ajax({
      url: views
      ,type: 'get'
      ,dataType: 'html'
      ,data: datas
      ,success: function(html){
        html = '<div>' + html + '</div>';
        
        var elemTitle = $(html).find('title')
        ,title = elemTitle.text() || (html.match(/\<title\>([\s\S]*)\<\/title>/)||[])[1];

        var res = {
          title: title
          ,body: html
        };
        
        elemTitle.remove();
        that.params = params || {}; //获取参数

        // 请求成功执行回调
        if(that.then){
          that.then(res);
          delete that.then;
        }
        // 解析插入
        that.parse(html);
        view.removeLoad();

        // 解析成功执行回调
        if(that.done){
          that.done(res);
          delete that.done;
          // 在此判读是否传入回调函数，如果有则执行回调 (todo: 多此一举的操作，鉴于之前已使用了这种处理，所以在暂时不删如下判断代码)
          if(that.params.callback){
            that.params.callback()
          }
        }
        
      }
      ,error: function(e){
        view.removeLoad();
        
        if(that.render.isError){
          return view.error('请求视图文件异常，状态：'+ e.status);
        };
        
        if(e.status === 404){
          that.render('template/tips/404');
        } else {
          that.render('template/tips/error');
        }
        that.render.isError = true;
      }
    });
    return that;
  };
  
  //解析模板
  Class.prototype.parse = function(html, refresh, callback){
    var that = this
    ,isScriptTpl = typeof html === 'object' //是否模板元素
    ,elem = isScriptTpl ? html : $(html)
    ,elemTemp = isScriptTpl ? html : elem.find('*[template]')
    ,fn = function(options){
      var tpl = laytpl(options.dataElem.html());
      
      options.dataElem.after(tpl.render($.extend({
        params: router.params
      }, options.res)));

      typeof callback === 'function' && callback();
      
      try {
        options.done && new Function('d', options.done)(options.res);
      } catch(e){
        console.error(options.dataElem[0], '\n存在错误回调脚本\n\n', e)
      }
    }
    ,router = layui.router();
    
    elem.find('title').remove();
    that.container[refresh ? 'after' : 'html'](elem.children());
    
    router.params = that.params || {};
    
    //遍历模板区块
    for(var i = elemTemp.length; i > 0; i--){
      (function(){
        var dataElem = elemTemp.eq(i - 1)
        ,layDone = dataElem.attr('lay-done') || dataElem.attr('lay-then') //获取回调
        ,url = laytpl(dataElem.attr('lay-url')|| '').render(router) //接口 url
        ,data = laytpl(dataElem.attr('lay-data')|| '').render(router) //接口参数
        ,headers = laytpl(dataElem.attr('lay-headers')|| '').render(router); //接口请求的头信息
        
        try {
          data = new Function('return '+ data + ';')();
        } catch(e) {
          hint.error('lay-data: ' + e.message);
          data = {};
        };
        
        try {
          headers = new Function('return '+ headers + ';')();
        } catch(e) {
          hint.error('lay-headers: ' + e.message);
          headers = headers || {}
        };
        
        if(url){
          view.req({
            type: dataElem.attr('lay-type') || 'get'
            ,url: url
            ,data: data
            ,dataType: 'json'
            ,headers: headers
            ,success: function(res){
              fn({
                dataElem: dataElem
                ,res: res
                ,done: layDone
              });
            }
          });
        } else {
          fn({
            dataElem: dataElem
            ,done: layDone
          });
        }
      }());
    }
    
    return that;
  };
  
  //直接渲染字符
  Class.prototype.send = function(views, data){
    var tpl = laytpl(views || this.container.html()).render(data || {});
    this.container.html(tpl);
    return this;
  };
  
  //局部刷新模板
  Class.prototype.refresh = function(callback){
    var that = this
    ,next = that.container.next()
    ,templateid = next.attr('lay-templateid');
    
    if(that.id != templateid) return that;
    
    that.parse(that.container, 'refresh', function(){
      that.container.siblings('[lay-templateid="'+ that.id +'"]:last').remove();
      typeof callback === 'function' && callback();
    });
    
    return that;
  };
  
  //视图请求成功后的回调
  Class.prototype.then = function(callback){
    this.then = callback;
    return this;
  };
  
  //视图渲染完毕后的回调
  Class.prototype.done = function(callback){
    this.done = callback;
    return this;
  };
  
  //对外接口
  exports('view', view);
});