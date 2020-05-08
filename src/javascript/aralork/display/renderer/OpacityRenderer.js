/**
 * @fileoverview OpacityRenderer类，以透明度的渐变来显示和隐藏对象
 * @author Random | Random.Hao.Yang@gmail.com
 */
$import("aralork.display.IRenderer");
$import("aralork.animation.tween.Transition");
$import("aralork.animation.tween.Tween");
$import("aralork.events.EventDispatcher");
$import("aralork.lib.Style");

$package("aralork.display.renderer","OpacityRenderer",
	function(duration){
		var me=this;
		
		this.__entity=null;
		this.__state="";
		this.__opacity=0;
		this.__transition=aralork.animation.tween.Transition;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		
		this.__tween=new aralork.animation.tween.Tween();
		this.__tween.duration=duration || 1;
		this.__initTweenEvent();
		
	}.$implements(aralork.display.IRenderer).define({
		
		/**
		 * 添加事件
		 * @param {String} type 事件类型
		 * 					"show"
		 * 					"hidden"
		 * 
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
		},
		
		/**
		 * 移除事件
		 * @param {String} type 事件类型
		 * 					"show"
		 * 					"hidden"
		 * 
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
		},
		
		/**
		 * 显示对象
		 */
		show:function(node){
			if(!node){
				return;
			}

			this.__entity=node;
			this.__tween.stop(true);
			this.__state="show";
			this.__tween.motion=this.__transition.strongEaseIn;
			this.__tween.startValue=this.__opacity;
			this.__tween.endValue=1;
			this.__entity.style.display="";
			this.__tween.start();
		},
		
		/**
		 * 隐藏对象
		 */
		hidden:function(node){
			if(!node){
				return;
			}
			
			this.__entity=node;
			this.__tween.stop(true);
			this.__state="hidden";
			this.__tween.motion=this.__transition.strongEaseOut;
			this.__tween.startValue=this.__opacity;
			this.__tween.endValue=0;
			this.__tween.start();
		},
		
		/**
		 * 初始化Tween对象的事件绑定
		 * @param {Object} node
		 */
		__initTweenEvent:function(){
			var me=this;
			
			this.__tween.addEventListener("onEnd",function(){
				me.__state=="show" && me.__eventDispatcher.dispatchEvent("show");
				
				if(me.__state=="hidden"){
					me.__eventDispatcher.dispatchEvent("hidden");
					me.__entity.style.display="none";
				}
				me.__entity=null;
			});
			
			this.__tween.addEventListener("onTween",function(v){
				me.__opacity=v;
				aralork.lib.Style.setOpacity(me.__entity,v);
			});
		}
	})
);