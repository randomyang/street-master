/**
 * @fileoverview 行走的位移动作类
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-1-1 液。。。Happy new year~!!!
 */

$import("aralork.animation.Parabola");
$import("aralork.utils.Timer");

$import("role.movementAction.IMovementAction");

$package("role.movementAction","WalkingMovementAction",
	function(fighter){
		
		this.__fighter=fighter;
		this.__walkTimer=new aralork.utils.Timer();
		this.__deltaX=0;
		
		this.__initWalkTimer();
		
	}.$implements(role.movementAction.IMovementAction).define({
		
		/**
		 * 播放行走动作
		 * @param {String} direction
		 * 					"left"
		 * 					"right"
		 * 					"forward"
		 * 					"back"
		 */
		play:function(direction){
			var ft=this.__fighter,
				type,
				hash={
					"left":"1",
					"right":"0"
				};
			if(direction==="forward" || direction==="back"){
				type=direction;
			}else{
				switch(hash[direction]+hash[ft.lookAt]){
					case "00":
						this.__deltaX=ft.scale*4;
						type="forward";
						break;
					
					case "01":
						this.__deltaX=ft.scale*3;
						type="back";
						break;
						
					case "10":
						this.__deltaX=-ft.scale*3;
						type="back";
						break;
						
					case "11":
						this.__deltaX=-ft.scale*4;
						type="forward";
						break;
				}
			}
			ft.action.updateAnimation("walk_"+type,ft.lookAt);
			this.__walkTimer.start();
			
		},
		
		stop:function(){
			this.__walkTimer.stop();
		},
		
		pause:function(){},
	
		continuePlay:function(){},
		
		/**
		 * 行走的运动方式
		 */
		__initWalkTimer:function(){
			var me=this,
				ft=this.__fighter;
				
			this.__walkTimer.addEventListener("timer",function(){
				ft.setPosition({
					x:ft.x + me.__deltaX
				});
			});
		}
		
	})
);