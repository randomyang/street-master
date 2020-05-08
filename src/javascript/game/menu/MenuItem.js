/**
 * @fileoverview 菜单元素
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-04-05
 */

$import("aralork.lib.Style");
$import("aralork.events.EventDispatcher");
$import("aralork.utils.KeyListener");

$package("game.menu","MenuItem",

	/**
	 * 菜单元素类
	 * @param {String} w
	 * @param {String} h
	 * @event
	 * 		enter
	 */
	function(w,h){
		
		this.entity=null;
		this.enabled=true;
		
		this.ID=0;
		this.text="";
		
		this.__keyListener=new aralork.utils.KeyListener(document);
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__state="blur";
		this.width=w || 100;
		this.height=h || 25;
		
		this.__createIteam();
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
		
		focus:function(){
			this.entity.style.backgroundColor="#ffff00";
			this.entity.style.fontWeight="bold";
			this.__state="focus";
		},
		
		blur:function(){
			this.entity.style.backgroundColor="#ffffff";
			this.entity.style.fontWeight="";
			this.__state="blur";
		},
		
		setText:function(text){
			this.text=text;
			this.entity.innerHTML=text;
		},
		
		destroy:function(){
			var et=this.entity;
			et.innerHTML="";
			et.parentNode && et.parentNode.removeChild(et);
			this.entity=null; 
		},
		
		__createIteam:function(){
			var et;
			et=this.entity=$C("div");
			et.style.fontSize="12px";
			et.style.width=this.width+"px";
			et.style.height=this.height+"px";
			et.style.padding=$IE6 ? "2px" : "5px 2px 5px 2px";
			et.style.margin="10px 2px 10px 2px";
			et.style.textAlign="center";
			et.style.backgroundColor="#ffffff";
			
			aralork.lib.Style.setOpacity(et,0.8);
			
		},
		
		__initEvent:function(){
			var me=this;
			
			this.__keyListener.add(13,"keydown",function(){
				me.enabled && me.__state==="focus" && me.__eventDispatcher.dispatchEvent("enter");
			});
		}
	})
);
