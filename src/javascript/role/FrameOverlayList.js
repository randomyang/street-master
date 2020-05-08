/**
 * @fileoverview 帧的碰撞检测列表类
 * @author Random | Random.Hao.Yang@gmail.com
 */

$import("aralork.events.EventDispatcher");

$import("role.ActionOverlay");

$package("role","FrameOverlayList",

	/**
	 * 帧的碰撞检测列表类
	 * @param {Object} overlayCfg 碰撞检测配置信息
	 * @param {Object} actCfg 每个动作的配置信息对象{
	 * 						attackType:{String}
							power:{Number}
							defencedPower:{Number}
							soundName:{String}
	 * 					}
	 * @param {String} actName 动作名称
	 * @param {Object} animation 所附的动画对象
	 * @param {String} type 碰撞检测对象类型
	 * 					attack
	 * 					body
	 * @param {Object} parent 父节点
	 * @event
	 * 		overlaying
	 * 		otherOverlaying
	 */
	function(overlayCfg,actCfg,actName,animation,type,parent){
		this.queue=[];
		this.enabled=true;
		
		this.__list=[];
		this.__parent=parent || document.body;
		this.__overlayConfig=overlayCfg || [];
		this.__animation=animation;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__lastIndex=0;
		
		this.__initList(overlayCfg,actCfg,actName,type);
		this.__initQueue();
		
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
		
		/**
		 * 强制触发事件
		 * @param {String} type
		 */
		fireEvent:function(type){
			this.__eventDispatcher.dispatchEvent(type);
			return this;
		},
		
		/**
		 * 根据动画的帧呈现当前的碰撞检测对象状态
		 * @param {Number} frame
		 */
		refresh:function(frame){
			var list=this.__list,
				anm=this.__animation,
				idx= typeof frame ==="undefined" ?this.__lastIndex:frame-1,
				l=list.length,
				ovlCfg=this.__overlayConfig,
				width=anm.width,
				scale=anm.scale,
				isFlipH=anm.isFlipH,
				startX=anm.x,
				startY=anm.y,
				preIdx = (idx-1+l)%l,
				preOverlay =list[preIdx];

			if(!ovlCfg.length){
				return;
			}
			
			this.__lastIndex=idx;
			preOverlay && this.__updateOverlay(preOverlay,false,ovlCfg[preIdx],width,scale,isFlipH,startX,startY);
			list[idx] && this.__updateOverlay(list[idx],this.enabled,ovlCfg[idx],width,scale,isFlipH,startX,startY);
			
			return this;
		},
		
		disabled:function(){
			var queue=this.queue,
				i=queue.length;
				
			while(i--){
				queue[i] && (queue[i].enabled=false);
				
				//调试用
				//queue[i] && queue[i].updateEnabled();
			}
			
			this.enabled=false;
			return this;
		},
		
		/**
		 * 将指定group名称的overlay队列元素设置为enabled=false;
		 * @param {String} group
		 */
		disableOverlaysByGroup:function(group,queue){
			var queue=queue || this.queue,
				i=queue.length;
				
			while(i--){
				queue[i].group===group && (queue[i].enabled=false);
				//queue[i].group===group && alert(queue[i].enabled.toString()+"----"+queue[i].group)
			}
		},
		
		/**
		 * 更新碰撞检测对象
		 * @param {Object} ovl
		 * @param {Boolean} state
		 * @param {Object} cfg
		 * @param {Number} width
		 * @param {Number} scale
		 * @param {Boolean} isFlipH
		 * @param {Number} startX
		 */
		__updateOverlay:function(ovl,state,cfg,width,scale,isFlipH,startX,startY){
			if(!ovl){
				return;
			}
			
			var i,
				x;
				
			if(ovl instanceof Array){
				i=ovl.length;
				while(i--){
					x=isFlipH ? (width/scale-cfg[i].x-cfg[i].w) * scale : cfg[i].x * scale;
					ovl[i].enabled=state && this.enabled;
					
					ovl[i].setSize({
						w:cfg[i].w * scale,
						h:cfg[i].h * scale
					})
					.setPosition({
						x:startX + x,
						y:startY + cfg[i].y * scale
					});
					
					//调试用
					//ovl[i].updateEnabled();
				}
			}else{
				x=isFlipH ? (width/scale-cfg.x-cfg.w) * scale : cfg.x * scale;
				ovl.enabled=state && this.enabled;

				ovl.setSize({
					w:cfg.w * scale,
					h:cfg.h * scale
				})
				.setPosition({
					x:startX + x,
					y:startY + cfg.y * scale
				});
			
				//调试用
				//ovl.updateEnabled();
			}
		},
		
		/**
		 * 初始化以帧为序列的碰撞检测列表
		 * @param {Object} overlayCfg
		 * @param {Object} actCfg
		 * @param {String} actName
		 * @param {String} type
		 */
		__initList:function(overlayCfg,actCfg,actName,type){
			if(!overlayCfg || !(overlayCfg instanceof Array)){
				return;
			}
			
			var i=overlayCfg.length,
				j,
				me=this,
				list=this.__list;
			
			while(i--){
				if(overlayCfg[i]){
					if(overlayCfg[i] instanceof Array){
						list[i]=[];
						j=overlayCfg[i].length;
						while(j--){
							list[i][j]=this.__createActionOverlay(overlayCfg[i][j],actName+"_"+type+"_"+i,actCfg,type);
						}
					}else{
						list[i]=this.__createActionOverlay(overlayCfg[i],actName+"_"+type+"_"+i,actCfg,type);
					}
				}else{
					list[i]=0;
				}
			}
		},
		
		/**
		 * 创建ActionOverlay对象
		 * @param {Object} cfg
		 * @param {String} group
		 * @param {Object} actCfg
		 * @param {String} type
		 */
		__createActionOverlay:function(cfg,group,actCfg,type){
			var o=new role.ActionOverlay(this.__parent,
									"none",
									cfg.w * this.__animation.scale,
									cfg.h * this.__animation.scale,
									group);
			o.cfgDelta=cfg;
			o.enabled=false;
			o.attackType=actCfg.attackType;
			o.power=actCfg.power;
			o.hitSoundName=actCfg.hitSoundName;
			o.defencedPower=actCfg.defencedPower;
			o.type=type;
			o.manager=this;

			return o;
		},
		
		/**
		 * 初始化碰撞检测列表为展开的线形队列
		 */
		__initQueue:function(){
			var list=this.__list,
				i=list.length,
				j;
			
			while(i--){
				if (list[i]) {
					if (list[i] instanceof Array) {
						j = list[i].length;
						while (j--) {
							this.queue.unshift(list[i][j]);
						}
					}
					else {
						this.queue.unshift(list[i]);
					}
				}
			}
		}
	})
);
