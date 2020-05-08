/**
 * @fileoverview 自定义事件调度器
 * @author Random | Random.Hao.Yang@gmail.com
 */

$package("aralork.events","EventDispatcher",
	function(target){
		this.__target=target;
		this.__events={};
	}.define({
		addEventListener:function(type,handle){
			if (!this.__checkFunction(handle)) {
				return;
			}
			
			var evts=this.__events;
			type=type.toLowerCase();
			
			!evts[type] && (evts[type]=[]);
			evts[type].push(handle);
		},
		removeEventListener:function(type,handle){
			var evts=this.__events[type];
			type=type.toLowerCase();
			
			if (!this.__checkFunction(handle) || !evts || !evts.length) {
				return;
			}
			for(var i=evts.length-1;i>=0;i--){
				evts[i]==handle && evts.splice(i,1);
			}
		},
		dispatchEvent:function(type){
			type=type.toLowerCase();
			var evts=this.__events[type];
			if (!evts || !evts.length) {
				return;
			}

			var args=Array.prototype.slice.call(arguments,1);
			for(var i=0,l=evts.length;i<l;i++){
				evts[i].apply(this.__target,args);
			}
		},
		
		__checkFunction:function(func){
			return typeof func !=="string" && String.prototype.slice.call(func, 0, 8) == "function";
		}
	})
);
