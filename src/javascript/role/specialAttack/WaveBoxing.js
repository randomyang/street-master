/**
 * @fileoverview 波动拳的特殊攻击类，实现了特殊攻击的接口
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-01-13
 */

$import("aralork.events.EventDispatcher");
$import("role.specialAttack.ISpecialAttack");

$package("role.specialAttack","WaveBoxing",
	function(fighter){
		this.__fighter=fighter;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__magic=fighter.getMagic("wave_boxing");
		
		this.__init();
		
	}.$implements(role.specialAttack.ISpecialAttack).define({
		play:function(){
			var ft=this.__fighter;
			if(!ft.isMagicPlaying){
				ft.isAttacking=true;
				this.__eventDispatcher.dispatchEvent("start","wave_boxing");
				game.SoundManager.play("wave_boxing");
				ft.action.updateAnimation("wave_boxing",ft.lookAt);
			}
		},
		
		stop:function(type){
			this.__fighter.action.currentAnimation.stop();
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
		
		__init:function(){
			var me=this,
				ft=this.__fighter;
			
			this.__magic.addEventListener("complete",function(){
				ft.isMagicPlaying=false;
				ft.isSpecialAttacking=false;
				ft.isAttacking=false;
				me.__eventDispatcher.dispatchEvent("complete","wave_boxing");
			});
		}
	})
);
