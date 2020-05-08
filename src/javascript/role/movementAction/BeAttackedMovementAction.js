/**
 * @fileoverview 被击打的位移动作类
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-02-20
 */

$import("aralork.animation.tween.Tween");
$import("aralork.animation.Parabola");

$import("role.movementAction.IMovementAction");

$package("role.movementAction","BeAttackedMovementAction",

	function(fighter){
		this.__fighter=fighter;
		this.__beAttackTween=new aralork.animation.tween.Tween(20,0,0,1,aralork.animation.tween.Transition.strongEaseOut);
		this.__parabola=new aralork.animation.Parabola(1,40);
		this.__startY=0;
		this.__direction=1;
		this.__g=0.392*fighter.scale;
		this.__lastValue=0;
		
		this.__initBeAttacked();
		this.__initParabola();
		
	}.$implements(role.movementAction.IMovementAction).define({
		
		play:function(type,power,isDefensed){

			var ft=this.__fighter,
				d=ft.lookAt==="right"?-1:1,
				deltaX=d * ft.scale * Math.min(power*3,40),
				ev=ft.x + (isDefensed ? deltaX/2 : deltaX),
				me=this,
				adv=ft.adversary,
				delayT=Math.min(power*30,250);
			
			//暂停动作
			if (!adv.isSpecialAttacking) {
				adv.action.currentAnimation.pause();
				adv.isJumping && adv.movementAction.pause("jumping");
			}
			if(!ft.isSpecialAttacking){
				ft.action.currentAnimation.pause();
				ft.isJumping && ft.movementAction.pause("jumping");
			}
			
			if(ft.isJumping){
				me.__fallDown(delayT);
			}else{
				setTimeout(function(){
					ft.action.currentAnimation.play(0,true);
					me.__beAttackTween.stop(true);
					me.__lastValue=ft.x;
					me.__beAttackTween.start(+ft.x,ev,0.4+power/100);
					
					if(!adv.isSpecialAttacking){
						adv.action.currentAnimation.play(0,true);
						adv.isJumping && adv.movementAction.continuePlay("jumping");
					}
				},delayT);
			}
			
		},
		
		stop:function(){
			this.__beAttackTween.stop(true);
		},
		
		pause:function(){},
	
		continuePlay:function(){},
		
		__initBeAttacked:function(){
			var ft=this.__fighter,
				me=this;
				
			this.__beAttackTween.addEventListener("tween",function(value){
				ft.setPosition({
					x:ft.x+(value-me.__lastValue)
				});
				me.__lastValue=value;
			});
			this.__beAttackTween.addEventListener("end",function(value){
				me.__lastValue=ft.x;
				(ft.action.currentActionName==="stand_up_defense" || ft.action.currentActionName==="stand_crouch_defense") && (ft.state="wait");
				ft.fireEvent("beAttackedComplete");
			});
		},
		
		__initParabola:function(){
			var pa=this.__parabola,
				ft=this.__fighter,
				me=this;
			
			pa.addEventListener("throw",function(v){
				ft.setPosition({
					x:ft.x + ft.scale*4*me.__direction,
					y:me.__startY+v
				});
			})
			.addEventListener("complete",function(v){
				ft.isJumping=false;
				game.SoundManager.play("fall");
				ft.action.updateAnimation("beAttacked_fall_down",ft.lookAt);
			});
		},
		
		__fallDown:function(delayT){
			var ft=this.__fighter,
				adv=ft.adversary,
				me=this;
				
			function update(){
				me.__startY= +ft.y;
				ft.movementAction.stopAll();
				ft.isSpecialAttacking && ft.stopSpecialAttack("beAttacked");
				ft.action.updateAnimation("beAttacked_before_fall_down",ft.lookAt);
				
				if(!adv.isSpecialAttacking){
					adv.action.currentAnimation.play(0,true);
					adv.isJumping && adv.movementAction.continuePlay("jumping");
				}
				
				me.__direction= ft.x < ft.adversary.x?-1:1;
				me.__parabola.start(me.__getV0(50),
									me._g,
									ft.basicY-me.__startY-ft.action.animations["beAttacked_before_fall_down"].height);
			}
				
			if(!ft.isSpecialAttacking){
				setTimeout(function(){
					update();
				},delayT);
			}else{
				update();
			}
			
			
			
		},
		
		/**
		 * 根据高度获取初速度
		 * @param {String} h
		 */
		__getV0:function(h){
			var g=0.392*this.__fighter.scale;
			return Math.sqrt(h*2*g);
		}
	})
);