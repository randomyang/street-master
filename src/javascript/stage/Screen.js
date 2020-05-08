/**
 * @fileoverview 屏幕类
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-01-22
 */

$import("aralork.events.EventDispatcher");
$import("aralork.display.DisplayObject");
$import("aralork.lib.Lib");
$import("aralork.utils.Timer");

$package("stage","Screen",
	{
		entity:null,
		scale:1,
		canScroll:true,
		__elements:[],
		__backgroundMaxWidth:0,
		__backgroundMaxHeight:0,
		__eventDispatcher:new aralork.events.EventDispatcher(this),
		__flashEntity:null,
		__flashTimer:new aralork.utils.Timer(40,10),
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		setScale:function(sc){
			if(!sc || isNaN(sc)){
				return this;
			}
			var et=this.entity,
				els=this.__elements,
				i=els.length,
				x;
				
			this.scale=sc;
			et.style.width=384 * sc + "px";
			et.style.height=224 * sc + "px";

			while(i--){
				els[i].setScale(sc);
				els[i].width > this.__backgroundMaxWidth && (this.__backgroundMaxWidth= +els[i].width);
				els[i].height > this.__backgroundMaxHeight && (this.__backgroundMaxHeight= +els[i].height);
				
				x=-(els[i].width-et.offsetWidth)/2;
				els[i].setPosition({
					x:x
				});
				
				els[i].scrollValueX = x;
			}
			
			return this;
		},
		
		addBackground:function(displayObject,zIndex){
			var et=this.entity,
				w=et.offsetWidth;
				
			displayObject.setPosition({
				z:zIndex
			});
			
			displayObject.scrollValueY = 0;
			
			et.appendChild(displayObject.getEntity());
			this.__elements.push(displayObject);
			this.setScale(1);
			return this;
		},
		
		clearBackground:function(){
			var et=this.entity,
				eles=this.__elements,
				i=eles.length;
				
			while(i--){
				et.removeChild(eles[i].getEntity());
				eles[i].destroy();
			}
			
			this.__elements.length=0;
			this.__backgroundMaxWidth=0;
			this.__backgroundMaxHeight=0;
			
			return this;
		},
		
		scroll:function(scrollX,scrollY){
			var et=this.entity,
				els=this.__elements,
				w=et.offsetWidth,
				h=et.offsetHeight,
				i=els.length,
				deltaX=els[1].width / this.__backgroundMaxWidth * scrollX;
				
			if((scrollX>0 && els[1].scrollValueX+deltaX>0)
			|| (scrollX<0 && els[1].scrollValueX+deltaX+els[1].width<this.entity.offsetWidth)){
				this.canScroll=false;
				return this;
			}
			
			this.canScroll=true;
			while(i--){
				els[i].scrollValueX+=els[i].width / this.__backgroundMaxWidth * scrollX;
				els[i].scrollValueX+=els[i].height / this.__backgroundMaxHeight * scrollY;
				
				els[i].setPosition({
					x:els[i].scrollValueX,
					y:els[i].scrollValueY
				});
			}
			this.__eventDispatcher.dispatchEvent("scroll",scrollX,scrollY);
			
			return this;
		},
		
		getWidth:function(){
			return this.entity.offsetWidth;
		},
		
		getHeight:function(){
			return this.entity.offsetHeight;
		},
		
		/**
		 * 获取第一层背景图的x值
		 */
		getX:function(){
			if(this.__elements[1]){
				return +this.__elements[1].x;
			}else{
				return 0;
			}
		},
		
		/**
		 * 获取背景图层的宽度
		 */
		getInnerWidth:function(){
			if(this.__elements[1]){
				return +this.__elements[1].width;
			}else{
				return 0;
			}
		},
		
		/**
		 * 屏幕闪烁
		 */
		flash:function(){
			var fe,
				i=0,
				p=["show","hidden"];
			
			if(!this.__flashEntity){
				fe=this.__flashEntity=new aralork.display.DisplayObject(this.entity,"div",this.getWidth(),this.getHeight());
				fe.setPosition({
					z:32
				});
				fe.getEntity().style.backgroundColor="red";
				
				this.__flashTimer.addEventListener("timer",function(){
					fe[p[i++ % 2]].call(fe);
				})
				.addEventListener("complete",function(){
					fe.hidden();
				});
				
			}
			
			this.__flashTimer.start();
		}
	}
);
