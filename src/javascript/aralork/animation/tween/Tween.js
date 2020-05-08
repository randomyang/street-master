$import("aralork.animation.tween.Transition");
$import("aralork.events.EventDispatcher");

$package("aralork.animation.tween","Tween",
	function(fps,startValue,endValue,duration,motion){
		
		/**
		 * 起始值
		 */
		this.startValue=startValue || 0;
		
		/**
		 * 结束值
		 */
		this.endValue=endValue || 0;
		
		/**
		 * 执行区间所需的时间(ms)
		 */
		this.duration=duration || 0;
		
		/**
		 * 运动公式的引用
		 */
		this.motion=motion || aralork.animation.tween.Transition.simple;
		
		this.fps=fps || 25;
		
		this.__itvID=0;
		this.__isTweenning=false;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
	}.define({
		
		/**
		 * 添加事件
		 * @param {String} type 事件类型
		 * 					"tween"
		 * 					"end"
		 * 
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			
			return this;
		},
		
		/**
		 * 移除事件
		 * @param {String} type 事件类型
		 * 					"tween"
		 * 					"end"
		 * 
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			
			return this;
		},
		
		/**
		 * 开始执行动画
		 */
		start:function(sv,ev,d,m){
			if(this.__isTweenning){
				return;
			}
			this.__isTweenning=true;
			
			var me=this,
				t,
				startTime=(new Date()).getTime(),
				dl=1000/this.fps;
			
			sv= typeof sv === "undefined" ? this.startValue : sv;
			ev= typeof ev === "undefined" ? this.endValue : ev;
			d && (this.duration=d);
			m && (this.motion=m);

			this.__itvID=window.setInterval(function(){
				t=((new Date()).getTime()-startTime)/1000;
				t>me.duration && (t=me.duration);
				me.__dispatchEvent(sv,ev,t);
				//me.__eventDispatcher.dispatchEvent("tween",me.motion(t,sv,ev-sv,me.duration));
				t===me.duration && me.stop();
			},dl);
			
			return this;
		},
		
		/**
		 * 停止动画
		 * @param {Boolean} isCancelEvent 是否取消onEnd事件
		 */
		stop:function(isCancelEvent){
			window.clearInterval(this.__itvID);
			this.__isTweenning=false;
			!isCancelEvent && this.__eventDispatcher.dispatchEvent("end");
			
			return this;
		},
		
		__dispatchEvent:function(sv,ev,t){
			var dpr=this.__eventDispatcher,
				i,
				retArr=[];
			
			if(typeof sv === "undefined"){
				this.stop();
				return;
			}else if(sv instanceof Array && ev instanceof Array){
				
				i=Math.min(sv.length,ev.length);
				while(i--){
					retArr.unshift(this.motion(t,sv[i],ev[i]-sv[i],this.duration));
				}
				dpr.dispatchEvent("tween",retArr);
				
			}else if(typeof sv === "number" && typeof ev === "number"){
				dpr.dispatchEvent("tween",this.motion(t,sv,ev-sv,this.duration));
			}
		}
	})
);
