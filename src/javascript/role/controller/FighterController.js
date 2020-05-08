/**
 * @fileoverview 斗士的控制器类
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2010-12-29
 */
$import("aralork.lib.Lib");

$import("role.controller.Controller");
$import("config.SpecialAttacked");

$package("role.controller","FighterController",
	function(fighter,keyCfg){

		this.keyCfg=keyCfg;
		
		this.__keySequence=[];
		this.__fighter=fighter;
		this.__controller=new role.controller.Controller();
		this.__sequenceTimeoutValue=150;
		this.__keyDownStartTime=0;
		this.__specialAttackedConfig=config.SpecialAttacked[this.__fighter.name.replace(/\d+$/,"")];
		this.__controlsKeyCode=0;
		this.__hashKeyToLevel={
			"A":1,
			"B":2,
			"C":3,
			"D":1,
			"E":2,
			"F":3
		};
		
		this.__initController(keyCfg || {});
		this.__initFighter();
		
	}.define({
		
		clearKeyState:function(){
			this.__controlsKeyCode=0;
		},
		
		__initFighter:function(){
			var me=this,
				ft=this.__fighter,
				adv=ft.adversary;
			
			ft.addEventListener("stateChanged",function(s1,s2){
				if(/^jump(up|left|right)/.test(s1) && s2==="wait"){
					me.keyCfg && !ft.isSpecialAttacking &&  me.__updateFighterControlKeysAction(me.__controlsKeyCode);
				}
			});
			
			
			ft.action.addEventListener("actionComplete",function(actionName,nextActionName){

				//非跳跃的攻击结束
				if(!(/^jump/).test(actionName) && /(boxing|kick)$/.test(actionName)
				&& !ft.isJumping){
					ft.isAttacking=false;
					if(ft.state!=="beAttacked"){
						ft.state="wait";
						me.__updateFighterControlKeysAction(me.__controlsKeyCode);
					}else{
						ft.state="wait";
					}
				}
				
				//状态转变为wait时
				nextActionName==="wait" && (ft.state="wait");
				
				//翻身站起时
				actionName==="somesault_up" && me.keyCfg && me.__updateFighterControlKeysAction(me.__controlsKeyCode);
			});
			
			ft.addEventListener("specialAttackComplete",function(name){
				this.isAttacking=false;
				this.isSpecialAttacking=false;
				this.state==="specialAttacking" && (this.state="");
				
				if (me.keyCfg) {
					me.__updateFighterControlKeysAction(me.__controlsKeyCode,1);
				}else{

					!this.isAttacking
					&& !this.isJumping
					&& this.state!=="beAttacked"
					&& this.state!=="wait" && this.wait();
				}
			})
			.addEventListener("beAttackedComplete",function(name){
				me.keyCfg && me.__updateFighterControlKeysAction(me.__controlsKeyCode);
			});
			
			
			//对手的攻击
			adv.action.addEventListener("actionComplete",function(actionName,nextActionName){
				if(/(boxing|kick)$/.test(nextActionName)){
					!adv.isSpecialAttacking && me.__checkFighterDefense(me.__controlsKeyCode.toString(2));
				}
				
				if((/\w{0,20}(light|middle|heavy)_(boxing|kick)$/.test(actionName))){
					adv.isAttacking=false;
					me.keyCfg && me.__updateFighterControlKeysAction(me.__controlsKeyCode);
				}
			});

			adv.addEventListener("specialAttackStart",function(name){
				me.keyCfg && me.__updateFighterControlKeysAction(me.__controlsKeyCode);
			})
			.addEventListener("specialAttackComplete",function(name){
				if (me.keyCfg) {
					me.__updateFighterControlKeysAction(me.__controlsKeyCode);
				}else{
					!ft.isAttacking
					&& !ft.isJumping
					&& ft.state!=="beAttacked"
					&& ft.state!=="wait" && ft.wait();
				}
			})
			.addEventListener("beAttacked",function(){
				me.__keySequence=[];
			});
			
		},
		
		__initController:function(keyCfg){
			var ctr=this.__controller,
				me=this;
			
			ctr.configure(keyCfg)
				.addEventListener("controlsKeyDown",function(code,keyCode,keyName){
					me.__controlsKeyCode=code;
					me.__updateSequence(keyName);
					me.__updateFighterControlKeysAction(code);
				})
				.addEventListener("controlsKeyUp",function(code,keyCode,keyName){
					me.__controlsKeyCode=code;
					me.__updateFighterControlKeysAction(code);
				})
				.addEventListener("functionKeyDown",function(code,keyCode,keyName){
					me.__updateSequence(keyName);
					if(me.__keySequence.length > 1){
						me.__updateFigtherSpeicalAttack(keyName);
					}else{
						me.__updateFighterFunctionKeysAction(keyName);
					}
				})
				.addEventListener("functionKeyUp",function(code,keyCode,keyName){

				});
		},
		
		/**
		 * 更新按键序列
		 * @param {String} keyName
		 */
		__updateSequence:function(keyName){
			var ksq=this.__keySequence;
			
			if(ksq.length===0 || (new Date()).getTime() - this.__keyDownStartTime < this.__sequenceTimeoutValue){
				ksq.push(keyName);
			}else{
				this.__keySequence=[keyName];
			}
			
			this.__keyDownStartTime=(new Date()).getTime();
			
		},
		
		/**
		 * 更新按控制键时斗士的动作
		 */
		__updateFighterControlKeysAction:function(code){
			var ft=this.__fighter;
			//arguments[1] && console.log(ft.name+","+ft.state+","+code.toString(2));

			switch(code.toString(2)){
				case "10001":
					ft.jump("up");
					break;
					
				case "10010":
					!this.__checkFighterDefense("10010") && ft.walk("right");
					break;
				
				case "11100":
				case "10110":
				case "10100":
					ft.stand("crouch");
					this.__checkFighterDefense(code.toString(2));
					break;
				
				case "11000":
					!this.__checkFighterDefense("11000") && ft.walk("left");
					break;
				
				case "10011":
					ft.jump("right");
					break;
				
				case "11001":
					ft.jump("left");
					break;
				
				default:
					if(!ft.isAttacking
					&& !ft.isJumping
					&& !ft.isSpecialAttacking
					&& ft.state!=="beAttacked"){
						ft.wait();
					}
			}
		},
		
		/**
		 * 更新按功能键时斗士的动作
		 */
		__updateFighterFunctionKeysAction:function(keyName){
			var ft=this.__fighter,
				hash={
					"A":["light","boxing"],
					"B":["middle","boxing"],
					"C":["heavy","boxing"],
					"D":["light","kick"],
					"E":["middle","kick"],
					"F":["heavy","kick"]
				};

				ft.attack.apply(ft,hash[keyName]);
		},
		
		/**
		 * 检测斗士的防守状态
		 */
		__checkFighterDefense:function(keyCodeString){

			var ft=this.__fighter,
				adv=ft.adversary,
				hash={
					"10010":1,
					"10110":1,
					"11000":0,
					"11100":0
				},
				ret=false;

				if((adv.isAttacking || adv.isMagicPlaying)
				&& !ft.isJumping
				&& ((ft.lookAt==="right" && hash[keyCodeString]===0)
				|| (ft.lookAt==="left" && hash[keyCodeString]===1))){
					
					ret=true;
					ft.defense();
				}else{
					ft.defenseState="";
				}

				return ret;
		},
		
		/**
		 * 更新斗士特殊攻击的动作
		 */
		__updateFigtherSpeicalAttack:function(keyName){
			var Lib=aralork.lib.Lib,
				saCfg=this.__specialAttackedConfig,
				ft=this.__fighter,
				lookAt=ft.lookAt,
				ksq=this.__keySequence,
				cfgKsq,
				k,
				i,
				ckc,
				ksqStr;
				
			if(lookAt==="right"){
				ksqStr=ksq.join(",");
				ckc=this.__controlsKeyCode;
				
			}else if(lookAt==="left"){
				ksqStr=Lib.swapString(ksq.join(","),"RIGHT","LEFT");
				ckc=this.__controlsKeyCode ^ parseInt("01010",2); //将11000换为10010，10010换为11000，即把方向左键和方向右键交换
			}

			for(k in saCfg){
				cfgKsq=saCfg[k].keySequence;
				i=cfgKsq.length;
				while(i--){
					if(cfgKsq[i].join(",")===ksqStr && (parseInt(saCfg[k].keyValue,2) & ckc)===ckc){
						ft.specialAttack(k,this.__hashKeyToLevel[keyName]);
						this.__keySequence=[];
						return;
					}
				}
			}
			
			this.__updateFighterFunctionKeysAction(keyName);
		}
	})
);
