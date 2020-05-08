/**
 * @fileoverview Load
 * @author Random | Random.Hao.Yang@gmail.com
 */
(function(){
	var tid,
		isFunction=function(fn){
			return !!fn && !fn.nodeName && fn.constructor != String 
					&& fn.constructor != RegExp && fn.constructor != Array 
					&& (/function/i).test(fn + "");
		};

	function load(){
		if(typeof(__Main__)!="undefined" && isFunction(__Main__)){
			__Main__.call();
		}
	}
	
	if (/msie/.test(navigator.userAgent.toLowerCase())) {
		tid = setTimeout(function(){
			try {
				document.body.doScroll("left");
				clearTimeout(tid);
				load();
				return;
			}
			catch (ex) {}
			arguments.callee.call();
		}, 1000);
	}
	else if (/webkit/i.test(navigator.userAgent.toLowerCase())) {
		tid=setTimeout(function(){
			if (/loaded|complete/i.test(document.readyState)) {
				clearTimeout(tid);
				load();
				return;
			}
			else {
				arguments.callee.call();
			}
		},1000);
	}
	else if(document.addEventListener){
		document.addEventListener("DOMContentLoaded", function(){
			load();
		}, false);
	}
})(); 