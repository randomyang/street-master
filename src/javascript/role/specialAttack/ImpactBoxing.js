/**
 * @fileoverview 冲天拳的特殊攻击类，实现了特殊攻击的接口
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-01-15
 */

$import("aralork.animation.tween.Tween");
$import("aralork.animation.tween.Transition");
$import("aralork.animation.Gravity");
$import("aralork.events.EventDispatcher");

$import("game.SoundManager");
$import("role.specialAttack.ISpecialAttack");

$package("role.specialAttack","ImpactBoxing",
	/**
	 * 
	 * @param {Fighter} fighter
	 * @events
	 * 		complete
	 */
	function(fighter){
		this.__fighter=fighter;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__tween=new aralork.animation.tween.Tween(40,0,0,0,aralork.animation.tween.Transition.strongEaseOut);
		this.__gravity=new aralork.animation.Gravity(3.5,40);
		this.__deltaX=0;
		this.__lastV=[];
		this.__stopType="";
		
		this.__initEvent();
		this.__initTween();
		this.__initGravity();
		
	}.$implements(role.specialAttack.ISpecialAttack).define({
		play:function(){
			var ft=this.__fighter;
			
			this.__stopType="";
			game.SoundManager.play("impact_boxing");
			ft.isJumping=true;
			ft.isAttacking=ft.isSpecialAttacking=true;
			this.__eventDispatcher.dispatchEvent("start","impact_boxing");
			ft.action.updateAnimation("impact_boxing",ft.lookAt);
		},
		
		stop:function(type){
			this.__stopType=type;
			this.__fighter.action.currentAnimation.stop();
			this.__tween.stop();
			this.__gravity.stop();
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
				tw=this.__tween,
				me=this;
			
			ft.action.addEventListener("actionComplete",function(actionName){
				if(actionName==="impact_boxing"){
					var sc=ft.scale,
						level=ft.specialAttackLevel,
						direction=ft.lookAt==="right"?1:-1,
						sx=+ft.x,
						ex=ft.x + (level-1) * 20 * sc * direction,
						sy=+ft.y,
						ey=ft.y-(5 + level * 40) * sc;
					
					ft.isAttacking=ft.isSpecialAttacking=true;
					me.__lastV[0]= +ft.x;
					tw.start([sx,sy],[ex,ey],(level+1)/10);
				}
			});
		},
		
		__initTween:function(){
			var ft=this.__fighter,
				me=this;
	
			this.__tween.addEventListener("tween",function(v){
				ft.setPosition({
					x: ft.x+(v[0]-me.__lastV[0]),
					y: v[1]
				});
				me.__lastV[0]=v[0];
			})
			.addEventListener("end",function(){
				ft.action.updateAnimation("after_impact_boxing",ft.lookAt);
				me.__gravity.fallDown(+ft.y,ft.basicY-ft.height,0.392*ft.scale);
				me.__lastV[0]= +ft.x;
			});
		},
		
		/**
		 * 下落
		 */
		__initGravity:function(){
			var ft=this.__fighter,
				me=this;
			
			this.__gravity.addEventListener("falling",function(v){
				ft.setPosition({
					y:v
				});
			})
			.addEventListener("complete",function(){
				ft.isSpecialAttacking=false;
				ft.isJumping=false;
				ft.isAttacking=false;
				if(me.__stopType!=="beAttacked"){
					game.SoundManager.play("footfall");
					ft.state="wait";
				}
				me.__eventDispatcher.dispatchEvent("complete","impact_boxing");
			});
		}
	})
);
