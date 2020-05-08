/**
 * @fileoverview 位移动作类
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2010-12-31
 */

$import("role.movementAction.JumpingMovementAction");
$import("role.movementAction.WalkingMovementAction");
$import("role.movementAction.BeAttackedMovementAction");

$package("role.movementAction","MovementAction",
	function(fighter){
		this.__fighter=fighter;
		this.__hashConstructors={};
		this.__hashInstances={};
		
		this.__initConstructors();
		
	}.define({
		play:function(name){
			var args=[].slice.call(arguments,1);
			!this.__hashInstances[name] && (this.__hashInstances[name]=new this.__hashConstructors[name](this.__fighter)); 
			this.__hashInstances[name].play.apply(this.__hashInstances[name],args);
			return this;
		},
		
		stop:function(name){
			if(!this.__hashInstances[name]){
				return this;
			}
			var args=[].slice.call(arguments,1);
			this.__hashInstances[name].stop.apply(this.__hashInstances[name],args);
			return this;
		},
		
		pause:function(name){
			if(!this.__hashInstances[name]){
				return this;
			}
			var args=[].slice.call(arguments,1);
			this.__hashInstances[name].pause.apply(this.__hashInstances[name],args);
			return this;
		},
		
		continuePlay:function(name){
			if(!this.__hashInstances[name]){
				return this;
			}
			var args=[].slice.call(arguments,1);
			this.__hashInstances[name].continuePlay.apply(this.__hashInstances[name],args);
			return this;
		},
		
		stopAll:function(){
			var k,
				hash=this.__hashInstances;
				
			for(k in hash){
				hash[k].stop();
			}
			return this;
		},
		
		__initConstructors:function(){
			var ns=role.movementAction;
			this.__hashConstructors = {
				"jumping": ns.JumpingMovementAction,
				"walking": ns.WalkingMovementAction,
				"beAttacked":ns.BeAttackedMovementAction
			};
		}
	})
);
