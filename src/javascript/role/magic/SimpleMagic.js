/**
 * @fileoverview 一般的魔法,在战士身边呈现(这个类其实还可以更灵活，比如把各动画的状态都抽象出来，不过MS这个游戏中这样用也够了，先凑合吧。。。囧。。)
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2010-12-06
 */

$import("aralork.events.EventDispatcher");
$import("aralork.display.Animation");
$import("aralork.utils.ResourceLoader");
$import("aralork.lib.Lib");

$import("config.Magic");
$import("role.magic.IMagic");
$import("role.FrameOverlayList");

$package("role.magic","SimpleMagic",

	/**
	 * 
	 * @param {Object} parent
	 * @param {Object} magicCfg
	 * @param {Fighter} fighter
	 * @param {String} name
	 * @event
	 * 		start
	 * 		playing
	 * 		complete
	 */
	function(parent,magicCfg,fighter,name){
		
		aralork.lib.Lib.defineGetter(this,
			["state","width","x"],
			[this.__getState,this.__getWidth,this.__getX]);
		
		this.attackOverlayList=null;
		this.bodyOverlayList=null;
		this.isActived=false;
		
		this.__state="stop";
		this.__fighter=fighter;
		this.__animation=null;
		this.__disappearAnimation=null;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__playCount=magicCfg.COUNT || 0;
		this.__parent=parent || document.body;
		this.__isFlipH=false;
		this.__scale=1;

		this.__initAnimation(magicCfg);
		this.__initFrameOverlayList(magicCfg,name);
		
	}.$implements(role.magic.IMagic).define({
		
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
		
		/**
		 * 设置位置
		 * @param {Object} p
		 * 					x:Number
		 * 					y:Number
		 * 					z:Number
		 */
		setPosition:function(p){
			this.__animation.setPosition(p);
			return this;
		},
		
		setFlipH:function(state){
			this.__animation.setFlipH(state);
			this.__disappearAnimation && this.__disappearAnimation.setFlipH(state);
			this.__isFlipH=state;
			return this;
		},
		
		setScale:function(sc){
			this.__animation.setScale(sc);
			this.__disappearAnimation && this.__disappearAnimation.setScale(sc);
			this.__scale=sc;
			return this;
		},
		
		play:function(level){
			if(this.__state==="playing"){
				return;
			}
			
			this.attackOverlayList.enabled=true;
			this.bodyOverlayList.enabled=true;
			this.__state="playing";
			this.__eventDispatcher.dispatchEvent("start");
			this.__animation.show().play(this.__playCount);
			
			return this;
		},
		
		destroy:function(){
			if(!this.__animation){
				return;
			}
			
			this.__state="stop";
			this.__animation.stop().destroy();
			this.__animation=null;
			
			if(this.__disappearAnimation){
				this.__disappearAnimation.stop().destroy();
				this.__disappearAnimation=null;
			}
			
		},
		
		disappear:function(){
			var anm=this.__animation;
				
			this.__state="stop";
			
			this.__animation.stop().hidden();
			
			if (this.__disappearAnimation) {
				this.__disappearAnimation.setPosition({
					x: +anm.x,
					y: +anm.y,
					z: +anm.z
				}).show().play(1);
			}else{
				this.__eventDispatcher.dispatchEvent("complete");
			}
			
		},
		
		setPosition:function(p){
			this.__animation.setPosition(p);
		},
		
		__initAnimation:function(magicCfg){
			var me=this,
				disappearAnimationCfg=config.Magic[magicCfg.DISAPPEAR_ANIMATION];
			
			this.__animation=this.__creatAnimation(magicCfg);
			this.__animation.addEventListener("playing",function(frame){
				me.isActived=true;
				me.attackOverlayList.refresh(frame);
				me.bodyOverlayList.refresh(frame);
				me.__eventDispatcher.dispatchEvent("playing");
			})
			.addEventListener("stop",function(){
				me.isActived=false;
				me.disappear();
			});
			
			if (disappearAnimationCfg) {
				this.__disappearAnimation = this.__creatAnimation(disappearAnimationCfg);
				this.__disappearAnimation.addEventListener("stop",function(){
					this.hidden();
					me.__eventDispatcher.dispatchEvent("complete");
				});
			}
		},
		
		__creatAnimation:function(magicCfg){
			var me=this;
			
			return (new aralork.display.Animation(
				this.__parent,
				"div",
				magicCfg.WIDTH,
				magicCfg.HEIGHT,
				aralork.utils.ResourceLoader.getImage(magicCfg.IMG,true),
				magicCfg.FPS,
				magicCfg.FRAME_TIMES
			))
			.hidden();
		},
		
		__initFrameOverlayList:function(magicCfg,name){
			this.attackOverlayList=new role.FrameOverlayList(
				magicCfg.ATTACK_OVERLAYS,
				{
					attackType:magicCfg.ATTACK_TYPE,
					power:magicCfg.POWER,
					defencedPower:magicCfg.DEFENCED_POWER,
					hitSoundName:magicCfg.HIT_SOUND_NAME
				},
				name,
				this.__animation,
				"attack",
				this.__parent
			);
			
			this.bodyOverlayList=new role.FrameOverlayList(
				magicCfg.BODY_OVERLAYS,
				{
					attackType:magicCfg.ATTACK_TYPE,
					power:magicCfg.POWER,
					defencedPower:magicCfg.DEFENCED_POWER
				},
				name,
				this.__animation,
				"body",
				this.__parent
			);
		},

		__getState:function(){
			return this.__state;
		},
		
		__getWidth:function(){
			return +this.__animation.width;
		},
		
		__getX:function(){
			return +this.__animation.x;
		}
	})
);
