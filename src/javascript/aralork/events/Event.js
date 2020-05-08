/**
 * @fileoverview 事件静态类
 * @author Random | Random.Hao.Yang@gmail.com
 */

$package("aralork.events","Event",
	{
		/**
		 * 获取触发事件的目标对象
		 */
		getTarget:function(){
			var e=aralork.events.Event.getEvent();
			return e.target || e.srcElement;
		},
		
		/**
		 * 获取被触发的事件
		 */
		getEvent:function(){
			if (window.event) {
				return window.event;
			}else {
				var fn=arguments.callee.caller,
					e=null,
					n=30;

				while(fn!=null && n--){
					e=fn.arguments[0];
					if(e && (e.constructor==Event || e.constructor==MouseEvent)){
						return e;
					}
					fn=fn.caller;
				}
				return e;
			}
		},
		
		/**
		 * 如果是触发的按键事件,可以获取到按键的值
		 */
		getKeyCode:function(){
			return aralork.events.Event.getEvent().keyCode;
		},
		
		/**
		 * 停止事件的传播
		 */
		stop:function(){
			var e=aralork.events.Event.getEvent();
			if(e.stopPropagation){
				e.stopPropagation();
			}else{
				e.cancelBubble=true;
			}
		},
		
		/**
		 * 取消事件,以阻止浏览器响应事件
		 */
		cancel:function(){
			var e=aralork.events.Event.getEvent();
			if(e.preventDefault){
				e.preventDefault();
			}else{
				e.returnValue=false;
			}
		}
	}
);
