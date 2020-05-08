/**
 * @fileoverview 键盘按键监听类
 * @author Random | Random.Hao.Yang@gmail.com
 * @demo
 * 		var kl=new aralork.utils.KeyListener(document);
		kl.add(66,"keydown",function(){
			alert(this.node)
		});
 */

$import("aralork.events.Event");
$import("aralork.events.EventManager");
$import("aralork.utils.KeyListenerType");

$package("aralork.utils","KeyListener",
	function(node){
		this.node=node || document;
		this.__types={};
		this.__events={};
	}.define({
		
		/**
		 * 添加按键侦听
		 * @param {Number} code
		 * @param {String} type
		 * @param {Function} handle
		 */
		add:function(code,type,handle){
			if(!this.__checkedType(type)){
				return;
			}
			var me=this;
			
			!this.__events[type+"_"+code] && (this.__events[type+"_"+code]={
				code:code,
				type:type,
				handles:[]
			});
			
			this.__events[type+"_"+code].handles.unshift(handle);
			
			if(!this.__types[type]){
				this.__types[type]=1;
				aralork.events.EventManager.addEventListener(this.node,type,function(){
					me.__callHandle(type);
				});
			}
			
			return this;
		},
		
		/**
		 * 移除按键侦听
		 * @param {Number} code
		 * @param {String} type
		 * @param {Function} handle 要移除的function,如果不指定则移除当前code和type的所有function
		 */
		remove:function(code,type,handle){
			if(!this.__events[type+"_"+code]){
				return;
			}
			var k,
				evt,
				i;
			
			for(k in this.__events){
				evt=this.__events[k];
				if(evt.code==code && evt.type==type){
					if(handle){
						i=evt.handles.length;
						while(i--){
							evt.handles[i]==handle && evt.handles.splice(i,1);
						}
					}else{
						evt.handles=[];
					}
				} 
			}
			
			return this;
		},
		
		/**
		 * 调用绑定的function
		 */
		__callHandle:function(type){
			var k,
				evt,
				i,
				keyCode=aralork.events.Event.getKeyCode();
				
			for(k in this.__events){
				evt=this.__events[k];
				if(evt.code==keyCode && evt.type==type){
					i=evt.handles.length;
					while(i--){
						evt.handles[i].call(this,evt.code);
					}
				}
			}
		},
		
		/**
		 * 检测事件类型的合法性,事件类型必须包括在KeyListenerType中
		 * @param {String} type 
		 */
		__checkedType:function(type){
			var k,
				klt=aralork.utils.KeyListenerType;
				
			for(k in klt){
				if(klt[k]===type){
					return true;
				}
			}
			return false;
		}
	})
);
