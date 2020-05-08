/**
 * @fileoverview 抛物线公式
 * @author Random | Random.Hao.Yang@gmail.com
 * @example
 * 		var d=parseInt($E("debug").style.top);
		var pa=new aralork.animation.Parabola(1,40);
		pa.addEventListener("throw",function(v){
			$E("debug").style.top=v+d+"px";
			$E("debug").style.left=parseInt($E("debug").style.left)+10+"px";
		})
		.addEventListener("complete",function(v){
			alert("ok");
		});
		pa.start(40);
 */
$import("aralork.utils.Timer");
$import("aralork.events.EventDispatcher");

$package("aralork.animation","Parabola",

	/**
	 * 抛物线公式计算类
	 * @param {Number} deltaT 时间的增量
	 * @param {Number} fps
	 * @event
	 * 		throw 正在进行抛物计算时触发
	 * 		complete 计算完成时触发
	 */
	function(deltaT,fps){
		fps=fps || 25;
		
		this.__timer=new aralork.utils.Timer(1000/fps);
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__deltaY=0;
		this.__deltaT=deltaT || 1;
		this.__t=0;
		this.__endValue=0;
		this.__g=0;
		
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
		
		/**
		 * 开始执行动画，如果不传参数则从暂停点继续执行
		 * @param {Number} deltaY
		 * @param {Number} g
		 * @param {Number} endValue
		 */
		start:function(deltaY,g,endValue){
			if(arguments.length){
				this.__deltaY=deltaY || 0;
				this.__g=g;
				this.__endValue=endValue || this.__fn(deltaY,0,g);
				this.__t=0;
			}
			
			this.__timer.start();
			return this;
		},
		
		pause:function(){
			this.__timer.pause();
			return this;
		},
		
		stop:function(){
			this.__timer.stop();
			return this;
		},
		
		__fn:function(v,t,g){
			typeof g==="undefined" && (g=0.98);
			return v*t-0.5*g*t*t;
		},
		
		__initTimer:function(){
			var me=this,
				v;
			
			this.__timer.addEventListener("timer",function(){
				
				v=Math.min(-me.__fn(me.__deltaY,me.__t,me.__g),me.__endValue);
				me.__eventDispatcher.dispatchEvent("throw",v);
				if (v === me.__endValue && me.__t!==0) {
					me.stop();
					me.__eventDispatcher.dispatchEvent("complete");
				}
				me.__t+=me.__deltaT;
			});
		}
	})
);
