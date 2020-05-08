/**
 * @fileoverview 旋风腿的特殊攻击类，实现了特殊攻击的接口
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-01-15
 */

$import("aralork.utils.Timer");
$import("aralork.events.EventDispatcher");

$import("game.SoundManager");
$import("role.specialAttack.ISpecialAttack");

$package("role.specialAttack","WhirlKick",

	/**
	 * @param {Fighter} fighter
	 * @evnets
	 * 		compelte
	 */
	function(fighter){
		this.__fighter=fighter;
		this.__timer=new aralork.utils.Timer();
		this.__deltaX=0;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__stopType="";
		this.__isPlaying=false;
		
		this.__initEvent();
		this.__initTimer();
		
	}.$implements(role.specialAttack.ISpecialAttack).define({
		play:function(){
			
			if(this.__isPlaying){
				return this;
			}
			
			var ft=this.__fighter,
				direction=ft.lookAt==="right"?1:-1;
			
			this.__isPlaying=true;
			game.SoundManager.play("whirl_kick");
			ft.isAttacking=ft.isSpecialAttacking=true;
			ft.isJumping=true;
			this.__eventDispatcher.dispatchEvent("start","whirl_kick");
			ft.action.updateAnimation("before_whirl_kick",ft.lookAt);
			this.__stopType="";
			this.__deltaX=(3.5+ft.specialAttackLevel*0.5)*ft.scale*direction;		
			this.__timer.start();
		},
		
		stop:function(type){
			this.__stopType=type;
			this.__fighter.action.currentAnimation.stop();
			this.__timer.stop();
			this.__fighter.isSpecialAttacking=false;
			this.__isPlaying=false;
		},
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		__initEvent:function(){
			var ft=this.__fighter,
				tm=this.__timer,
				me=this;
			
			ft.action.addEventListener("actionComplete",function(actionName){
				if (me.__stopType !== "beAttacked") {
					actionName === "before_whirl_kick" && this.updateAnimation("whirl_kick", ft.lookAt, ft.specialAttackLevel + 2);
					actionName === "whirl_kick" && this.updateAnimation("after_whirl_kick", ft.lookAt, 1);
					if (actionName === "after_whirl_kick") {
						tm.stop();
					}
				}
			});
		},
		
		__initTimer:function(){
			var ft=this.__fighter,
				me=this;
	
			this.__timer.addEventListener("timer",function(){
				ft.setPosition({
					x: +ft.x+me.__deltaX
				});
			})
			.addEventListener("complete",function(){
				if(me.__stopType !== "beAttacked"){
					ft.isSpecialAttacking=false;
					ft.isJumping=false;
					ft.isAttacking=false;
				}
				me.__isPlaying=false;
				me.__eventDispatcher.dispatchEvent("complete","whirl_kick");
			});
		}
	})
);
