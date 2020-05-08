/**
 * @fileoverview 碰撞区域的帧管理器，管理每帧的碰撞区域
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2010-12-23
 */

$package("tools","OverlayAreaManager",
	function(){
		this.active=null;
		
		this.__attackList=[];
		this.__bodyList=[];
		this.__last=null;
	}.define({
		
		add:function(oa,type,frame){
			if(type!=="attack" && type!=="body"){
				return;
			}

			var me=this;
			!this["__"+type+"List"][frame-1] && (this["__"+type+"List"][frame-1]=[]);
			
			oa.type=type;
			oa.frame=frame;
			oa.__entity.onmousedown=function(){
				oa.focus();
				me.active=oa;
				me.__last && me.__last!==oa && me.__last.blur();
				me.__last=oa;
			};
			
//			oa.__entity.ondblclick=function(){
//				me.remove(oa);
//			};
			
			this["__"+type+"List"][frame-1].push(oa);
			
		},
		
		render:function(type,frame){
			var objs=this["__"+type+"List"][frame-1],
				i=this["__"+type+"List"].length,
				j;
				
			while(i--){
				if(this["__"+type+"List"][i]){
					j=this["__"+type+"List"].length;
					while(j--){
						this["__"+type+"List"][i][j] && this["__"+type+"List"][i][j].hidden(); 
					}
				}
			}
			
			
			
			if(!objs){
				return;
			}
			
			i=objs.length;
			while(i--){
				objs[i].show();
			}
		},
		
		format:function(type,frameCount,scale){
			var i=frameCount,
				j,
				str=[],
				arr;
			while(i--){
				if(this["__"+type+"List"][i]){
					j=this["__"+type+"List"][i].length;
					if(j===1){
						var obj=this["__"+type+"List"][i][0];
						obj && str.unshift("{x:"+Math.floor(obj.x/scale)+
																",y:"+Math.floor(obj.y/scale)+
																",w:"+Math.floor(obj.width/scale)+
																",h:"+Math.floor(obj.height/scale)+"}");
					}else if(j>1){
						arr=[];
						while(j--){
							var o=this["__"+type+"List"][i][j];
							o && arr.push("{x:"+Math.floor(o.x/scale)+
															",y:"+Math.floor(o.y/scale)+
															",w:"+Math.floor(o.width/scale)+
															",h:"+Math.floor(o.height/scale)+"}");
						}
						arr.length && str.unshift("["+arr.join(",")+"]");
					}
				}else{
					str.unshift(0);
				}
			}
			
			return "["+str.join(",")+"]";
		},
		
		remove:function(oa){
			var list=this["__"+oa.type+"List"][oa.frame-1],
				i=list.length;
			
			while(i--){
				if(list[i]===oa){
					oa.destroy();
					list[i]=null;
					list.splice(i,1);
					this.__last=null;
					this.active=null;
				}
			}
			
		},
		
		clear:function(type){
			var i=this["__"+type+"List"].length,
				j;
			
			while(i--){
				if(this["__"+type+"List"][i]){
					j=this["__"+type+"List"][i].length;
					while(j--){
						if (this["__"+type+"List"][i][j]) {
							this["__"+type+"List"][i][j].destroy();
							this["__"+type+"List"][i][j]=null;
							this["__"+type+"List"][i].splice(j,1);
						}
					}
				}
			}
			this["__"+type+"List"].length=0;
			this.__last=null;
			this.active=null;
		}
		
	})
);
