/**
 * @fileoverview 碰撞测试编辑器的碰撞区域类
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2010-12-21
 */
$import("aralork.display.DisplayObject");
$import("aralork.lib.Style");
$import("aralork.utils.Drag");
$import("aralork.events.EventManager");

$package("tools","OverlayArea",
	function(parent,tagName,w,h,color){
		
		this.__drag=new aralork.utils.Drag(this.__entity);
		
		this.setColor(color || "red");
		this.__initRender();
	}.$extends(aralork.display.DisplayObject).define({
		
		setColor:function(c){
			this.__entity.style.backgroundColor=c;
			return this;
		},
		
		hidden:function(){
			tools.OverlayArea.$super.hidden.call(this);
			this.__drag.canDrag=false;
		},
		
		show:function(){
			tools.OverlayArea.$super.show.call(this);
			this.__drag.canDrag=true;
		},
		
		focus:function(){
			//this.__entity.style.border="1px solid #000000";
			aralork.lib.Style.setOpacity(this.__entity, 0.3);
		},
		
		blur:function(){
			//this.__entity.style.border="";
			aralork.lib.Style.setOpacity(this.__entity, 0.6);
		},
		
		__initRender: function(){
			aralork.lib.Style.setOpacity(this.__entity, 0.6);
			this.__drag.isLock = true;
			this.__drag.lockArea = {
				left: 0,
				top: 0,
				right: 500,
				bottom: 500
			};
			
			this.__disableSelect();
		},
		
		__disableSelect:function(){
			if($IE){
				aralork.events.EventManager.addEventListener(this.__entity, "selectstart", function(){
					return false;
				});
			}else{
				this.__entity.style.MozUserSelect="none";
			}
		}
		
	})
);
