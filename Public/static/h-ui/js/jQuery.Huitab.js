!function($) {
	$.fn.Huitab = function(options){
		var defaults = {
			tabBar:'.tabBar span',
			tabCon:".tabCon",
			className:"current",
			tabEvent:"click",
			index:0,
		}
		var options = $.extend(defaults, options);
		this.each(function(){
			var that = $(this);
			that.find(options.tabBar).removeClass(options.className);  //h4
			that.find(options.tabBar).eq(options.index).addClass(options.className);
			that.find(options.tabCon).hide();  //info
			that.find(options.tabCon).eq(options.index).show();   //info
			
			that.find(options.tabBar).on(options.tabEvent,function(){
				that.find(options.tabBar).removeClass(options.className);
				$(this).addClass(options.className);
				var index = that.find(options.tabBar).index(this);
				that.find(options.tabCon).hide();
				that.find(options.tabCon).eq(index).show();
			});
		});
	}
} (window.jQuery);