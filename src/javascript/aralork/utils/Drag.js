/**
 * @fileoverview 拖拽功能
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 * @date 2010-12-22
 * @example
 * 	var a=new aralork.utils.Drag(node1,[node2,node3]);
 * 
		a.addEventListener("beforeDrag",function(){
			alert("beforeDrag");
		}).addEventListener("afterDrag",function(){
			alert("afterDrag");
		}).addEventListener("drag",function(){
			alert("draging");
		});
		a.isLock=true;
		a.lockArea={
			left:0,
			top:0,
			right:500,
			bottom:500
		};
 */

$import("aralork.events.Event");
$import("aralork.events.EventManager");
$import("aralork.events.EventDispatcher");

$package("aralork.utils","Drag",
	/**
	 * 托拽类
	 * @param {Object} captureNode 捕获拖拽的节点
	 * @param {Array} attachNodes 被拖拽的节点,可传入数组,也可传入单独的节点,不传些参数时,为捕获拖拽的节点
	 * @param {Boolean} isDragCapureNode 是否拖拽捕获拖拽的节点(默认为true)
	 * @event
	 * 		beforeDrag 在准备托拽前触发
	 * 		afterDrag 在托拽完成后触发
	 * 		drag 托拽时触发
	 */
	function(captureNode,attachNodes,isDragCapureNode){
		var me=this;
		
		this.canDrag=true;
		this.isLock=false;
		this.lockArea={
			left:0,
			right:0,
			top:0,
			bottom:0
		};
		
		this.__captureNode=captureNode;
		this.__dragNodes=[];
		this.__deltaX=[];
		this.__deltaY=[];
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__isDraging=false;
		this.__canDragX=true;
		this.__canDragY=true;
		this.__eventManager=aralork.events.EventManager;
		
		this.__dragHandle=function(){
			me.__drag();
		};
		this.__mouseDownHandle=function(){
			me.__isDraging=true;
			me.__eventDispatcher.dispatchEvent("beforeDrag");
			me.__setCapture(true);
		};
		this.__mouseUpHandle=function(){
			me.__isDraging && me.__eventDispatcher.dispatchEvent("afterDrag");
			me.__isDraging=false;
			me.__setCapture(false);
		};
		
		this.__initNodes(captureNode,attachNodes,isDragCapureNode);
		this.__initCaputerNode();
		
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
		
		destroy:function(){
			this.__eventManager.removeEventListener(this.__captureNode,"mousedown",this.__mouseDownHandle);
			this.__eventManager.removeEventListener(document,"mouseup",this.__mouseUpHandle);
			this.__captureNode=null;
			this.__dragNodes=null;
		},
		
		/**
		 * 初始化托拽的节点
		 * @param {Object} captureNode
		 * @param {Object} attachNodes
		 * @param {Boolean} isDragCapureNode
		 */
		__initNodes:function(captureNode,attachNodes,isDragCapureNode){
			if(attachNodes){
				attachNodes instanceof Array?this.__dragNodes=attachNodes:this.__dragNodes.push(attachNodes);
				(typeof isDragCapureNode ==="undefined" || isDragCapureNode) && this.__dragNodes.push(this.__captureNode);
			}else{
				this.__dragNodes.push(this.__captureNode);
			}
			
			var dns=this.__dragNodes,
				i=dns.length;
	
			while(i--){
				!dns[i].style.position && (dns[i].style.position="absolute");
				!dns[i].style.left && (dns[i].style.left=0);
				!dns[i].style.top && (dns[i].style.top=0);
			}
		},
		
		/**
		 * 初始化可捕获的节点
		 */
		__initCaputerNode:function(){
			var cn=this.__captureNode,
				me=this;
	
			this.__eventManager.addEventListener(cn,"mousedown",this.__mouseDownHandle);
			this.__eventManager.addEventListener(document,"mouseup",this.__mouseUpHandle);
		},
		
		/**
		 * 设置捕获状态
		 * @param {Boolean} isCapture
		 */
		__setCapture:function(isCapture){
			var cn=this.__captureNode,
				dns=this.__dragNodes,
				evt=aralork.events.Event.getEvent(),
				i=dns.length;
			
			while(i--){
				this.__deltaX[i]=evt.clientX-parseInt(dns[i].style.left);
				this.__deltaY[i]=evt.clientY-parseInt(dns[i].style.top);
			}
			
			if(isCapture){
				if($IE){
					cn.setCapture();
					this.__eventManager.addEventListener(cn,"mousemove",this.__dragHandle);
				}else{
					this.__eventManager.addEventListener(document,"mousemove",this.__dragHandle);
				}
			}else{
				if($IE){
					cn.releaseCapture();
					this.__eventManager.removeEventListener(cn,"mousemove",this.__dragHandle);
				}else{
					this.__eventManager.removeEventListener(document,"mousemove",this.__dragHandle);
				}
			}
		},
		
		/**
		 * 拖拽
		 */
		__drag:function(){
			if(!this.canDrag){
				return;
			}
			
			var dns=this.__dragNodes,
				evt=aralork.events.Event.getEvent(),
				i=dns.length,
				la=this.lockArea,
				dX=0,
				dY=0;
				
			this.__eventDispatcher.dispatchEvent("drag");
			
			while(i--){
				dX=evt.clientX - this.__deltaX[i];
				dY=evt.clientY - this.__deltaY[i];
				
				if (this.isLock) {
					dX = Math.min(Math.max(dX, la.left),la.right);
					dY = Math.min(Math.max(dY, la.top),la.bottom);
				}
				
				dns[i].style.left=dX+"px";
				dns[i].style.top=dY+"px";
			}
		}
	})
);