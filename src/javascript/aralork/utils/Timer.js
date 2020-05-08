/**
 * @fileoverview Timer类，实现计时器的功能
 * @author Random | Random.Hao.Yang@gmail.com
 * @demo
 * 		var timer=new aralork.utils.Timer(1000,10);
		timer.addEventListener("timer",function(){
			alert("timer");
		});
		timer.addEventListener("complete",function(){
			alert("complete");
		});
		timer.start();
 */

$import("aralork.events.EventDispatcher");

$package("aralork.utils","Timer",
	function(delay,repetCount){
		
		/**
		 * 间隔时间
		 */
		this.delay=delay || 40;
		
		/**
		 * 重复的次数,<=0为无限
		 */
		this.repetCount=repetCount || 0;
		
		this.state="stop";
		
		this.__time=0;
		this.__timerID=0;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
	}.define({
		
		/**
		 * 开始计时并在时间间隔内触发timer事件
		 */
		start:function(){
			if(this.state==="start"){
				return;
			}
			
			var me=this,
				rc=this.repetCount;
			
			this.state="start";
			
//			this.__timerID=window.setInterval(function(){
//				if(rc>0 && ++me.__time ===rc){
//					me.__eventDispatcher.dispatchEvent("timer");
//					window.setTimeout(function(){
//						me.stop();
//					},me.delay);
//				}else{
//					me.__eventDispatcher.dispatchEvent("timer");
//				}
//			},this.delay);
			
			(function timer(){
				if(rc>0 && ++me.__time ===rc){
					me.__eventDispatcher.dispatchEvent("timer");
					window.setTimeout(function(){
						me.stop();
					},me.delay);
				}else{
					window.clearTimeout(me.__timerID);
					me.__eventDispatcher.dispatchEvent("timer");
					me.state==="start" && (me.__timerID=window.setTimeout(arguments.callee,me.delay));
				}
			})();
			
			return this;
		},
		
		/**
		 * 暂停计时，保留当前的时间点
		 */
		pause:function(){
			window.clearTimeout(this.__timerID);
			//window.clearInterval(this.__timerID);
			this.__isStarted=false;
			this.state="pause";
			this.__eventDispatcher.dispatchEvent("pause");

			return this;
		},
		
		/**
		 * 停止计时，重置时间点
		 */
		stop:function(isCancelEvent){
			window.clearTimeout(this.__timerID);
			this.__time=0;
			this.__isStarted=false;
			this.state="stop";
			!isCancelEvent && this.__eventDispatcher.dispatchEvent("complete");
			
			return this;
		},
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * 					"timer"
		 * 					"pause"
		 * 					"complete"
		 * 
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件监听
		 * @param {String} type
		 * 					"timer"
		 * 					"pause"
		 * 					"complete"
		 * 
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		}
	})
);

