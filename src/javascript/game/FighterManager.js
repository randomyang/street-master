/**
 * @fileoverview 斗士管理类,其实。。。这个类。。。写得挺烂的。。。。。。将就用着吧。。
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2010-03-08
 */

$import("aralork.display.DisplayObject");
$import("aralork.utils.ResourceLoader");

$import("config.Configure");
$import("stage.Screen");
$import("role.controller.FighterController");
$import("game.HitEffectManager");
$import("game.HPBar");

$import("config.ai.AIActionTable");
$import("config.ai.FighterAIAction");
$import("config.ai.AIActionRespond");


$package("game","FighterManager",
	function(fighter1,fighter2,menu){
		this.__fighter1=fighter1;
		this.__fighter2=fighter2;
		this.__hitEffect1=new game.HitEffectManager(fighter1.parent,fighter1.scale);
		this.__hitEffect2=new game.HitEffectManager(fighter2.parent,fighter2.scale);
		this.__aiManagers={};
		this.__fighterShadow1=null;
		this.__fighterShadow2=null;
		this.__hpBars={};
		this.__fighterControllers={};
		this.__menu=menu;
		
		this.__init();
		
	}.define({
		
		setScale:function(sc){
			this.__fighter1.setScale(sc);
			this.__fighter2.setScale(sc);
			this.__hitEffect1.setScale(sc);
			this.__hitEffect2.setScale(sc);
		},
		
		__init:function(){
			var ft1=this.__fighter1,
				ft2=this.__fighter2,
				me=this,
				efs1=me.__hitEffect1.effects,
				efs2=me.__hitEffect2.effects;
				
			ft1.setAdversary(ft2);
			ft2.setAdversary(ft1);
			
			ft1.addEventListener("specialAttackComplete",function(){
				me.__updateFighterLookAt(this);
				me.__checkBodyOverlay(this);
			})
			.addEventListener("positionChanged",function(){
				if(!this.checkState("jump")){
					me.__updateFighterLookAt(this);
					!this.isSpecialAttacking && !ft2.isSpecialAttacking && me.__checkBodyOverlay(this);
				}
				
				me.__fighterShadow1.setPosition({
					x:this.x + this.width/2-me.__fighterShadow1.width/2
				});
				
			})
			
			//击中的效果
			.addEventListener("beAttacked",function(type,power,defensedPower,point){
					var crt=this.defenseState?
						efs1.defense:
						(power<10?efs1.light:efs1.heavy);

				crt.setPosition({
					x: point.x-crt.width/2,
					y: point.y-crt.height/2,
					z:128
				})
				.show()
				.play(1);
				
			});
			
			ft2.addEventListener("specialAttackComplete",function(){
				me.__updateFighterLookAt(this);
				me.__checkBodyOverlay(this);
			})
			.addEventListener("positionChanged",function(){
				if(!this.checkState("jump")){
					me.__updateFighterLookAt(this);
					!this.isSpecialAttacking && !ft1.isSpecialAttacking && me.__checkBodyOverlay(this);
				}
				
				me.__fighterShadow2.setPosition({
					x:this.x + this.width/2-me.__fighterShadow2.width/2
				});
				
			})
			
			//击中的效果
			.addEventListener("beAttacked",function(type,power,defensedPower,point){
				var crt=this.defenseState?
						efs2.defense:
						(power<10?efs2.light:efs2.heavy);
						
				crt.setPosition({
					x: point.x-crt.width/2,
					y: point.y-crt.height/2,
					z:128
				})
				.show()
				.play(1);
			});
			
			this.__hitEffect1.setScale(ft1.scale);
			this.__hitEffect2.setScale(ft2.scale);
			
			this.__initController();
			
//			setInterval(function(){
//				//ft2.specialAttack("wave_boxing",3);
//				//ft2.specialAttack("whirl_kick",3);
//				
//				//ft2.specialAttack("impact_boxing",3);
//				//ft2.jump("up");
//			},3000);
			
			this.__initAI(ft1);
			this.__menu.getIndex()!==2 && this.__initAI(ft2);
			
			
			this.__initHPBars(ft1,"ft1",1,$E("hpBar1"));
			this.__initHPBars(ft2,"ft2",-1,$E("hpBar2"));
			
			this.__initFighterShadow();
		},
		
		/**
		 * 初始化血槽
		 * @param {Fighter} ft
		 */
		__initHPBars:function(ft,ftType,direction,node){
			var me=this;
			
			if(!this.__hpBars[ftType]){
				this.__hpBars[ftType]=new game.HPBar(node);
				
				this.__hpBars[ftType].direction=direction;
				
				this.__hpBars[ftType].addEventListener("decreaseComplete",function(v,w){
					if(w<=0){
						stage.Screen.flash();
						this.reset();
					}
				});
				
				ft.addEventListener("beAttacked",function(type,power,defensedPower,point,hitSoundName){
					me.__hpBars[ftType].decrease(this.defenseState?defensedPower:power);
				});
				
			}else{
				this.__hpBars[ftType].reset();
			}
		},
		
		/**
		 * 初始化斗士的阴影
		 */
		__initFighterShadow:function(){
			var sdImg1=aralork.utils.ResourceLoader.getImage(config.Configure.url+"images/background/fighterShadow.gif",true),
				sdImg2=aralork.utils.ResourceLoader.getImage(config.Configure.url+"images/background/fighterShadow.gif",true),
				ft1=this.__fighter1,
				ft2=this.__fighter2,
				sc=ft1.scale,
				w=68 * sc,
				h=11 * sc;
				
				this.__fighterShadow1=new aralork.display.DisplayObject(ft1.parent,sdImg1,w,h);
				this.__fighterShadow1.setPosition({
					x:ft1.x + ft1.width/2-this.__fighterShadow1.width/2,
					y:ft1.y + ft1.height-this.__fighterShadow1.height+sc,
					z:32
				})
				.show();
				
				this.__fighterShadow2=new aralork.display.DisplayObject(ft2.parent,sdImg2,w,h);
				this.__fighterShadow2.setPosition({
					x:ft2.x + ft2.width/2-this.__fighterShadow2.width/2,
					y:ft2.y + ft2.height-this.__fighterShadow2.height+sc,
					z:32
				})
				.show();
				
		},
		
		
		/**
		 * 检测斗士的身体碰撞，这个方法写得很恶心。。。而且为了效率而直接调原始属性。。。原谅我这次这么写吧～～～～～~(￣▽￣)~
		 */
		__checkBodyOverlay:function(ft){
			var adv=ft.adversary,
				sc= +ft.scale,
				anm1=ft.action.animations["wait"],
				anm2=adv.action.animations["wait"],
				w1= 40*sc,
				w2= 40*sc,
				h1= 90*sc,
				h2= 90*sc,
				crtAnm1=ft.action.currentAnimation,
				crtAnm2=adv.action.currentAnimation,
				x1= parseInt(crtAnm1.__entity.style.left)+crtAnm1.__entity.offsetWidth/2-w1/2,
				x2= parseInt(crtAnm2.__entity.style.left)+crtAnm2.__entity.offsetWidth/2-w2/2,
				y1= parseInt(crtAnm1.__entity.style.top)+crtAnm1.__entity.offsetHeight/2-h1/2,
				y2= parseInt(crtAnm2.__entity.style.top)+crtAnm2.__entity.offsetHeight/2-h2/2;

			if(this.__checkOverlay(x1,x2,y1,y2,w1,w2,h1,h1)){
				
				if(x1<x2){

					crtAnm1.setPosition({
						x:crtAnm1.x-ft.scale*1.5
					});

					adv.setPosition({
						x:x1+w1-(adv.width-w2)/2
					});
					
				}else{
					crtAnm1.setPosition({
						x:crtAnm1.x+ft.scale*1.5
					});
					
					adv.setPosition({
						x:x1-w2-(adv.width-w2)/2
					});
				}
			}
				
				
		},
		
		__checkOverlay:function(x1,x2,y1,y2,w1,w2,h1,h2){
			return	x2 < x1 + w1
					&& x2 + w2 > x1
					&& y2 < y1 + h1
					&& y2 + h2 > y1;
		},
		
		
		
		/**
		 * 更新朝向
		 */
		__updateFighterLookAt:function(ft){
			var adv=ft.adversary;
				
			function updateAnimation(){
				!ft.checkState("jump") && ft.state!=="beAttacked" && !ft.isAttacking && ft.action.updateAnimation(null,ft.lookAt);
				!adv.checkState("jump") && adv.state!="beAttacked" && !adv.isAttacking && adv.action.updateAnimation(null,adv.lookAt);
			}
			
			if(!adv){
				return;
			}
			

//			if(ft.lookAt==="right"){
//				if(ft.x > adv.x+adv.action.animations["wait"].witdh-adv.scale*40){
//					ft.lookAt="left";
//					adv.lookAt="right";
//					updateAnimation();
//				}
//				
//			}else if(ft.lookAt==="left"){
//				if(adv.x > ft.x+ft.action.animations["wait"].witdh-ft.scale*40){
//					ft.lookAt="right";
//					adv.lookAt="left";
//					updateAnimation();
//				}
//			}


			if(ft.__isLookAtChanged && ft.x < adv.x){
				ft.__isLookAtChanged=false;
				ft.lookAt="right";
				adv.lookAt="left";
				updateAnimation();
				
			}else if(!ft.__isLookAtChanged && ft.x>=adv.x){
				ft.__isLookAtChanged=true;
				ft.lookAt="left";
				adv.lookAt="right";
				updateAnimation();
			}
		},
		
		
		__initController:function(){
//			var fc=new role.controller.FighterController(this.__fighter1,
//				Menu.keyConfig
//			);

			var ft1KeyConfig={
					"UP":87,
					"RIGHT":68,
					"DOWN":83,
					"LEFT":65,
					"A":74,
					"B":75,
					"C":76,
					"D":85,
					"E":73,
					"F":79
				},
				ft2KeyConfig={
					"UP":38,
					"RIGHT":39,
					"DOWN":40,
					"LEFT":37,
					"A":97,
					"B":98,
					"C":99,
					"D":100,
					"E":101,
					"F":102
				};

			!this.__fighterControllers[this.__fighter1.name] && (this.__fighterControllers[this.__fighter1.name]=new role.controller.FighterController(this.__fighter1,
				ft1KeyConfig
			));
			
			!this.__fighterControllers[this.__fighter2.name] && (this.__fighterControllers[this.__fighter2.name]=new role.controller.FighterController(this.__fighter2,
				this.__menu.getIndex()===1?ft2KeyConfig:null
			));

		},
		
		__initAI: function(fighter){
			var me=this,
				aim,
				AITable=config.ai.AIActionTable,
				ftAITable=config.ai.FighterAIAction[fighter.name.replace(/\d/g, "")],
				AIRespondTable=config.ai.AIActionRespond,
				types="",
				i;
				
				function update(actionName){
					types=AIRespondTable[actionName];
					if (types && types instanceof Array
					&& fighter.action.currentActionName==="wait"
					&& fighter.y+fighter.action.animations["wait"].height===fighter.basicY) {
						
						var tp = types[Math.floor(Math.random() * types.length)];
						if (typeof tp === "object") {
							aim.play(tp);
						}
						else 
							if (typeof tp === "string") {
								AITable[tp] && aim.play(AITable[tp]);
								ftAITable[tp] && aim.play(ftAITable[tp]);
							}
					}
				}
				
			
			if (!this.__fighterControllers[fighter.name].keyCfg) {
				
				aim=this.__aiManagers[fighter.name] = new game.ai.AIActionManager(fighter);
				
				fighter.adversary.action.addEventListener("actionStart",function(actionName){
					update(actionName);
				});
				
				//一直wait时的处理
				window.setInterval(function(){
					if(fighter.adversary.state==="wait" && fighter.state==="wait"){
						update("wait");
					}
				},4000);
			}
		}
	})
);
