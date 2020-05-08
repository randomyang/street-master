/**
 * @fileoverview 菜单
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-04-05
 */
 
$import("aralork.utils.KeyListener");
$import("aralork.lib.Lib");

$import("game.menu.MenuItem");
$import("game.menu.MenuItemContent");

$package("game.menu","Menu",
	function(node){

		this.enabled=true;
		
		aralork.lib.Lib.defineGetter(this,
			["width","height","x","y"],
			[this.__getWidth,this.__getHeight,this.__getX,this.__getY]);

		this.__entity=node;		
		this.__list=[];
		this.__itemContent={};
		this.__index=0;
		this.__parent=parent || document.body;
		this.__keyListener=new aralork.utils.KeyListener(document);
		
		this.__initMove();
		
		this.hidden();
		
	}.define({
		
		add:function(text,w,h,itemContent){
			var list=this.__list;
			
			list.push(new game.menu.MenuItem(w,h));
			list.length===1 && list[0].focus();
			list[list.length-1].ID=list.length-1;
			list[list.length-1].setText(text);
			this.__itemContent["ic"+list[list.length-1].ID]=itemContent;
			
			this.__initItem(list[list.length-1]);
			
			return this;
		},
		
		remove:function(idx){
			var ic=this.__itemContent["ic"+this.__list[idx].ID];
			
			this.__list[idx] && this.__list[idx].destroy();
			this.__list.splice(idx,1);
			
			if(ic){
				ic.destroy();
				delete this.__itemContent["ic"+this.__list[idx].ID];
			}
			
			return this;
		},
		
		next:function(){
			var list=this.__list;
			
			if(list[this.__index+1]){
				list[this.__index+1].focus();
				list[this.__index].blur();
				this.__index++;
			}
			
			return this;
		},
		
		previous:function(){
			var list=this.__list;
			
			if(this.__index-1 >= 0){
				list[this.__index-1].focus();
				list[this.__index].blur();
				
				this.__index--;
			}
			
			return this;
		},
		
		show:function(){
			this.__entity.style.display="";
			return this;
		},
		
		hidden:function(){
			this.__entity.style.display="none";
			return this;
		},
		
		setPosition:function(param){
			typeof param.x!=="undefined" && (this.__entity.style.left=param.x+"px");
			typeof param.y!=="undefined" && (this.__entity.style.top=param.y+"px");
			typeof param.z!=="undefined" && (this.__entity.style.zIndex=param.z);
			return this;
		},
		
		setEnabled:function(state){
			var list=this.__list,
				i=this.__list.length;
			
			this.enabled=!!state;
			while(i--){
				list[i] && (list[i].enabled=!!state);
			}
			
		},
		
		getIndex:function(){
			return this.__index;
		},
		
		__initItem:function(item){
			var me=this,
				MenuItemContent=game.menu.MenuItemContent;
			
			this.__entity.appendChild(item.entity);
			
			item.addEventListener("enter",function(){
				
				var ic=me.__itemContent["ic"+this.ID];
				if(ic && ic.constructor===MenuItemContent){
					ic.show();
					me.enabled=false;
					me.hidden();
					
				}else if(aralork.lib.Lib.checkFunction(ic)){
					ic.call(this);
				}
			});
			
			if(me.__itemContent["ic"+item.ID] && me.__itemContent["ic"+item.ID].constructor===MenuItemContent){
				me.__itemContent["ic"+item.ID].addEventListener("hidden",function(){
					me.enabled=true;
					me.show();
				});
			}
		},
		
		__initMove:function(){
			var me=this;
			
			//up
			this.__keyListener.add(38,"keydown",function(){
				me.enabled && me.previous();
			});
			//down
			this.__keyListener.add(40,"keydown",function(){
				me.enabled && me.next();
			});
		},
		
		__getX:function(){
			return parseInt(this.__entity.style.left);
		},
		
		__getY:function(){
			return parseInt(this.__entity.style.top);
		},
		
		/**
		 * 获取宽度
		 */
		__getWidth:function(){
			return this.__getSize(this.__entity,"offsetWidth");
		},
		
		/**
		 * 获取高度
		 */
		__getHeight:function(){
			return this.__getSize(this.__entity,"offsetHeight");
		},
		
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
