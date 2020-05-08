/**
 * @fileoverview 动作类,播放动作对应的动画
 * @author Random | Random.Hao.Yang@gmail.com
 */

$import("aralork.events.EventDispatcher");
$import("aralork.utils.ResourceLoader");

$import("config.fighterAction.RYU1");
$import("config.fighterAction.RYU2");

$import("role.ActionAnimation");
$import("role.FrameOverlayList");


$package("role","Action",
	
	/**
	 * 动作类,播放动作对应的动画
	 * 
	 * 
	 * @event
	 * 		playing 正常播放动作时触发
	 * 		actionStart 开始播放一个动作时触发
	 * 		actionComplete 完成一个动作的播放后触发
	 * 		adversaryBodyOverlaying 敌人的身体动作区域被碰撞时触发
	 * 		attackOverlaying 进攻的动作区域有碰撞时触发
	 */
	function(fighter,scale,parent){
		this.animations={};
		this.currentAnimation=null;
		this.currentActionName="";
		
		this.__fighter=fighter;
		this.__nextActionName="";
		this.__scale=scale;
		this.__parent=parent || document.body;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__lookAt="right";
		
		this.__initAnimations(this.__fighter.name);
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
			var args=Array.prototype.slice.call(arguments,1),
				eventDispatcher=this.__eventDispatcher;
				
			args.unshift(type);
			eventDispatcher.dispatchEvent.apply(eventDispatcher,args);
			return this;
		},
		
		/**
		 * 更新当前动画为要播放的动画
		 * @param {String} actionName 动画名称
		 * @param {String} lookAt 斗士朝向 
		 * 					left
		 * 					right
		 * 
		 * @param {Number} playCount 播放的次数,为空时为动作配置信息里的COUNT值
		 */
		updateAnimation: function(actionName,lookAt,playCount){
			
			actionName=actionName || this.currentActionName;
			
			var crtAnm=this.currentAnimation,
				newAnm=this.animations[actionName],
				_x=0,
				_y=0,
				_z=0,
				_crtX=crtAnm.x,
				_crtW=crtAnm.width,
				_newW=newAnm.width;
			
			this.__lookAt=lookAt=lookAt.toLowerCase();
			
			_x=lookAt==="left"  
						? _crtX -_newW + _crtW + crtAnm.offsetX * this.__scale
						: _crtX - crtAnm.offsetX * this.__scale;

			_y=this.__fighter.dynamicBasicY - newAnm.height;
			_z=crtAnm.z;
			
			this.__nextActionName=actionName;
			crtAnm.state!=="stop" && crtAnm.stop();
			crtAnm.hidden();
			
			this.currentActionName=actionName;
			this.__eventDispatcher.dispatchEvent("actionStart",actionName);
			this.currentAnimation=
				newAnm.setFlipH(lookAt==="left")
					.setPosition({
						x:_x + (lookAt==="left"? - newAnm.offsetX * this.__scale : newAnm.offsetX * this.__scale),
						y:_y,
						z:_z
					})
					.show()
					.play(typeof playCount === "undefined" ?
						config.fighterAction[this.__fighter.name][actionName].COUNT :
						playCount);
		},
		
		/**
		 * 设置显示比例
		 * @param {Number} sc
		 */
		setScale:function(sc){
			sc=sc || 1;
			var k,
				anm=this.animations;
				
			for(k in anm){
				anm[k].setScale(sc);
			}
			this.__scale=sc;
			
			return this;
		},
		
		/**
		 * 设置当前动作与对手动作的碰撞检测情况
		 * @param {Fighter} adversary
		 */
		setAdversaryActionOverlay:function(adversary){
			var attackOverlayQueue=this.__fighter.getAttackOverlayListQueue();
				adversaryBodyOverlayQueue=adversary.getBodyOverlayListQueue();
				
			this.__updateOverlayListCheckedQueue(attackOverlayQueue,
												"attackOverlaying",
												adversaryBodyOverlayQueue);
			
			this.__updateOverlayListCheckedQueue(adversaryBodyOverlayQueue,
												"adversaryBodyOverlaying");

			return this;
		},
		
		__updateOverlayListCheckedQueue:function(queue,eventName,checkeQueue){
			var k,
				p,
				i,
				me=this,
				adv=this.__fighter.adversary;
			
			i=queue.length;

			while(i--){
				checkeQueue && queue[i].setOverlayList(checkeQueue);
				queue[i].addEventListener("overlaying",function(actionOverlay,rect){
					//当前碰撞检测的是对手的身体时，检测对手是否是防守状态
					if ((eventName==="adversaryBodyOverlaying" && !adv.defenseState)
					|| eventName==="attackOverlaying") {
						this.manager.enabled=false;
						this.manager.constructor===role.FrameOverlayList && this.manager.disableOverlaysByGroup(this.group,queue);
					}
					
					me.__eventDispatcher.dispatchEvent(eventName,actionOverlay,rect);
				});
			}
		},
		
		/**
		 * 初始化要播放的动画列表
		 * @param {String} fighterName
		 */
		__initAnimations:function(fighterName){
			var actionCfg=config.fighterAction[fighterName],
				ResourceLoader=aralork.utils.ResourceLoader,
				k,
				me=this;
				
			for(k in actionCfg){
				if(!this.animations[k]){
					this.animations[k]=new role.ActionAnimation(
						this.__parent,
						null,
						actionCfg[k].WIDTH,
						actionCfg[k].HEIGHT,
						ResourceLoader.getImage(actionCfg[k].IMG,actionCfg[k].IS_COPY_IMG),
						actionCfg[k].FPS,
						actionCfg[k].FRAME_TIMES,
						{
							actCfg:actionCfg[k],
							actName:k
						},
						actionCfg[k].OFFSET_X
					);
					
					this.animations[k].addEventListener("stop",(function(actionName){
						return function(frame,frameCount,isCoerceStop){
							var nextName = me.__nextActionName===me.currentActionName?"":me.__nextActionName;
							me.__eventDispatcher.dispatchEvent("actionComplete",me.currentActionName,actionName || nextName);
							actionName && !isCoerceStop && me.updateAnimation(actionName,me.__lookAt);
						};
					})(actionCfg[k].CALL_ANIMATION))
					
					.addEventListener("playing",(function(actionName){
						return function(frame){
							me.__eventDispatcher.dispatchEvent("playing",actionName,frame);
						};
					})(k))
					
					.hidden();
				}
			}
			
			this.currentAnimation=this.animations.wait;
			
		}
	})
);
