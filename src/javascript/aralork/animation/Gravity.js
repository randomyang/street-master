/**
 * @fileoverview 重力下落
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random

 * @date 2010-12-20
 * @example
 * 		var gravity=new aralork.animation.Gravity(3,30);
		gravity.addEventListener("falling",function(v){
			fighter.setPosition({
				y:v
			});
		});
		gravity.fallDown(0,500)	
 */

$import("aralork.utils.Timer");
$import("aralork.events.EventDispatcher");

$package("aralork.animation","Gravity",

	/**
	 * 重力下落类
	 * @param {Number} deltaT
	 * @param {Number} fps
	 * @event
	 * 		falling
	 * 		complete
	 * 
	 */
	function(deltaT,fps){
		this.fps=fps || 25;
		
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__timer=new aralork.utils.Timer(1000/fps);
		this.__deltaT=deltaT || 1;
		this.__endY=0;
		this.__startY=0;
		this.__g=0.98;
		this.__t=0;
		this.__value=0;
		
		this.__initTimer();
	}.define({
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		},
		
		fallDown:function(startY,endY,g){
			this.__t=0;
			this.__g=g || 0.98;
			this.__startY=startY;
			this.__endY=endY;
			this.__timer.start();
		},
		
		stop:function(){
			this.__timer.stop();
			this.__eventDispatcher.dispatchEvent("complete",this.__value);
		},
		
		__fn:function(t){
			return this.__g*t*t/2;
		},
		
		__initTimer:function(){
			var me=this;
			
			this.__timer.addEventListener("timer",function(){
				me.__value=Math.min(me.__startY + me.__fn(me.__t),me.__endY);
				me.__eventDispatcher.dispatchEvent("falling",me.__value);
				if (me.__value === me.__endY && me.__t !== 0) {
					this.stop();
					me.__eventDispatcher.dispatchEvent("complete",me.__value);
				}
				me.__t+=me.__deltaT;
			});
		}
	})
);