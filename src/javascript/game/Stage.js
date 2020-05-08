/**
 * @fileoverview 游戏场景类
 * @author Random | Random.Hao.Yang@gmail.com
 * 				  	http://t.sina.com.cn/random
 
 * @date 2011-03-16
 */

$import("aralork.utils.ResourceLoader");
$import("aralork.display.DisplayObject");

$import("game.ai.AIActionManager");
$import("game.SoundManager");
$import("game.FighterManager");
$import("stage.Screen");
$import("role.Fighter");

$import("config.Configure");
$import("config.Scene");
$import("config.MagicFighter");
$import("config.sound.Fighter");
$import("config.sound.Stage");
$import("config.Magic");
$import("config.HitEffect");
$import("config.fighterAction.RYU1");
$import("config.fighterAction.RYU2");
$import("aralork.events.EventDispatcher");

$package("game","Stage",

	/**
	 * 场景类
	 * @param {Object} parent
	 * @param {Number} scale
	 * @event
	 * 		resourceLoadComplete
	 * 		resourceLoading
	 */
	function(parent,scale){
		
		this.scale=scale || 1;

		this.__parent=parent || document.body;
		this.__eventDispatcher=new aralork.events.EventDispatcher(this);
		this.__totalCount=0;
		this.__currentCount=0;
		this.__stages={};
		this.__fighters={};
		this.__AIManagers={};
		this.__fighterManagers={};
		this.__isLoading=false;
		this.__currentParam=[];
		
		this.__initLoader();
	}.define({
		
		/**
		 * 添加事件监听
		 * @param {String} type
		 * @param {Function} handle
		 */
		addEventListener:function(type,handle){
			this.__eventDispatcher.addEventListener(type,handle);
			return this;
		},
		
		load:function(ftn1,ftn2,stageName,menu){
			if(this.__isLoading){
				return;
			}
			
			var rl=aralork.utils.ResourceLoader,
				sm=game.SoundManager,
				soundCfg=this.__getSoundCfg(stageName);
			
			this.__menu=menu;
			this.__isLoading=true;
			this.__currentParam=[ftn1,ftn2,stageName];
			this.__currentCount=0;
			
			rl.load("img",this.__getImageArr(ftn1,ftn2,stageName));
			sm.load(soundCfg.urls,soundCfg.names);
			
			this.__totalCount=rl.totalCount+sm.totalCount;
		},
		
		
		start:function(ftn1,ftn2,stageName){
			var fts=this.__fighters,
				sc=this.scale,
				parent=this.__parent,
				cfgMF=config.MagicFighter;
			
			function initFighter(ftn,lookAt,x){
				if(!fts[ftn]){
					
					fts[ftn]=new role.Fighter(ftn,lookAt,sc*200,sc,parent);
					fts[ftn].setPosition({x: x , z: 64});
					
					//有魔法技能则添加魔法				
					cfgMF[ftn] && fts[ftn].addMagic(cfgMF[ftn].ACTION_NAME,role.magic[cfgMF[ftn].CONSTRUCTOR_NAME],
										config.fighterAction[ftn][cfgMF[ftn].ACTION_NAME].MAGIC_FRAMES,
										config.Magic[cfgMF[ftn].TYPE]
									);
									
					fts[ftn].setScale(sc)
						.wait();
				}
			}

			this.__updateScreen(stageName);
			this.__initHPBar();

			initFighter(ftn1, "right", sc * 120);
			initFighter(ftn2, "left", sc * 240);

			!this.__fighterManagers[ftn1+"_"+ftn2] && (this.__fighterManagers[ftn1+"_"+ftn2]=new game.FighterManager(fts[ftn1],fts[ftn2],this.__menu)); 
			
			game.SoundManager.play(stageName+"_background",65525);

		},
		
		__initHPBar:function(){
			var barImg=aralork.utils.ResourceLoader.getImage(config.Configure.url+"images/background/bar.gif"),
				barContainer,
				sc=this.scale,
				bar1=new aralork.display.DisplayObject(this.__parent,"div",144,9),
				bar2=new aralork.display.DisplayObject(this.__parent,"div",144,9),
				
			barContainer=new aralork.display.DisplayObject(this.__parent,barImg,322,14);
			barContainer.setPosition({
				x:31 * sc,
				y:20 * sc,
				z:1024
			})
			.setSize({
				w:322 * sc,
				h: 14 * sc
			})
			.show();
			
			bar1.__entity.style.backgroundColor="#FFFF00";
			bar2.__entity.style.backgroundColor="#FFFF00";
			bar1.__entity.id="hpBar1";
			bar2.__entity.id="hpBar2";
			
			bar1.setPosition({
				x:31 * sc,
				y:22 * sc,
				z:1025
			})
			.setSize({
				w:144 * sc,
				h:10 * sc
			})
			.show();
			
			bar2.setPosition({
				x:208 * sc,
				y:22 * sc,
				z:1025
			})
			.setSize({
				w:144 * sc,
				h:10 * sc
			})
			.show();			
			
		},
		
		__updateScreen:function(stageName){
			var Screen=stage.Screen,
				Scene=config.Scene,
				rl=aralork.utils.ResourceLoader,
				sc=this.scale,
				
				behind=rl.getImage(Scene[stageName].behind.IMG),
				front=rl.getImage(Scene[stageName].front.IMG),
				bW=Scene[stageName].behind.WIDTH,
				bH=Scene[stageName].behind.HEIGHT,
				fW=Scene[stageName].front.WIDTH,
				fH=Scene[stageName].front.HEIGHT;
				
			Screen.entity=this.__parent;
			
			Screen.addBackground(new aralork.display.DisplayObject(null,behind,bW,bH));
			Screen.addBackground(new aralork.display.DisplayObject(null,front,fW,fH));
			Screen.setScale(sc);
		},
		
		/**
		 * 获取要加载的图片数组
		 * @param {String} ftn1
		 * @param {String} ftn2
		 * @param {String} stageName
		 */
		__getImageArr:function(ftn1,ftn2,stageName){
			if(!config.fighterAction[ftn1] || !config.fighterAction[ftn1] || !config.Scene[stageName]){
				return;
			}
			
			var ret=[],
				cfgFa1=config.fighterAction[ftn1],
				cfgFa2=config.fighterAction[ftn2],
				cfgScene=config.Scene[stageName],
				cfgMagic=config.Magic,
				cfgHE=config.HitEffect,
				k;
			
			//斗士
			for(k in cfgFa1){
				ret.push(cfgFa1[k].IMG);
			}
			for(k in cfgFa2){
				ret.push(cfgFa2[k].IMG);
			}
			
			//场景
			for(k in cfgScene){
				ret.push(cfgScene[k].IMG);
			}
			
			//魔法
			for(k in cfgMagic){
				ret.push(cfgMagic[k].IMG);
			}
			
			//打击的效果
			for(k in cfgHE){
				ret.push(cfgHE[k].IMG);
			}
			
			//血槽
			ret.push(config.Configure.url+"images/background/bar.gif");
			
			//斗士阴影
			ret.push(config.Configure.url+"images/background/fighterShadow.gif");
			
			return ret;
		},
		
		/**
		 * 获取要加载的声音数据
		 * @param {String} stageName
		 */
		__getSoundCfg:function(stageName){
			if(!config.sound.Stage[stageName]){
				return;
			}
			
			var ret={
					urls:[],
					names:[]
				},
				cfgFighter=config.sound.Fighter,
				cfgStage=config.sound.Stage[stageName],
				k;
				
			for(k in cfgFighter){
				ret.urls.push(cfgFighter[k]);
				ret.names.push(k);
			}
			for(k in cfgStage){
				ret.urls.push(cfgStage[k]);
				ret.names.push(stageName+"_"+k);
			}

			return ret;

		},
		
		__initLoader:function(){
			var rl=aralork.utils.ResourceLoader,
				sm=game.SoundManager,
				me=this;
				
			rl.addEventListener("loading",function(){
				me.__currentCount++;
				me.__updateProgress();
			});
			
			sm.addEventListener("loading",function(){
				me.__currentCount++;
				me.__updateProgress();
			});
		},
		
		__updateProgress:function(){
			if(!this.__totalCount){
				return;
			}
			
			var v=this.__currentCount/this.__totalCount;
			var me=this;
			this.__eventDispatcher.dispatchEvent("resourceLoading",v);
			if (v === 1) {
				this.__isLoading=false;
				setTimeout(function(){
					me.__eventDispatcher.dispatchEvent("resourceLoadComplete");
					me.start.apply(me,me.__currentParam);
				},16);
			}
		}
	})
);
