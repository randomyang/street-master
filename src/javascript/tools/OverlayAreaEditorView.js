/**
 * @fileoverview OverlayAreaEditorView 碰撞检测编辑器的视图区域
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2010-12-22
 */

$import("aralork.events.EventDispatcher");

$package("tools","OverlayAreaEditorView",

	function(container,img){
		this.scale=1;
		this.frame=1;
		this.frameCount=0;
		
		this.__container=container;
		this.__img=img;
		this.__orgImgW=0;
		this.__orgImgH=0;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
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
		
		render:function(imgSrc,w,h,frameCount){
			this.__img.src=imgSrc;
			this.frameCount=frameCount;
			this.__orgImgW=w;
			this.__orgImgH=h;
			this.setScale(1);
			
			return this;
		},
		
		setScale:function(sc){
			this.scale=sc;
			this.__img.style.width=this.__orgImgW*sc+"px";
			this.__img.style.height=this.__orgImgH*sc+"px";
			this.__container.style.width=parseInt(this.__img.style.width)/this.frameCount+"px";
			this.__container.style.height=this.__img.style.height;
			this.updateFrame(1);
			return this;
		},
		
		updateFrame:function(frame){
			this.__img.style.marginLeft=-(frame-1)*this.__img.width/this.frameCount+"px";
			this.__eventDispatcher.dispatchEvent("frameUpdated",frame);
			this.frame=frame;
			return this;
		},
		
		next:function(){
			this.updateFrame(Math.min(this.frame+1,this.frameCount));
		},
		
		previous:function(){
			this.updateFrame(Math.max(this.frame-1,1));
		}
	})
);
