/**
 * @fileoverview 菜单内容
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-04-05
 */

$import("aralork.events.EventDispatcher");
$import("aralork.utils.KeyListener");

$package("game.menu","MenuItemContent",

	/**
	 * 菜单内容类
	 * @param {Object} node
	 * @event
	 * 		show
	 * 		hidden
	 */
	function(node){
		this.__entity=node;
		this.__state="hidden";
		
		this.__keyListener=new aralork.utils.KeyListener(document);
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		
		this.__initEvent();
		
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
		
		show:function(){
			this.__state="show";
			this.__eventDispatcher.dispatchEvent("show");
			this.__entity && (this.__entity.style.display="");
		},
		
		hidden:function(){
			this.__state="hidden";
			this.__eventDispatcher.dispatchEvent("hidden");
			this.__entity && (this.__entity.style.display="none");
		},
		
		destroy:function(){
			this.__entity && this.__entity.parentNode && this.__entity.parentNode.removeChild(this.__entity); 
		},
		
		__initEvent:function(){
			var me=this;
			
			this.__keyListener.add(27,"keydown",function(){
				me.__state==="show" && me.hidden();
			});
		}
		
	})
);
