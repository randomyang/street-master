/**
 * @fileoverview 魔法装配器
 * @author Random | Random.Hao.Yang@gmail.com
 * @date 2010-12-06
 */

$package("role.magic","MagicAssembler",
	function(fighter){
		this.magicList={};
		
		this.__fighter=fighter;
		
		/**
		 * 帧配置数据
		 * 		"frame_{n}":{
					x:{x},
					y:{y}
				}
		 */
		this.__frameConfig={};
		
		this.__isFlipH=false;
		this.__scale=1;
		
		this.__initFighterEvent();
		
	}.define({
		
		/**
		 * 为指定动作添加魔法
		 * @param {String} actionName
		 * @param {IMagic} magicContructor
		 * @param {Object} frameConfig
		 * @param {Object} magicConfig
		 */
		addMagic:function(actionName,magicContructor,frameConfig,magicConfig){
			if(!actionName || !magicContructor || !config || this.magicList[actionName]){
				return;
			}
			var ft=this.__fighter;

			this.magicList[actionName]=new magicContructor(ft.parent,
												magicConfig,
												ft,
												"");
			
			this.magicList[actionName].addEventListener("complete",function(){

			});
			
			this.__frameConfig=frameConfig;
			this.setScale(+ft.scale);
			
			return this;
		},
		
		/**
		 * 设置比例
		 * @param {Number} sc
		 */
		setScale:function(sc){
			var k,
				list=this.magicList;
				
			for(k in list){
				list[k].setScale(sc);
			}
			this.__scale=sc;
			
			return this;
		},
		
		/**
		 * 设置被击打的对象
		 * @param {Fighter} adversary
		 */
		setAdversary:function(adversary){
			var k,
				list=this.magicList,
				adversaryQueue=(adversary.getBodyOverlayListQueue()).concat(adversary.getMagicBodyOverlayListQueue());

			for(k in list){
				this.__updateOverlayListCheckedQueue(list[k].attackOverlayList.queue,adversaryQueue);
			}
			
			return this;
		},
		
		clear:function(){
			var k,
				list=this.magicList;
				
			for(k in list){
				list[k].disappear();
			}
			
			return this;
		},
		
		__updateOverlayListCheckedQueue:function(queue,checkeQueue){
			var k,
				p,
				i,
				me=this;
			
			i=queue.length;
			
			while(i--){
				checkeQueue && queue[i].setOverlayList(checkeQueue);
				queue[i].addEventListener("overlaying",function(actionOverlay){
					me.clear();
				});
			}
		},
		
		/**
		 * 初始化斗士的事件绑定
		 */
		__initFighterEvent:function(){
			var me=this,
				ft=this.__fighter,
				cfg,
				mgc,
				_x,
				isFlipH;
				
			this.__fighter.addEventListener("playing",function(actionName,frame){
				cfg=me.__frameConfig["frame_"+frame];
				mgc=me.magicList[actionName];
				
				if(mgc && cfg){
					isFlipH=ft.lookAt==="left";
					//是否水平反转X
					_x=isFlipH ? (ft.width / me.__scale-cfg.x-mgc.width) * me.__scale : cfg.x * me.__scale;
					//是否右对齐
					isFlipH && (_x = _x - mgc.width + ft.width);

					mgc.setFlipH(isFlipH)
						.setPosition({
							x:ft.x + _x,
							y:ft.y + cfg.y * me.__scale
						});

					if (mgc.state !== "playing") {
						mgc.play(this.specialAttackLevel);
					}
				}
			});
		}
	})
);
