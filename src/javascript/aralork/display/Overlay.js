/**
 * @fileoverview Overlay，碰撞检测类
 * @author Random | Random.Hao.Yang@gmail.com
 */

$import("aralork.display.DisplayObject");

$package("aralork.display","Overlay",

	/**
	 * 碰撞检测类，继承于DisplayObject类
	 * @param {Obejct} parent 添加对象的父节点
	 * @param {String} group 组名
	 * @param {Number} w 宽
	 * @param {Number} h 高
	 * @param {Array} ol 碰撞检测对象列表，用于跟当前检测对象遍历判断是否有重叠产生
	 * @event
	 * 		"overlaying" 两个碰撞检测对象发生重叠时触发
	 * 	
	 */
	function(parent,tagName,w,h,group,ol){
		
		/**
		 * 分组的标识，不同实例可以通过设置相同的分组标识来判断分组(我发现我写注释的水平有待提高╮(╯▽╰)╭。。。)
		 */
		this.group=group || null;
		
		this.enabled=true;
		
		this.__overlayList=ol || [];
		
		this.hidden();
		
		//调试用
		this.updateEnabled=function(){
			//this.__entity.style.borderColor=this.enabled?"red":"#c8c8c8";
			//this.__entity.style.display=this.enabled?"":"none";
		};
		
	}.$extends(aralork.display.DisplayObject).define({
		
		/**
		 * 设置位置，重写了父类的setPosition方法
		 * @param {Object} param
		 * 					x:Number
		 * 					y:Number
		 * 
		 */
		setPosition:function(param){
			aralork.display.Overlay.$super.setPosition.call(this,param);

			//调试用
//			var st=this.__entity.style;
//			st.border="1px solid red";
//			st.display="";
			
			this.check();

			return this;
		},
		
		/**
		 * 设置要碰撞的碰撞元素列表
		 * @param {Array} ol
		 */
		setOverlayList:function(ol){
			this.__overlayList=ol instanceof Array ? ol:[ol];
			return this;
		},
		
		/**
		 * 添加要碰撞的碰撞元素列表
		 * @param {Object} ol
		 */
		addOverlayList:function(ol){
			this.__overlayList=this.__overlayList.concat(ol instanceof Array ? ol:[ol]);
			return this;
		},

		/**
		 * 强制触发事件
		 * @param {String} type
		 */
		fireEvent:function(type){
			var args=Array.prototype.slice.call(arguments,1),
				eventDispatcher=this.__eventDispatcher;
				
			args.unshift(type);
			eventDispatcher.dispatchEvent.apply(eventDispatcher,args);
			return this;
		},
		
		/**
		 * 遍历检测对象的重叠情况
		 */
		check:function(){
			if(!this.enabled){
				return this;
			}
			var ol=this.__overlayList,
				i=ol.length,
				o;
			
			while(i--){
				o=ol[i];
				if(o && o!==this && o.enabled && this.__checkOverlaying(o)){
					this.fireEvent("overlaying",o,this.__checkRect(this,o));
					o.fireEvent("overlaying",this,this.__checkRect(o,this));
				}
			}
			return this;
		},
		
		destroy:function(){
			
		},
		
		/**
		 * 判断对象是否有矩形重叠
		 * @param {DisplayObject} dispObj
		 */
		__checkOverlaying:function(dispObj){
			var x1= +this.x,
				y1= +this.y,
				w1= +this.width,
				h1= +this.height,
				x2= +dispObj.x,
				y2= +dispObj.y,
				w2= +dispObj.width,
				h2= +dispObj.height;
			
			return	x2 < x1 + w1
					&& x2 + w2 > x1
					&& y2 < y1 + h1
					&& y2 + h2 > y1;
		},
		
		/**
		 * 检测两个对象碰撞的矩形区域,4个坐标分别为左上、右上、右下、左下
		 * @param {DisplayObject} dispObj1
		 * @param {DisplayObject} dispObj2
		 * @return 
		 * 		[
		 * 			{x:1,y:1},
		 * 			{x:2,y:1},
		 * 			{x:2,y:2},
		 * 			{x:1,y:2},
		 * 		]
		 */
		__checkRect:function(dispObj1,dispObj2){
			var x1=Math.max(+dispObj1.x,+dispObj2.x),
				y1=Math.max(+dispObj1.y,+dispObj2.y),
				
				x2= x1===dispObj1.x?
						dispObj1.x+dispObj1.width:
						dispObj2.x+dispObj2.width,
						
				y2= y1===dispObj1.y?
						dispObj1.y+dispObj1.height:
						dispObj2.y+dispObj2.height;
						
			return [
						{x:x1,y:y1},
						{x:x2,y:y1},
						{x:x2,y:y2},
						{x:x1,y:y2}
					];

		}
		
	})
);
