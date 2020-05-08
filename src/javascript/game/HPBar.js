/**
 * @fileoverview 血槽
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-03-31
 */

$import("aralork.events.EventDispatcher");
$import("aralork.display.DisplayObject");
$import("aralork.utils.Timer");

$package("game","HPBar",

	/**
	 * 血槽类
	 * @param {Object} bar
	 * @event
	 * 		decreaseComplete 
	 */
	function(bar){
		
		/**
		 * 方向
		 * 		1,从左向右
		 * 		2,从右向左
		 */
		this.direction=1;
		
		this.max=200;
		this.value=0;
		
		this.__bar=bar;
		this.__decWidthQueue=[];
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__timer=new aralork.utils.Timer(20);
		this.__barWidth=0;
		this.__decWidth=0;
		this.__scale=1;
		
		this.__init();
		this.__initTimer();
		
	}.define({
		
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
		},
		
		/**
		 * 减少指定值
		 * @param {Number} v
		 */
		decrease:function(v){
			this.__decWidthQueue.push(v/this.max*this.__barWidth);
			this.value-=v;
			if(this.__decWidthQueue.length===1 && this.__timer.state==="stop"){
				this.__decWidth=this.__decWidthQueue.pop();
				this.__timer.start();
			}
		},
		
		/**
		 * 重置长度
		 */
		reset:function(){
			this.__bar.style.width=this.__barWidth+"px";
			this.direction===1 && (this.__bar.style.left=(parseInt(this.__bar.style.left)-this.__barWidth)+"px");
			this.value=this.max;
		},
		
		__init:function(){
			this.__barWidth=parseInt(this.__bar.style.width);
			this.value=this.max;
		},
		
		__initTimer:function(){
			var timer=this.__timer,
				me=this,
				bar=this.__bar,
				
				sum=0;
			
			timer.addEventListener("timer",function(){
				bar.style.width=(parseInt(bar.style.width)-1)+"px";
				me.direction===1 && (bar.style.left=(parseInt(bar.style.left)+1)+"px");
				(sum++ >= me.__decWidth || !parseInt(bar.style.width)) && this.stop();
			})
			
			.addEventListener("complete",function(){
				sum=0;
				if(me.__decWidthQueue.length > 0 && me.value>0){
					me.__decWidth=me.__decWidthQueue.pop();
					me.__timer.start();
				}
				
				me.__eventDispatcher.dispatchEvent("decreaseComplete",me.value,parseInt(me.__bar.style.width));
			});
		}
	})
);
