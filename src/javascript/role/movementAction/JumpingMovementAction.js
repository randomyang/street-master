/**
 * @fileoverview 跳跃的位移和动作
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2010-12-31
 */

$import("aralork.animation.Parabola");
$import("role.movementAction.IMovementAction");
$import("game.SoundManager");

$package("role.movementAction","JumpingMovementAction",
	function(fighter){
		
		this.__fighter=fighter;
		this.__directionValue=0;
		this.__startY=0;
		this.__parabola=new aralork.animation.Parabola(1.25,50);
		this.__deltaX=3*fighter.scale;
		this.__v0=this.__getV0(fighter.scale*100);
		this.__g=0.392*fighter.scale;
		this.__isPlaying=false;
		
		this.__initFighter();
		this.__initParabola();
		
	}.$implements(role.movementAction.IMovementAction).define({
		
		/**
		 * 播放跳跃动作
		 * @param {String} direction
		 * 					"up"
		 * 					"left"
		 * 					"right"
		 * 
		 * @param {Number} startY
		 */
		play:function(direction,startY){
			var ft=this.__fighter,
				type,
				me=this;
			
			if(direction==="left"){
				type = ft.lookAt==="right"?"back":"forward";
				this.__directionValue= -this.__deltaX;
			}else if(direction==="right"){
				type = ft.lookAt==="right"?"forward":"back";
				this.__directionValue=this.__deltaX;
			}else{
				type="up";
				this.__directionValue=0;
			}
			
			ft.action.updateAnimation("jump_"+type,ft.lookAt);
			this.__startY= ft.basicY-ft.height;
			window.setTimeout(function(){
				me.__isPlaying=true;
				me.__parabola.start(me.__v0,me.__g);
			},80);
		},
		
		stop:function(){
			this.__parabola.stop();
		},
		
		pause:function(){
			this.__parabola.pause();
		},
	
		continuePlay:function(){
			this.__parabola.start();
		},
		
		__initFighter:function(){
			var me=this,
				ft=this.__fighter;
			
			ft.action.addEventListener("actionComplete",function(actionName,nextActionName){
				if(me.__isPlaying && ft.state!=="beAttacked" && (/^jump/).test(actionName) && /(boxing|kick)$/.test(actionName)){
					ft.action.updateAnimation("jump_down",ft.lookAt,1);
				}
			});
		},
		
		__initParabola:function(){
			var ft=this.__fighter,
				me=this,
				pb=this.__parabola;
				
			pb.addEventListener("throw",function(v){
				ft.setPosition({
					x:ft.x+me.__directionValue,
					y:me.__startY+v
				});
			})
			.addEventListener("complete",function(){
				me.__isPlaying=false;
				ft.isJumping=false;
				game.SoundManager.play("footfall");
				ft.setPosition({
					y:ft.basicY-ft.height
				});
				ft.wait();
			});
		},
		
		/**
		 * 根据跳跃的高度获取初速度
		 * @param {String} h
		 */
		__getV0:function(h){
			var g=0.392*this.__fighter.scale;
			return Math.sqrt(h*2*g);
		}
	})
);
