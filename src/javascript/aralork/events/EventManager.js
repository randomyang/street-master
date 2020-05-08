/**
 * @fileoverview 事件管理静态类
 * @author Random | Random.Hao.Yang@gmail.com
 * @demo
 * 		aralork.events.EventManager.addEventListener(node,"click",function(){
 * 			alert("click");
 * 		},true);
 */

$package("aralork.events","EventManager",
	{
		/**
		 * 为页面节点添加事件
		 * @param {Object} node
		 * @param {String} type
		 * @param {Function} handle
		 * @param {Boolean} isCapture
		 */
		addEventListener:function(node,type,handle,isCapture){
			if(!this.__checkedNode(node)){
				return;
			}

			if(node.addEventListener){
				node.addEventListener(type,handle,!!isCapture);
			}else if(node.attachEvent){
				node.attachEvent("on"+type,handle);
			}else{
				node["on"+type]=handle;
			}
		},
		
		/**
		 * 从指定的页面节点移除已经添加的事件
		 * @param {Object} node
		 * @param {String} type
		 * @param {Function} handle
		 * @param {Boolean} isCapture
		 */
		removeEventListener:function(node,type,handle,isCapture){
			if(!this.__checkedNode(node)){
				return;
			}
			
			if(node.removeEventListener){
				node.removeEventListener(type,handle,!!isCapture);
			}else if(node.detachEvent){
				node.detachEvent("on"+type,handle);
			}else{
				node["on"+type]="";
			}
		},
		
		/**
		 * 检测节点合法性
		 * @param {Object} node
		 */
		__checkedNode:function(node){
			return (typeof node==="object");
		}
	}
);
