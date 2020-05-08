/**
 * @fileoverview DisplayObject类，所有显示对象的基类
 * @author Random | Random.Hao.Yang@gmail.com
 */

$import("aralork.display.IRenderer");
$import("aralork.lib.Lib");
$import("aralork.events.EventDispatcher");
$import("aralork.display.renderer.SimpleRenderer");

$package("aralork.display","DisplayObject",
	function(parent,tagName,w,h){
		var Lib=aralork.lib.Lib;
		var me=this;
		
		Lib.defineGetter(this,
			["x","y","z","width","height","scale"],
			[this.__getX,this.__getY,this.__getZ,this.__getWidth,this.__getHeight,this.__getScale]);
		
		this.__entity=null;
		this.__simpleRenderer=new aralork.display.renderer.SimpleRenderer();
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__orgW=w || 0;
		this.__orgH=h || 0;
		this.__scale=1;
		this.__parent=parent;

		this.__initEntity(parent,tagName,w,h);
		
	}.define({
		
		/**
		 * 设置位置
		 * @param {Object} param
		 * 					x:Number
		 * 					y:Number
		 * 					zIndex:Number
		 */
		setPosition:function(param){
			typeof param.x!=="undefined" && (this.__entity.style.left=param.x+"px");
			typeof param.y!=="undefined" && (this.__entity.style.top=param.y+"px");
			typeof param.z!=="undefined" && (this.__entity.style.zIndex=param.z);
			return this;
		},
		
		/**
		 * 设置大小
		 * @param {Object} param
		 * 					w:宽度
		 * 					h:高度
		 */
		setSize:function(param){
			typeof param.w!=="undefined" && (this.__entity.style.width=param.w+"px");
			typeof param.h!=="undefined" && (this.__entity.style.height=param.h+"px");
			return this;
		},
		
		/**
		 * 设置缩放比例
		 * @param {Number} sc
		 */
		setScale:function(sc){
			sc=isNaN(sc)?1:sc;
			this.__entity.style.width=this.__orgW*sc+"px";
			this.__entity.style.height=this.__orgH*sc+"px";
			this.__scale=sc;
			return this;
		},
		
		/**
		 * 显示对象
		 * @param {IRenderer} renderer
		 */
		show:function(renderer){
			if(renderer){
				renderer.show(this.__entity);
			}else{
				this.__simpleRenderer.show(this.__entity);
			}
			return this;
		},
		
		/**
		 * 隐藏对象
		 * @param {IRenderer} renderer
		 */
		hidden:function(renderer){
			if(renderer){
				renderer.hidden(this.__entity);
			}else{
				this.__simpleRenderer.hidden(this.__entity);
			}
			return this;
		},
		
		getEntity:function(){
			return this.__entity;
		},
		
		/**
		 * 添加事件
		 * @param {String} type 事件类型
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		/**
		 * 移除事件
		 * @param {String} type 事件类型
		 * @param {Function} handle
		 */
		removeEventListener:function(type,handle){
			this.__eventDispatcher.removeEventListener(type,handle);
			return this;
		},
		
		destroy:function(){
			this.__entity && this.__entity.parentNode && this.__entity.parentNode.removeChild(this.__entity);
			this.__entity=null;
		},
		
		/**
		 * 初始化显示的对象节点
		 */
		__initEntity:function(parent,tagName,w,h){
			var st,
				tgn=!tagName || tagName==="none"?
					"div":
					tagName;
			
			parent=parent || document.body;
			
			if(typeof tgn==="object"){
				this.__entity=tgn;
			}else{
				this.__entity=$C(tgn);
			}
			
			st=this.__entity.style;
			st.position="absolute";
			st.left=0;
			st.top=0;
			st.fontSize=0;
			st.zIndex=0;
			st.width=w+"px";
			st.height=h+"px";
			
			if(tagName!=="none"){
				parent.appendChild(this.__entity);
			}
		},
		
		/**
		 * 获取X坐标值
		 */
		__getX:function(){
			return parseInt(this.__entity.style.left);
		},
		
		/**
		 * 获取Y坐标值
		 */
		__getY:function(){
			return parseInt(this.__entity.style.top);
		},
		
		/**
		 * 获取对象深度(z坐标)
		 */
		__getZ:function(){
			return parseInt(this.__entity.style.zIndex);
		},
		
		/**
		 * 获取宽度
		 */
		__getWidth:function(){
			var w=parseInt(this.__entity.style.width);
			return w || this.__getSize(this.__entity,"offsetWidth");
		},
		
		/**
		 * 获取高度
		 */
		__getHeight:function(){
			var h=parseInt(this.__entity.style.height);
			return h || this.__getSize(this.__entity,"offsetHeight");
		},
		
		/**
		 * 获取比例
		 */
		__getScale:function(){
			return this.__scale;
		},
		
		/**
		 * 获取尺寸，对象在不可见状态下也能获取到真实的尺寸
		 * @param {String} p
		 */
		__getSize:function(node,p){
			var et=node,
				v,
				ov=et.style.visibility;
				
			if(et.style.display=="none"){
				et.style.visibility="hidden";
				et.style.display="";
				v=et[p];
				et.style.display="none";
				et.style.visibility=ov;
			}else{
				v=et[p];
			}
			
			return v;
		}
	})
);
