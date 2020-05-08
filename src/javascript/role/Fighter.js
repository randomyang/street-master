/**
 * @fileoverview Fighter
 * @author Random | Random.Hao.Yang@gmail.com
 */

$import("aralork.lib.Lib");
$import("aralork.events.EventDispatcher");

$import("role.Action");
$import("role.movementAction.MovementAction");
$import("role.magic.MagicAssembler");
$import("role.specialAttack.SpecialAttackTable");
$import("game.SoundManager");

$package("role","Fighter",
	
	/**
	 * 斗士类
	 * @param {String} name
	 * @param {String} lookAt
	 * @param {Number} basicY
	 * @param {Number} scale
	 * @param {Object} parent
	 * @events
	 * 		playing
	 * 		stateChanged 状态改变
	 * 		move 移动
	 * 		specialAttackStart 特殊攻击开始
	 * 		specialAttackComplete 特殊攻击完成
	 * 		positionChanged
	 * 		beAttacked
	 * 		beAttackedComplete
	 */
	function(name,lookAt,basicY,scale,parent){
		
		aralork.lib.Lib.defineGetter(this,
			["x","y","z","width","height","offsetX"],
			[this.__getX,this.__getY,this.__getZ,this.__getWidth,this.__getHeight,this.__getOffsetX]);
		
		this.lookAt=lookAt || "right";
		this.hp=100;
		this.name=name;
		this.action=new role.Action(this,scale,parent);
		
		/**
		 * 当前状态
		 */
		this.state="wait";
		
		this.scale=scale || 1;
		this.isJumping=false;
		this.isAttacking=false;
		this.isMagicPlaying=false;
		this.specialAttackLevel=1;
		this.basicY=basicY;
		this.dynamicBasicY=basicY;
		this.parent=parent || document.body;
		this.defenseState="";
		this.adversary=null;
		this.isSpecialAttacking=false;
		this.movementAction=new role.movementAction.MovementAction(this);
		
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__magicAssembler=new role.magic.MagicAssembler(this);
		this.__isLookAtChanged=false;
		this.__hashSpecialAttackInstance={};
		
		this.__initAction();
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
		 * 等待
		 */
		wait:function(){
			var state=this.state;
			this.state="wait";
			this.defenseState="";
			this.isAttacking=false;
			this.isSpecialAttacking=false;
			this.isJumping=false;
			this.movementAction.stopAll();
			this.action.updateAnimation("wait",this.lookAt);
			state!=="wait" && this.__eventDispatcher.dispatchEvent("stateChanged",state,"wait");
			return this;
		},
		
		/**
		 * 行走
		 * @param {String} type 
		 * 					"left"
		 * 					"right"
		 * 					"forward"
		 * 					"back"
		 */
		walk:function(type){
			if((this.state!=="" && this.state!=="wait" && this.state!=="crouch" && this.state!=="defense") || this.isAttacking || this.defenseState!==""){
				return this;
			}
			var state=this.state;
			this.state="walking";
			
			this.movementAction.stopAll().play("walking",type);
			this.__eventDispatcher.dispatchEvent("stateChanged",state,this.state);
			return this;
		},
		
		/**
		 * 跳跃
		 * @param {String} type
		 * 			"up"
		 * 			"left"
		 * 			"right"
		 * 			"forward"
		 * 			"back"
		 */
		jump:function(type){
			if(!(/wait|walking|defense/.test(this.state)) || this.isSpecialAttacking || this.isAttacking || this.state==="beAttacked"){
				return this;
			}
			
			var state=this.state;
			
			type==="forward" && (type=this.lookAt);
			type==="back" && (type=this.lookAt==="right"?"left":"right");
			
			this.state==="walking" && this.movementAction.stop("walking");
			this.state="jump"+type;
			this.isJumping=true;
			this.defenseState="";
			this.movementAction.play("jumping",type);
			this.__eventDispatcher.dispatchEvent("stateChanged",state,this.state);
			return this;
		},
		
		/**
		 * 站立
		 * @param {String} type
		 * 				"up"
		 * 				"crouch"
		 */
		stand:function(type){
			if((this.state!=="wait" && this.state!=="walking" && this.state!=="defense") || this.isAttacking){
				return this;
			}
			var state=this.state;

			this.state==="walking" && this.movementAction.stop("walking");
			this.state= type==="crouch"?type:"wait";
			this.action.updateAnimation("stand_"+type,this.lookAt);
			this.__eventDispatcher.dispatchEvent("stateChanged",state,this.state);
			return this;
		},
		
		/**
		 * 攻击
		 * @param {String} level
		 * 				light
		 * 				middle
		 * 				heavy
		 * 
		 * @param {String} type
		 * 				boxing
		 * 				kick
		 */
		attack:function(level,type){
			if(this.isAttacking
			|| this.state==="beAttacked"
			|| (!/wait|crouch|walking|defense/.test(this.state) && !this.checkState("jump"))){
				return this;
			}
			
			var	str="",
				adv=this.adversary;
				
			this.isAttacking=true;
			this.state==="walking" && this.movementAction.stop("walking");
			
			//近距离攻击
			Math.abs(this.x-adv.x)<=this.width-5*this.scale && (str="near");
			
			//跳跃攻击
			this.state==="jumpup" && (str="jump");
			/^jump(left|right)/.test(this.state) && (str="jumpMoved");
			
			//下蹲攻击
			this.checkState("crouch") && (str="crouch");
			
			str && (str+="_");
			
			this.defenseState="";
			game.SoundManager.play(str+level+"_"+type);
			this.action.updateAnimation(str+level+"_"+type,this.lookAt);
			return this;
		},
		
		/**
		 * 特殊攻击
		 * @param {String} name
		 * @param {Number} level
		 * 				1
		 * 				2
		 * 				3
		 */
		specialAttack:function(name,level){
			if(this.isAttacking || this.isSpecialAttacking || !(/wait|walking|defense|crouch/.test(this.state))){
				return this;
			}
			var me=this;
			
			this.defenseState="";
			this.state==="walking" && this.movementAction.stop("walking");
			if(!this.__hashSpecialAttackInstance[name]){
				this.__hashSpecialAttackInstance[name]=new role.specialAttack.SpecialAttackTable[name](this);
				this.__hashSpecialAttackInstance[name].addEventListener("start",function(name){
					me.__eventDispatcher.dispatchEvent("specialAttackStart",name);
				});
				this.__hashSpecialAttackInstance[name].addEventListener("complete",function(name){
					me.__eventDispatcher.dispatchEvent("specialAttackComplete",name);
				});
			}
			this.specialAttackLevel=level;
			this.state="specialAttacking";
			this.__hashSpecialAttackInstance[name].play();
			
			return this;
		},
		
		defense:function(){
			if(this.isAttacking || this.state==="beAttacked"){
				return;
			}
			
			var str;
			
			this.movementAction.stop("walking");
			str=this.checkState("crouch")?"crouch":"up";
			this.state="defense";
			this.defenseState=str;
			this.action.updateAnimation("stand_"+str+"_defense",this.lookAt);
		},
		
		beAttacked:function(type,power,defensedPower,point,hitSoundName){
			var ds=this.defenseState || "",
				isDefensed=!!ds,
				advActionName=this.adversary.action.currentActionName,
				hashCrouchDefense={
				"up":/top|heavy|impact|fire|electric|up_fall/,
				"crouch":/bottom|fall/
			};
			
			!this.isJumping && this.movementAction.stopAll();
			this.state="beAttacked";
			this.__eventDispatcher.dispatchEvent("beAttacked",type,power,defensedPower||0,point,hitSoundName);
			
			if((hashCrouchDefense[ds] && !hashCrouchDefense[ds].test(type)) || !isDefensed){
				hitSoundName && game.SoundManager.play(hitSoundName);
				if(!this.isJumping){
					this.action.updateAnimation("beAttacked_"+type,this.lookAt);
				}
			}else{
				game.SoundManager.play("defense");
			}
			this.movementAction.play("beAttacked",type,power,isDefensed);
		},
		
		stopSpecialAttack:function(type){
			var k,
				o=this.__hashSpecialAttackInstance;
			for(k in o){
				o[k].stop(type);
			}
		},
		
		/**
		 * 为指定动作添加魔法
		 * @param {String} actionName
		 * @param {IMagic} magicContructor
		 * @param {Object} frameConfig
		 * @param {Object} magicConfig
		 */
		addMagic:function(actionName,magicContructor,frameConfig,magicConfig){
			this.__magicAssembler.addMagic(actionName,magicContructor,frameConfig,magicConfig);
			return this;
		},
		
		setPosition:function(p,isUnDispatch){
			var y= +this.action.currentAnimation.y,
				_p=this.__updateScreen(p);

			//移动并刷新当前帧的碰撞检测区域
			this.action.currentAnimation.setPosition(_p).refresh();
			this.dynamicBasicY += this.action.currentAnimation.y - y;
			
			!isUnDispatch && this.__eventDispatcher.dispatchEvent("positionChanged",p);
			
			return this;
		},
		
		setScale:function(sc){
			this.action.setScale(sc);
			this.__magicAssembler.setScale(sc);
			this.scale=sc;
			return this;
		},
		
		/**
		 * 获取身体的碰撞检测对象队列
		 */
		getBodyOverlayListQueue:function(){
			return this.__getAnimationsOverlayListQueue(this.action.animations,"bodyOverlayList");
		},
		
		/**
		 * 获取进攻部位的碰撞检测对象队列
		 */
		getAttackOverlayListQueue:function(){
			return this.__getAnimationsOverlayListQueue(this.action.animations,"attackOverlayList");
		},
		
		/**
		 * 根据动作名称获取该动作绑定的魔法对象
		 * @param {String} name
		 */
		getMagic:function(actionName){
			return this.__magicAssembler.magicList[actionName];
		},
		
		/**
		 * 获取魔法的碰撞检测对象队列
		 */
		getMagicBodyOverlayListQueue:function(){
			var ret=[],
				ml=this.__magicAssembler.magicList,
				k;
			for(k in ml){
				ret=ret.concat(ml[k].bodyOverlayList.queue);
			}
			
			return ret;
		},
		
		/**
		 * 设置对手
		 * @param {Fighter} adversary
		 */
		setAdversary:function(adversary){
			this.adversary=adversary;
			this.action.setAdversaryActionOverlay(adversary);
			this.__magicAssembler.setAdversary(adversary);
			return this;
		},
		
		/**
		 * 检测状态
		 * @param {String} type
		 * 				jump 是否在跳跃
		 * 				crouch 是否蹲下
		 */
		checkState:function(type){
			if(type==="jump"){
				return /^jump\w{2,4}/.test(this.state);
			}else if(type==="crouch"){
				return this.state==="crouch";
			}
		},
		
		
		/**
		 * 更新屏幕
		 */
		__updateScreen:function(p){
			var padding=10*this.scale,
				k,
				px= +p.x,
				sw=stage.Screen.getWidth(),
				deltaX=px-this.x,
				rm=sw-padding-this.width,
				adv=this.adversary,
				screen=stage.Screen,
				isScroll=false,
				anmOffsetX=this.action.currentAnimation.offsetX*this.scale,
				offsetLX=padding+anmOffsetX,
				offsetRX=rm-anmOffsetX;
				
				function updateMagic(magicList,deltaX){
					if(!magicList){
						return;
					}
					var k;
					for(k in magicList){
						magicList[k].isActived && magicList[k].setPosition({
							x:magicList[k].x-deltaX
						});
					}
				}
			
			if(deltaX<0 && px<offsetLX){
				p.x=offsetLX;
				isScroll=adv && adv.x+adv.width < screen.getWidth()-padding;
			}
			
			if(deltaX>0 && px>offsetRX){
				p.x=offsetRX;
				isScroll=adv && adv.x>padding;
			}

			
			if(isScroll){
				screen.scroll(-deltaX,0);
				if (screen.canScroll) {
					adv.setPosition({
						x:adv.x-deltaX
					});
					
					//调整魔法位置
					updateMagic(this.__magicAssembler.magicList,deltaX);
					adv && updateMagic(adv.__magicAssembler.magicList,deltaX);
				}
			}

			return p;
		},
		
		__initAction:function(){
			var me=this;
			
			this.action.addEventListener("adversaryBodyOverlaying",function(actionOverlay,rect){
				me.adversary && actionOverlay.type=="attack" && me.adversary.beAttacked(
																						actionOverlay.attackType,
																						actionOverlay.power,
																						actionOverlay.defencedPower,
																						{
																							x:rect[0].x+(rect[1].x-rect[0].x)/2,
																							y:rect[0].y+(rect[3].y-rect[0].y)/2
																						},
																						actionOverlay.hitSoundName);
			})
			.addEventListener("playing",function(actionName,frame){
				me.__eventDispatcher.dispatchEvent("playing",actionName,frame);
			});
		},
		
		/**
		 * 获取动画集合的线形碰撞对象队列
		 * @param {Object} anms
		 * @param {String} type
		 * 					attackOverlayList
		 * 					bodyOverlayList
		 */
		__getAnimationsOverlayListQueue:function(anms,type){
			var k,
				queue=[];
				
			for(k in anms){
				queue=queue.concat(anms[k][type].queue);
			}
			
			return queue;
		},
		
		
		/**
		 * 获取X坐标值
		 */
		__getX:function(){
			return +this.action.currentAnimation.x;
		},
		
		/**
		 * 获取Y坐标值
		 */
		__getY:function(){
			return +this.action.currentAnimation.y;
		},
		
		/**
		 * 获取对象深度(z坐标)
		 */
		__getZ:function(){
			return +this.action.currentAnimation.z;
		},
		
		/**
		 * 获取宽度
		 */
		__getWidth:function(){
			return +this.action.currentAnimation.width;
		},
		
		/**
		 * 获取高度
		 */
		__getHeight:function(){
			return +this.action.currentAnimation.height;
		},
		
		/**
		 * 获取相对于背景图层的X坐标
		 */
		__getOffsetX:function(){
			return this.action.currentAnimation.x-stage.Screen.getX();
		}
	})
);
